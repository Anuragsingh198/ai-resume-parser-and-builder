import json
import time
from datetime import UTC, datetime
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

from pydantic import ValidationError

from app.core.config import settings
from app.schemas.job import ExtractedJobFields, JobPostingResponse
from app.services.job_listing_service import generate_next_job_id


class JobExtractionError(Exception):
    """Raised when Gemini cannot extract structured job data."""


def extract_job_posting(text: str, source_url: str) -> JobPostingResponse:
    if not settings.gemini_api_key:
        raise JobExtractionError("GEMINI_API_KEY is not configured.")

    job_id = generate_next_job_id()
    gemini_text = _generate_structured_job_json(text, source_url, job_id)
    extracted = _parse_extracted_fields(gemini_text)
    now = datetime.now(UTC)
    job_data = extracted.model_dump()
    job_data["source_name"] = extracted.source_name or _infer_source_name(source_url)
    job_data["job_id"] = extracted.job_id or _infer_job_id(source_url)

    return JobPostingResponse(
        **job_data,
        id=job_id,
        source_url=source_url,
        created_at=now,
        updated_at=now,
    )


def _generate_structured_job_json(text: str, source_url: str, job_id: str) -> str:
    models = [settings.gemini_model]
    if settings.gemini_fallback_model and settings.gemini_fallback_model not in models:
        models.append(settings.gemini_fallback_model)

    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": _build_extraction_prompt(text, source_url, job_id)}],
            }
        ],
        "generationConfig": {
            "temperature": 0.1,
            "response_mime_type": "application/json",
        },
    }
    max_retries = max(settings.gemini_max_retries, 1)
    last_error_message: str | None = None

    for model in models:
        endpoint = f"{settings.gemini_api_base_url}/models/{model}:generateContent"

        for attempt in range(max_retries):
            request = Request(
                endpoint,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "x-goog-api-key": settings.gemini_api_key,
                },
                method="POST",
            )

            try:
                with urlopen(request, timeout=30) as response:
                    response_body = response.read().decode("utf-8")

                data = json.loads(response_body)
                return data["candidates"][0]["content"]["parts"][0]["text"]
            except HTTPError as exc:
                error_body = exc.read().decode("utf-8", errors="replace")
                retryable = exc.code in {429, 500, 502, 503, 504}
                last_error_message = f"Gemini API returned HTTP {exc.code}: {error_body}"
                if retryable and attempt < max_retries - 1:
                    _sleep_before_retry(attempt)
                    continue
                break
            except URLError as exc:
                last_error_message = "Could not reach Gemini API."
                if attempt < max_retries - 1:
                    _sleep_before_retry(attempt)
                    continue
                raise JobExtractionError(last_error_message) from exc
            except TimeoutError as exc:
                last_error_message = "Timed out while calling Gemini API."
                if attempt < max_retries - 1:
                    _sleep_before_retry(attempt)
                    continue
                raise JobExtractionError(last_error_message) from exc
            except (KeyError, IndexError, TypeError, json.JSONDecodeError) as exc:
                raise JobExtractionError("Gemini API returned an unexpected response.") from exc

    raise JobExtractionError(last_error_message or "Gemini request failed after retries.")


def _sleep_before_retry(attempt: int) -> None:
    delay = settings.gemini_retry_base_delay_seconds * (2**attempt)
    time.sleep(max(delay, 0.0))


def _parse_extracted_fields(raw_text: str) -> ExtractedJobFields:
    try:
        data = json.loads(_strip_json_fence(raw_text))
        return ExtractedJobFields.model_validate(data)
    except (json.JSONDecodeError, ValidationError) as exc:
        raise JobExtractionError("Gemini returned invalid job JSON.") from exc


def _strip_json_fence(text: str) -> str:
    stripped = text.strip()
    if stripped.startswith("```"):
        stripped = stripped.removeprefix("```json").removeprefix("```").strip()
        stripped = stripped.removesuffix("```").strip()
    return stripped


def _infer_source_name(source_url: str) -> str | None:
    hostname = urlparse(source_url).hostname
    if not hostname:
        return None

    hostname = hostname.removeprefix("www.")
    return hostname.split(".")[0].title()


def _infer_job_id(source_url: str) -> str | None:
    parsed = urlparse(source_url)
    query = parse_qs(parsed.query)
    for key in ("jobId", "job_id", "jobid", "job", "id", "gh_jid", "reqId", "req_id"):
        value = query.get(key)
        if value and value[0]:
            return value[0]

    path_parts = [part for part in parsed.path.split("/") if part]
    for part in reversed(path_parts):
        if any(char.isdigit() for char in part):
            return part

    return None


def _build_extraction_prompt(text: str, source_url: str, job_id: str) -> str:
    trimmed_text = text[:25000]
    return f"""
Extract a job posting from the plain text below.

Return only valid JSON. Do not include markdown.
Use this exact schema:
{{
  "job_id": string | null,
  "title": string | null,
  "company_name": string | null,
  "locations": [
    {{
      "city": string | null,
      "state": string | null,
      "country": string | null,
      "remote": boolean | null
    }}
  ],
  "work_mode": "remote" | "hybrid" | "in_office" | "unknown" | null,
  "job_type": "full_time" | "part_time" | "contract" | "internship" | "temporary" | "other" | null,
  "experience_level": "entry" | "junior" | "mid" | "senior" | "lead" | "executive" | "other" | null,
  "experience_years": {{
    "min": number | null,
    "max": number | null
  }},
  "salary": {{
    "min": number | null,
    "max": number | null,
    "currency": string | null,
    "period": "hour" | "day" | "week" | "month" | "year" | "other" | null
  }},
  "description": string | null,
  "requirements": string[],
  "responsibilities": string[],
  "benefits": string[],
  "skills": string[],
  "education": string | null,
  "posted_at": "YYYY-MM-DD" | null,
  "opened_at": "YYYY-MM-DD" | null,
  "closed_at": "YYYY-MM-DD" | null,
  "application_url": string | null,
  "source_name": string | null,
  "company_id": null,
  "x_post": string | null
}}

Rules:
- Use null when a scalar value is not present.
- Use [] when a list has no clear values.
- Extract all mentioned job locations into the "locations" array.
- Extract job_id as the external/source job id from the source URL or job text.
- For URLs with query params like jobId=109379, set job_id to "109379".
- Normalize job_type, work_mode, experience_level, and salary.period to the allowed enum values.
- Extract compensation amount and currency when salary/compensation is present.
- Set salary.currency to an ISO 4217 currency code such as INR, USD, EUR, GBP, CAD, or AUD.
- Infer salary.currency from symbols or text when clear.
- Examples: ₹/Rs/INR -> INR and $/USD -> USD.
- Keep salary fields null when compensation is not present or not clear.
- Set work_mode as remote, hybrid, or in_office when the text clearly indicates it.
- Set work_mode to unknown when the job mentions workplace/location but the mode is unclear.
- Extract minimum and maximum years of experience from phrases like "3+ years", "3-5 years",
  "at least 4 years", or "up to 8 years".
- For "3+ years", use min 3 and max null.
- For "3-5 years", use min 3 and max 5.
- Do not invent company_id.
- Prefer the provided source URL as application_url only if no better application URL exists.
- For "x_post", generate a high-engagement, vertically-structured summary for X (Twitter).
- FORMAT: NEVER use paragraphs. Use exactly one line per detail.
- TEMPLATE:
  🚀 [Job Title] @ [Company]
  
  📍 [Location]
  💼 [Work Mode/Type]
  🛠️ [Top 2-3 Skills]
  💰 [Salary if available]
  [2-3 Hashtags]
  [Link]
- CONSTRAINT: The total character count MUST be strictly between 250 and 270 characters.
- ADVICE: If the post is too short, add more relevant keywords, hashtags, or a call to action to ensure it reaches at least 250 characters.
- LINK: ALWAYS end the "x_post" with a newline and this exact URL: https://jobhunch.in/jobs/{job_id}

Source URL: {source_url}

Plain text:
{trimmed_text}
""".strip()

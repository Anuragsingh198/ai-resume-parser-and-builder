import re
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urlparse

import requests
from fastapi import HTTPException, status
from fastapi.concurrency import run_in_threadpool

from app.schemas.scrapeSchemas import JobScrapeResponse


class _BodyTextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._inside_body = False
        self._inside_title = False
        self._skip_depth = 0
        self._text_parts: list[str] = []
        self._title_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        normalized_tag = tag.lower()
        if normalized_tag == "body":
            self._inside_body = True
        elif normalized_tag == "title":
            self._inside_title = True

        if normalized_tag in {"script", "style", "noscript", "svg"}:
            self._skip_depth += 1

    def handle_endtag(self, tag: str) -> None:
        normalized_tag = tag.lower()
        if normalized_tag == "body":
            self._inside_body = False
        elif normalized_tag == "title":
            self._inside_title = False

        if normalized_tag in {"script", "style", "noscript", "svg"} and self._skip_depth > 0:
            self._skip_depth -= 1

    def handle_data(self, data: str) -> None:
        cleaned = data.strip()
        if not cleaned:
            return

        if self._inside_title:
            self._title_parts.append(cleaned)

        if self._inside_body and self._skip_depth == 0:
            self._text_parts.append(cleaned)

    @property
    def title(self) -> str | None:
        title = _normalize_whitespace(" ".join(self._title_parts))
        return title or None

    @property
    def body_text(self) -> str:
        return _normalize_whitespace(" ".join(self._text_parts))


def _normalize_whitespace(value: str) -> str:
    normalized = unescape(value)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def _fetch_html(url: str) -> tuple[str, str]:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; AIResumeBuilder/1.0; +https://example.local)"
        )
    }
    response = requests.get(url, headers=headers, timeout=20)
    response.raise_for_status()

    content_type = response.headers.get("content-type", "").lower()
    if "text/html" not in content_type and "application/xhtml+xml" not in content_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The provided URL did not return an HTML page.",
        )

    return response.text, response.url


class JobScraperService:
    @staticmethod
    async def scrape_job_page(url: str) -> JobScrapeResponse:
        parsed = urlparse(url)
        if parsed.scheme not in {"http", "https"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only http and https URLs are supported.",
            )

        try:
            html, resolved_url = await run_in_threadpool(_fetch_html, url)
        except requests.exceptions.RequestException as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to fetch the target URL: {exc}",
            ) from exc

        parser = _BodyTextExtractor()
        parser.feed(html)
        body_text = parser.body_text

        if not body_text:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="No readable body text was found on the page.",
            )

        return JobScrapeResponse(
            url=resolved_url,
            title=parser.title,
            body_text=body_text,
            text_length=len(body_text),
        )

from html.parser import HTMLParser
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class ScrapeError(Exception):
    """Raised when a page cannot be fetched or parsed."""


class BodyTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self._in_body = False
        self._hidden_depth = 0
        self._parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "body":
            self._in_body = True

        if self._in_body and tag in {"script", "style", "noscript", "svg"}:
            self._hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if self._in_body and tag in {"script", "style", "noscript", "svg"}:
            self._hidden_depth = max(0, self._hidden_depth - 1)

        if tag == "body":
            self._in_body = False

    def handle_data(self, data: str) -> None:
        if self._in_body and self._hidden_depth == 0:
            text = data.strip()
            if text:
                self._parts.append(text)

    @property
    def text(self) -> str:
        return " ".join(" ".join(self._parts).split())


def extract_body_text(html: str) -> str:
    parser = BodyTextParser()
    parser.feed(html)
    parser.close()
    return parser.text


def scrape_job_body_content(url: str) -> str:
    request = Request(
        url,
        headers={
            "User-Agent": "JobHunchBot/0.1 (+https://jobhunch.local)",
            "Accept": "text/html,application/xhtml+xml",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            content_type = response.headers.get_content_type()
            if content_type not in {"text/html", "application/xhtml+xml"}:
                raise ScrapeError("URL did not return an HTML document.")

            charset = response.headers.get_content_charset() or "utf-8"
            html = response.read().decode(charset, errors="replace")
    except HTTPError as exc:
        raise ScrapeError(f"URL returned HTTP {exc.code}.") from exc
    except URLError as exc:
        raise ScrapeError("Could not fetch the URL.") from exc
    except TimeoutError as exc:
        raise ScrapeError("Timed out while fetching the URL.") from exc

    body_text = extract_body_text(html)
    if not body_text:
        raise ScrapeError("No body text found on the page.")

    return body_text

"""Check a short list of URLs you are allowed to request.

Run: py -3 labs/projects/link_checker.py links.txt
"""

from __future__ import annotations

import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


def parse_lines(text):
    urls = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if not stripped.startswith(("http://", "https://")):
            raise ValueError(f"Only http and https URLs are allowed: {stripped}")
        urls.append(stripped)
    return urls


def check_one(url, timeout=5):
    request = urllib.request.Request(
        url,
        method="HEAD",
        headers={"User-Agent": "pathline-link-checker"},
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, ""
    except urllib.error.HTTPError as exc:
        return exc.code, ""
    except (urllib.error.URLError, TimeoutError) as exc:
        return None, str(exc)


def check_all(urls, workers=8):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        statuses = pool.map(check_one, urls)
    return list(zip(urls, statuses))


def self_check():
    urls = parse_lines("# comment\n\nhttps://example.com\n")
    assert urls == ["https://example.com"]
    try:
        parse_lines("ftp://example.com")
    except ValueError:
        pass
    else:
        raise AssertionError("non-http URLs must be refused")


def main(argv):
    if len(argv) != 1:
        print("Use: link_checker.py links.txt", file=sys.stderr)
        return 1
    urls = parse_lines(Path(argv[0]).read_text(encoding="utf-8"))
    failed = False
    for url, (status, error) in check_all(urls):
        if status is None:
            failed = True
            print(f"ERROR {url} {error}")
        else:
            if status >= 400:
                failed = True
            print(f"{status} {url}")
    return 1 if failed else 0


if __name__ == "__main__":
    self_check()
    if len(sys.argv) == 1:
        print("Self-check passed. Pass a links.txt file to check URLs.")
    else:
        raise SystemExit(main(sys.argv[1:]))

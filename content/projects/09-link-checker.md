---
id: project-link-checker
track: project
level: Advanced
module: Advanced Python
title: Project — link checker
minutes: 30
keywords: urllib, timeout, asyncio, project
summary: Read a list of your own URLs and report which ones respond. Timeouts and HTTP errors are results, not crashes.
---

You have `links.txt`, one URL per line. The program prints `200 https://example.com` or `ERROR https://example.com timed out`. It checks URLs you are allowed to request: your sites, example domains, local servers. It is not a scanner for other people's networks. Keep the list short and the timeout honest.

File: `labs/projects/link_checker.py`.

## One URL, blocking

```python
import urllib.error
import urllib.request

def check_one(url, timeout=5):
    request = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "pathline-link-checker"})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, ""
    except urllib.error.HTTPError as exc:
        return exc.code, ""
    except Exception as exc:
        return None, str(exc)
```

`HTTPError` is also a response. A 404 is information. A timeout is the `Exception` branch. Narrow it to `urllib.error.URLError` and `TimeoutError` in your file so a bug in your own code still crashes.

HEAD is enough to ask "are you there?" Some servers reject HEAD. Fall back to GET once if the status is 405.

## Many URLs, one thread at a time, then overlap

The first version is a `for` loop. Ship that. Then overlap the waits with a thread pool, because this work is waiting on the network:

```python
from concurrent.futures import ThreadPoolExecutor

def check_all(urls, workers=8):
    with ThreadPoolExecutor(max_workers=workers) as pool:
        statuses = pool.map(check_one, urls)
    return list(zip(urls, statuses))
```

`pool.map` keeps the results in the same order as `urls`. That makes the report stable.

An asyncio version is the same shape with `asyncio.to_thread(check_one, url)` inside `asyncio.gather`, because `urlopen` is blocking. You do not need a new HTTP library to learn the scheduling. If you later use `httpx.AsyncClient`, the function `check_one` changes and `check_all` stays "run these and collect."

## Politeness

- Timeout every request. A hung server must not hang the program.
- Default workers to something small, like 8, not 500.
- Skip blank lines and lines that start with `#`.
- Refuse a URL that is not `http` or `https`.

:::try
Add `--fail-under 400` so the process exits 1 when any status is missing or 400 and above. Scripts and CI can use that exit code.
:::

:::solution
After `check_all`, scan the pairs. If a status is `None` or `>= fail_under`, remember a failure. `main` returns 1 if any failed, else 0. `sys.exit(main())`.
:::

:::quiz
Why is a 404 a result rather than a crash?
+ The site answered. The caller wants that code in the report
- urllib cannot represent 404
- HEAD requests never 404
because: HTTPError carries the status. Only a missing connection or a timeout is "no status."
:::

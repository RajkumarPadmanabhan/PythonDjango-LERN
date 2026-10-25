---
id: standard-library
track: python
level: Intermediate
module: Intermediate Python
title: The standard library you will actually use
minutes: 20
keywords: pathlib, json, logging, datetime, collections, itertools, functools
summary: Prefer the standard library before you install a package. These modules cover everyday work.
---

The standard-library map later in the course names the broader catalog. This lesson is the working set.

## logging

```python
import logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)
log.info("server starting")
try:
    1 / 0
except ZeroDivisionError:
    log.exception("could not divide")
```

`log.exception` inside an `except` records the traceback. Configure logging once at program start. Libraries call `getLogger(__name__)` and do not configure handlers themselves. Django configures logging from the `LOGGING` setting.

## collections, itertools, functools

| Tool | Use |
| --- | --- |
| `Counter` | Count hashable items |
| `defaultdict` | Auto-create missing values |
| `deque` | Fast append and pop at both ends |
| `namedtuple` | Tiny immutable records |
| `itertools.chain`, `islice`, `groupby` | Lazy sequence tools. `groupby` needs sorted input |
| `functools.partial` | Freeze some arguments |
| `functools.lru_cache` | Memoize a pure function |
| `functools.cache` | Unbounded memoization |

```python
from functools import partial
from itertools import islice

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(5))
print(list(islice((n * n for n in range(100)), 3)))
```

## Other daily modules

| Module | Use |
| --- | --- |
| `pathlib` | Paths |
| `json` | JSON text. Use Django's `JsonResponse` in views |
| `csv` | Spreadsheets |
| `datetime`, `zoneinfo` | Instants and civil times. Store UTC |
| `re` | Regular expressions |
| `math`, `statistics`, `random`, `secrets` | Numbers. `secrets` for tokens, not `random` |
| `argparse` | Command-line interfaces |
| `subprocess` | Run a process with an argument list, not a shell string |
| `unittest` | Tests in the standard library. `pytest` is a third-party runner many projects prefer |
| `urllib.request` | Simple HTTP. Use `httpx` or `requests` when you outgrow it |
| `sqlite3` | SQLite without Django. Django's ORM is the better default inside a Django project |
| `tomllib` | Read TOML (3.11+). Writing TOML needs a third-party package |
| `hashlib`, `hmac` | Digests and message authentication |
| `textwrap`, `shutil`, `tempfile` | Text wrapping, file copies, temporary files |
| `dataclasses`, `enum`, `typing` | Structure |
| `contextlib` | Helpers for `with` |
| `pprint` | Readable dumps while debugging |
| `sys`, `os`, `platform` | Interpreter and process details. Prefer `pathlib` over `os.path` for new code |

`random` is predictable if an attacker can observe it. Session tokens, password resets, and API keys come from `secrets.token_urlsafe()`.

:::tip
Before `pip install`, search the standard library. A dependency is a supply-chain and maintenance cost. Install one when the standard tool is a bad fit: HTTP clients, production servers, and Django itself are justified dependencies.
:::

:::quiz
Which module should generate a password-reset token?
+ secrets
- random
- json
because: secrets uses a cryptographic generator. random is for simulations and games, and its stream can be reconstructed.
:::

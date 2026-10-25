---
id: stdlib-map
track: reference
level: Reference
module: Language reference
title: Standard library map
minutes: 18
keywords: stdlib, module, catalog
summary: What the modules you will meet are for. The narrative lessons teach the ones you use while building. This page names the rest.
---

| Module | For |
| --- | --- |
| `abc` | Abstract base classes |
| `annotationlib` | Inspect deferred annotations (3.14+) |
| `argparse` | Command-line interfaces |
| `array`, `struct` | Packed binary data |
| `ast` | Python's own syntax tree |
| `asyncio` | Coroutines and the event loop |
| `base64`, `binascii` | Encode bytes as text |
| `bisect` | Insert into a sorted list |
| `builtins` | Names available without import |
| `calendar` | Calendars |
| `collections`, `collections.abc` | Counter, defaultdict, deque, and the collection protocols |
| `compression.zstd` | Zstandard (3.14+) |
| `concurrent.futures` | Thread and process pools |
| `configparser` | INI files |
| `contextlib`, `contextvars` | `with` helpers, and context-local state |
| `copy` | Shallow and deep copies |
| `csv` | CSV |
| `dataclasses` | Record classes |
| `datetime`, `zoneinfo`, `time`, `calendar` | Time |
| `decimal`, `fractions` | Exact numbers |
| `difflib`, `filecmp` | Comparisons |
| `email` | Email messages. Django wraps this |
| `enum` | Enumerations |
| `functools` | partial, cache, reduce, wraps |
| `gc`, `weakref` | Garbage collection and non-owning references |
| `getpass` | A password prompt that does not echo |
| `glob`, `fnmatch`, `pathlib`, `os`, `shutil`, `tempfile` | Files and processes. Prefer pathlib |
| `graphlib` | Topological sort |
| `hashlib`, `hmac`, `secrets` | Digests, MACs, and tokens |
| `heapq` | A heap |
| `html`, `html.parser` | Escape HTML and a simple parser |
| `http`, `urllib`, `socket`, `ipaddress` | HTTP and network primitives |
| `importlib` | The import system, programmatically |
| `inspect` | Read signatures and source |
| `io` | In-memory files |
| `itertools` | Iterator algebra |
| `json` | JSON |
| `logging` | Logs |
| `math`, `statistics`, `random`, `cmath` | Numbers. secrets, not random, for tokens |
| `multiprocessing`, `threading`, `queue`, `subprocess` | Processes, threads, queues, child processes |
| `operator` | Function versions of operators |
| `pickle` | Trusted serialization only |
| `platform`, `sys`, `sysconfig` | The interpreter |
| `pprint` | Debug printing |
| `profiling`, `cProfile`, `timeit`, `tracemalloc` | Measurement. `profile` is deprecated |
| `re` | Regular expressions |
| `sqlite3` | SQLite. Use Django's ORM inside Django |
| `string`, `textwrap` | String constants and wrapping |
| `tomllib` | Read TOML |
| `types`, `typing`, `typing_extensions` | Dynamic types and hints |
| `unittest`, `doctest` | Tests |
| `uuid` | Identifiers |
| `venv` | Virtual environments |
| `warnings` | Warning filters |
| `xml` | XML. Untrusted XML needs a parser that disables entity expansion |
| `zipfile`, `gzip`, `bz2`, `tarfile` | Archives |

If a module is not in this table, it still may exist. The index at [docs.python.org/3/library/index.html](https://docs.python.org/3/library/index.html) is the complete list, and it grows. Learn a module when a problem needs it. Do not memorize the table. Know that it is here so you do not install a package for a job the language already does.

## Django packages, the same way

Always in a project: `admin`, `auth`, `contenttypes`, `sessions`, `messages`, `staticfiles`.

Often: `humanize`, `postgres`, `sites`, `sitemaps`, `syndication`, `redirects`, `gis` (GeoDjango).

Core you import: `django.db.models`, `django.urls`, `django.shortcuts`, `django.http`, `django.forms`, `django.views`, `django.contrib.auth`, `django.test`, `django.conf`, `django.core.management`, `django.core.mail`, `django.core.cache`, `django.core.files`, `django.dispatch`, `django.utils`, `django.tasks` (Django 6), `django.middleware.csp` (Django 6).

Third-party you will meet next: Django REST framework, WhiteNoise, gunicorn, Pillow for `ImageField`, a database driver (`psycopg` for PostgreSQL).

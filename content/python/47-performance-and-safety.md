---
id: performance-and-safety
track: python
level: Advanced
module: Advanced Python
title: Performance habits and safer Python
minutes: 14
keywords: performance, secrets, pickle, eval, injection
summary: Measure before you rewrite. Most web time is the database. A few Python functions are unsafe on untrusted input by design.
---

## Measure

`timeit` measures a snippet. `cProfile` or `profiling.tracing` shows which functions ran. A sampling profiler shows where a running process spends time without restarting it. Guessing is usually wrong. In a Django app, `django-debug-toolbar` or the query log will show you the N+1 query that dominates the request. Fixing that beats rewriting a loop in clever Python.

Habits that are worth it before you profile:

- Do not build a giant string with `+=` in a loop. Append to a list and `join`.
- Do not call the database inside a loop over rows. Fetch the related rows together (`select_related`, `prefetch_related`, or Django 6.1's `FETCH_PEERS`).
- Use a set for membership of a large collection.
- Cache a pure computation that is actually expensive. Know how you invalidate it.

## Functions that run untrusted text

| Function | Risk |
| --- | --- |
| `eval`, `exec` | Run Python. Do not feed them request data |
| `pickle.loads` | Can run code during load. Only unpickle data you signed or stored yourself |
| `subprocess` with `shell=True` and a formatted string | Shell injection. Pass a list of arguments and `shell=False` |
| `yaml.load` without a safe loader | Can construct arbitrary objects. Use `yaml.safe_load` |
| Building SQL with f-strings | SQL injection. The ORM parameterizes. If you write raw SQL, pass parameters, do not interpolate |

`secrets` for tokens. `hashlib` for digests. Passwords are not hashed with a single SHA-256. Django's password hashers use a slow algorithm (PBKDF2 by default, with a high iteration count) so a stolen database is expensive to crack. You call `django.contrib.auth` and you do not invent a hasher.

## Algorithmic accidents

Nested loops over two large querysets, repeated regex backtracking, and loading a whole file to answer "what is the first line?" are the usual blow-ups. Stream files. Paginate querysets. Cap the size of uploads and of request bodies. Django's `DATA_UPLOAD_MAX_MEMORY_SIZE` is one of those caps.

:::tip
Readable code that does one query is faster than clever code that does fifty. Performance work starts at the boundary, not at the bytecode.
:::

:::quiz
Why is pickle.loads unsafe on a request body?
+ Unpickling can execute attacker-controlled code
- Pickle is slower than JSON
- Pickle only works on lists
because: The pickle format can name callables. JSON parses data. Use JSON at the boundary, and pickle only for data you trust.
:::

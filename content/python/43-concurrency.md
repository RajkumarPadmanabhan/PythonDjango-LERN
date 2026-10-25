---
id: concurrency
track: python
level: Advanced
module: Advanced Python
title: Threads, processes, and the GIL
minutes: 16
keywords: GIL, threading, multiprocessing, queue, race
summary: Threads share memory and, on the default build, the GIL. Processes do not share memory. IO waits benefit from threads. CPU work benefits from processes or native code.
---

The global interpreter lock (GIL) is a mutex in the default CPython build. Only one thread runs Python bytecode at a time. Threads still help when the work is waiting: disk, network, a database driver that releases the GIL around the wait. They do not speed up a tight loop of pure Python arithmetic.

```python
from concurrent.futures import ThreadPoolExecutor
import urllib.request

def load(url):
    with urllib.request.urlopen(url, timeout=10) as response:
        return response.status

urls = ["https://example.com", "https://www.python.org"]
with ThreadPoolExecutor(max_workers=4) as pool:
    print(list(pool.map(load, urls)))
```

`concurrent.futures` is the interface to prefer. `ThreadPoolExecutor` for waiting. `ProcessPoolExecutor` for CPU work. Processes start slower and require arguments to be picklable. They do not share your lists. Communication goes through queues, pipes, or return values.

## Races

Two threads appending to one list can interleave. The list's own `append` is protected well enough that you will not corrupt the list object, but a read-modify-write is not atomic:

```python
# count = count + 1 is load, add, store. Another thread can run between them.
```

Protect that with a `threading.Lock`, or do the update in one thread. `queue.Queue` is the safe way to hand work between threads.

A Django request is typically handled by a worker process (gunicorn, uvicorn). Do not start unbounded threads inside a request. You will exhaust memory under load. Background work belongs in a task queue or Django's tasks framework, with a worker process sized on purpose.

## Free-threading

Python 3.13 made a free-threaded build supported as an experiment. 3.14 supports it officially. 3.15 adds a stable ABI for free-threaded extensions (`abi3t`). The default build most installers give you still has a GIL unless you opt into the free-threaded binary. Do not write code that assumes the GIL has gone away. Locks that were correct with the GIL remain the correct design.

:::watch
`multiprocessing` on Windows must protect the entry point with `if __name__ == "__main__"`. The child process imports the module. Without the guard it imports, spawns, and imports again.
:::

:::quiz
Which workload gets faster with threads on the default GIL build?
+ Many tasks that spend their time waiting on the network
- A pure Python loop adding numbers on every core at once
- Both, equally
because: Threads waiting on IO release the GIL. A pure Python arithmetic loop holds it, so extra threads do not run bytecode in parallel.
:::

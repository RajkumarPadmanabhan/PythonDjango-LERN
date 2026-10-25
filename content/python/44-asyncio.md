---
id: asyncio
track: python
level: Advanced
module: Advanced Python
title: asyncio
minutes: 18
keywords: async, await, coroutine, gather, event loop, task
summary: async and await schedule work on one thread. The event loop runs a coroutine until it awaits, then runs another that is ready.
---

`async def` defines a coroutine function. Calling it does not run it. It returns a coroutine object. `asyncio.run` starts a loop and drives that coroutine until it finishes.

```python
import asyncio

async def fetch(name, delay):
    await asyncio.sleep(delay)
    return name

async def main():
    results = await asyncio.gather(fetch("a", 0.1), fetch("b", 0.1))
    print(results)

asyncio.run(main())
```

`await` pauses this coroutine and gives the loop a chance to run others. `asyncio.sleep` is a stand-in for any truly async operation. `time.sleep` blocks the whole thread, including the loop, and defeats the point.

`gather` runs awaitables concurrently and waits for all of them. If one raises, the default is to let that exception surface. `TaskGroup` (3.11+) is the structured form: if one task fails, the others are cancelled and you get an `ExceptionGroup`.

## What is allowed

- Await a coroutine, a task, or any object with `__await__`.
- Call ordinary functions. If they take a long time or block on IO, they stall the loop. Push blocking calls to `asyncio.to_thread`.
- Share data without a lock only if you never `await` in the middle of an update. Between awaits, your code is atomic on that loop because nothing else runs.

You cannot use `await` outside an `async def`. You should not call `asyncio.run` from inside a running loop. Django's ASGI handler already has a loop. An async view is `async def` and the server awaits it. Mixing a synchronous ORM call into an async view blocks the worker. Django's async ORM API exists for this; if you are on the sync ORM, use a sync view. Sync is the right default until you are sure the request is dominated by waiting on many outbound calls.

## Async for and with

`async for` walks an async iterator. `async with` uses `__aenter__` and `__aexit__`. HTTP clients such as `httpx` provide both.

:::watch
A coroutine that you create and never await prints a warning and does no work. `fetch("a", 1)` alone does nothing. `await` it, or schedule it with `create_task` and keep a reference so it is not garbage-collected.
:::

:::quiz
What does calling an async def function return?
+ A coroutine object that has not run yet
- The return value, after running the body immediately
- A thread
because: async def builds a coroutine. The event loop runs it only when you await it or pass it to asyncio.run.
:::

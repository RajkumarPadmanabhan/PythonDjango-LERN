---
id: tasks-cache-channels
track: django
level: Advanced
module: Advanced Django
title: Tasks, cache, and channels
minutes: 16
keywords: task, enqueue, cache, Celery, channels, websocket
summary: Slow work leaves the request. Django 6 queues tasks. The cache stores expensive reads. Channels serves websockets when you truly need them.
---

## Background tasks

Django 6's tasks framework defines and enqueues work. A worker outside the request runs it. Django does not ship a production worker. The built-in backends are for development and tests. A production backend (or Celery, or another queue) executes the function.

```python
from django.core.mail import send_mail
from django.tasks import task

@task
def email_users(emails, subject, message):
    return send_mail(subject, message, None, emails)

email_users.enqueue(
    emails=["ada@example.com"],
    subject="Saved",
    message="Your task was saved.",
)
```

Configure `TASKS` the way you configure `CACHES`. Call `enqueue` after the database commit (`transaction.on_commit`) if the task reads rows the request just wrote.

Celery remains the common choice when you need retries, schedules, and a mature broker (Redis or RabbitMQ). The idea is the same: the view enqueues, the worker performs, the broker holds the queue. Do not start a thread per request.

Django 6.1 lets `task()` pass extra keyword arguments through to the backend's task class, and task objects can be pickled.

## Cache

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
    }
}
```

LocMem is per process and fine for development. Production wants Redis or Memcached so every gunicorn worker sees the same cache. `cache.get` / `cache.set` / `cache.get_or_set` are the API. `@cache_page` caches a whole response and is wrong for pages that contain a user's private data unless the cache key varies on the user. Caching a public homepage is the good case.

Per-view caches and CDNs must not store a response that includes a CSRF token or a CSP nonce for a later visitor. Django's CSP docs call this out. A nonce reused across users defeats the policy.

## Channels

Django Channels adds ASGI routing for websockets: a consumer class, a channel layer (Redis) so any worker can publish to a connection, and `daphne` or uvicorn as the server. Use it when the product is a live stream. Polling a normal view is simpler and often enough for "is the task done yet?"

A websocket is another entry point. It needs the same authentication and the same queryset rules. A consumer that accepts a task id and does not check the owner is the same bug as a view that does not check the owner.

:::tip
If the work takes longer than a request should (sending email, generating a PDF, calling a slow API), enqueue it and show the user a state they can refresh. If the work is a single indexed query, do it in the request.
:::

:::quiz
Why not cache a private task list with cache_page?
+ The cached HTML can be served to a different user
- cache_page only works on the admin
- JSON cannot be cached
because: A page cache key that ignores the user shares one user's data with the next visitor.
:::

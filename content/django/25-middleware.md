---
id: middleware
track: django
level: Advanced
module: Views, auth, and requests
title: Middleware
minutes: 14
keywords: middleware, process_request, process_response, order, CSRF
summary: Middleware is a layer around every request. Order is the behavior. Write middleware only when every view needs the same policy.
---

The default stack, top to bottom on the way in, bottom to top on the way out:

| Middleware | Role |
| --- | --- |
| `SecurityMiddleware` | HTTPS redirects, HSTS, and other security headers |
| `SessionMiddleware` | Loads the session |
| `CommonMiddleware` | URL slash redirects, some encoding |
| `CsrfViewMiddleware` | Checks the CSRF token on unsafe methods |
| `AuthenticationMiddleware` | Sets `request.user` |
| `MessageMiddleware` | Attaches the message storage |
| `XFrameOptionsMiddleware` | Clickjacking protection |
| `ContentSecurityPolicyMiddleware` | Django 6 CSP headers, when you enable it |

`AuthenticationMiddleware` must run after `SessionMiddleware`, because the user is loaded from the session. CSRF must be able to see the session. Do not reorder these unless you know which dependency you are breaking.

A middleware class:

```python
class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = request.headers.get("X-Request-ID", "")
        response = self.get_response(request)
        if request.request_id:
            response["X-Request-ID"] = request.request_id
        return response
```

Add the dotted path to `MIDDLEWARE`. `__init__` runs once per process. `__call__` runs per request. Code before `get_response` sees the request on the way in. Code after sees the response on the way out. If you return early, you skip the view.

`process_exception` and the older hook methods still exist. You rarely need them. `process_view` runs after the URL is resolved and before the view.

:::why
Middleware is global. A bug in it is a bug in every page, including the admin and the login form. A decorator or a mixin is the better scope when the policy applies to some views. Middleware is right for sessions, security headers, and a request id.
:::

:::quiz
Why must AuthenticationMiddleware come after SessionMiddleware?
+ The user is loaded from the session, which is not available until the session middleware has run
- Alphabetical order is required
- CSRF fails otherwise only
because: Each middleware assumes the ones above it have done their job. The defaults are ordered to satisfy those assumptions.
:::

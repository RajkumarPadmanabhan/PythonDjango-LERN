---
id: security
track: django
level: Advanced
module: Advanced Django
title: Security checklist
minutes: 18
keywords: CSRF, XSS, SQL injection, clickjacking, HTTPS, CSP, SECRET_KEY
summary: Django blocks the common web attacks if you use its tools and do not reintroduce the bug in a shortcut.
---

| Attack | What Django does | How people undo it |
| --- | --- | --- |
| SQL injection | The ORM parameterizes queries | f-strings in `raw()` or `extra()` |
| XSS | Templates escape | `\|safe`, `mark_safe`, HTML built with f-strings |
| CSRF | Token on unsafe requests, checked by middleware | `csrf_exempt` on a cookie-authenticated view |
| Clickjacking | `X-Frame-Options` | Removing the middleware so a third party can iframe you |
| Session theft | HTTP-only cookies, `SECURE` flags, HTTPS | `DEBUG` and wild `ALLOWED_HOSTS` in production |
| Password theft | Slow hashers | A custom hasher that is a single fast digest |
| Host header attacks | `ALLOWED_HOSTS` | `ALLOWED_HOSTS = ["*"]` because it was easier |

`python manage.py check --deploy` reports the production settings you forgot: `DEBUG`, `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, `SECURE_HSTS_SECONDS`, a real `SECRET_KEY`.

## CSP

Django 6 can send a Content-Security-Policy header.

```python
from django.utils.csp import CSP

MIDDLEWARE += ["django.middleware.csp.ContentSecurityPolicyMiddleware"]
SECURE_CSP = {
    "default-src": [CSP.SELF],
    "script-src": [CSP.SELF, CSP.NONCE],
    "img-src": [CSP.SELF, "https:"],
}
```

Add `django.template.context_processors.csp` and put the nonce on inline scripts: `nonce="{{ csp_nonce }}"`. Django 6.1's `{% csp_nonce_attr %}` prints the attribute on external script and link tags. A strict CSP is the second line of defense when an XSS bug slips in. It does not replace escaping.

Start with `SECURE_CSP_REPORT_ONLY` so the browser reports violations without blocking, then enforce.

## Authorization, repeated because it is the bug

Every view that touches a row should be able to finish this sentence: "this user may do this because ___." Login is not the sentence. Filter by owner or check a permission. Return 404 when the object exists but this user must not know it exists. Return 403 when they may know and still may not act.

## Dependencies

Pin Django to a supported series and upgrade the patch release when a security release ships. Django 6.1.2 and 5.2.18 (October 2026) are examples of that habit, not versions to freeze forever. Read the security notes. They name the setting or the API that changed.

:::watch
`@csrf_exempt` on a view that uses the session cookie is a forged-request bug. Exempt only machine endpoints that authenticate with a header or a signature, and still authenticate them.
:::

:::quiz
What does the \|safe filter do?
+ It marks the value as already escaped and the template will not escape it
- It strips HTML tags
- It enables the CSP header
because: safe is an instruction to the autoescaper. User content must not be marked safe.
:::

---
id: deployment
track: django
level: Advanced
module: Ship it
title: Deployment
minutes: 18
keywords: gunicorn, uvicorn, whitenoise, HTTPS, environment, migrate
summary: Production is DEBUG off, a real server, collected static files, HTTPS, and secrets in the environment. Ship the same commit you tested.
---

## The process

1. `DEBUG = False`. `ALLOWED_HOSTS` lists the real host.
2. `SECRET_KEY` comes from the environment and is not the development fallback.
3. A production database (PostgreSQL is the usual choice) in `DATABASES`, with a user that is not a superuser.
4. `python manage.py migrate` as part of release, before traffic moves.
5. `python manage.py collectstatic`.
6. A WSGI or ASGI server, several workers, behind a proxy that terminates HTTPS.
7. `check --deploy` is clean, or you have a written reason for each warning.

```powershell
python -m pip install gunicorn whitenoise
gunicorn config.wsgi:application --workers 3 --bind 127.0.0.1:8000
```

Gunicorn does not serve Windows. On Windows for a local production-like run, use `waitress`, or deploy on Linux. The development machine can keep using `runserver`. The public host should be Linux or a container.

WhiteNoise serves the files `collectstatic` gathered, from the same app process. A reverse proxy (nginx, Caddy) can serve them instead and should proxy the application over HTTP on localhost. The proxy sets `X-Forwarded-Proto`. Enable `SECURE_PROXY_SSL_HEADER` only when that proxy is the only thing that can reach the app, or a client can forge the header and make Django think a request was HTTPS.

## Settings that matter on the day you go live

```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 60  # raise this only after HTTPS works
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

Start HSTS at a small max-age. A mistake with `preload` and a large max-age is painful to undo.

## Mail

Django 6 adds `MAILERS`, a dict of email backends similar to `CACHES`. `EMAIL_BACKEND` still selects the default. Use the console backend in development and an SMTP or API backend in production. Do not print password-reset links into a log file anyone can read.

## Releases

Run migrations before the new code serves traffic if the code needs the new column. Expand-then-contract when you cannot stop the site: add a nullable column, deploy code that writes both, backfill, deploy code that reads the new column, then remove the old one. A single `RemoveField` while old workers are still running is an outage.

Log to stdout and let the platform collect it. Configure `LOGGING` with a level of INFO and a formatter that includes the time and the logger name. Do not log request bodies.

:::watch
`runserver 0.0.0.0:80` on a public machine is not a deployment. It is a development server with a traceback page if DEBUG is on, and a single process if it is off.
:::

:::quiz
What does collectstatic do?
+ Copies static files into STATIC_ROOT so a production server can serve them
- Uploads media files to the CDN automatically
- Minifies templates
because: App static directories are source. STATIC_ROOT is the gathered artifact the live server uses.
:::

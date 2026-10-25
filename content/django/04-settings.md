---
id: settings
track: django
level: Beginner
module: Foundations
title: Settings
minutes: 18
keywords: settings, DEBUG, SECRET_KEY, ALLOWED_HOSTS, DATABASES, INSTALLED_APPS
summary: settings.py is Python. It binds names Django reads. Secrets come from the environment. DEBUG never stays True in production.
---

Django reads `DJANGO_SETTINGS_MODULE`, imports that module, and uses uppercase names as settings. Because it is Python, you can compute a value. Keep the file boring. A setting that imports half the project creates cycles.

The names you will touch first:

| Setting | Meaning |
| --- | --- |
| `SECRET_KEY` | Signs sessions, tokens, and password-reset links. Leak it and an attacker can forge those |
| `DEBUG` | True shows tracebacks and serves static files. False in production |
| `ALLOWED_HOSTS` | Hostnames Django will serve. Empty is fine only while DEBUG is True and you use localhost |
| `INSTALLED_APPS` | Apps Django loads |
| `MIDDLEWARE` | Ordered hooks around every request |
| `ROOT_URLCONF` | The module of the root URL patterns |
| `TEMPLATES` | Engines and where templates are found |
| `DATABASES` | One or more databases. The lab uses SQLite |
| `AUTH_PASSWORD_VALIDATORS` | Rules for user passwords |
| `LANGUAGE_CODE`, `TIME_ZONE`, `USE_I18N`, `USE_TZ` | Language and time. Keep `USE_TZ` True |
| `STATIC_URL`, `STATIC_ROOT` | Where static files are referenced and where `collectstatic` gathers them |
| `DEFAULT_AUTO_FIELD` | On Django 6 this already defaults to `BigAutoField`. Setting it explicitly is still clear |

Read secrets from the environment:

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = os.environ.get("DJANGO_DEBUG", "1") == "1"
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
```

The fallback key is for your laptop only. Production must set `DJANGO_SECRET_KEY`. A missing production key should crash the process, not fall back. One pattern:

```python
if not DEBUG:
    SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
```

`os.environ["DJANGO_SECRET_KEY"]` raises `KeyError` when the variable is absent. That is the failure you want during boot, not a signed-session incident later.

## Multiple settings files

A common split is `config/settings/base.py`, `dev.py`, `prod.py`. `dev.py` does `from .base import *` and sets `DEBUG = True`. You choose with `DJANGO_SETTINGS_MODULE=config.settings.prod`. The lab keeps one file so the first reading is smaller. Split when the `if DEBUG` branches outgrow the file.

## Checks

`python manage.py check` runs Django's system checks. `check --deploy` adds the production warnings: `DEBUG`, `ALLOWED_HOSTS`, HTTPS settings, a strong `SECRET_KEY`. Run it before you deploy.

:::watch
`from config.settings import DEBUG` inside an app couples that app to one project and breaks reusable apps. Apps should use `django.conf.settings`, which is a proxy that works after Django has loaded:

```python
from django.conf import settings
if settings.DEBUG:
    ...
```
:::

:::quiz
What happens if SECRET_KEY leaks from a production server?
+ Attackers can forge session cookies and other signed values
- Only the admin color scheme changes
- Django rotates it automatically
because: SECRET_KEY is the signing key. Treat it like a password. Keep it in the environment, not in git.
:::

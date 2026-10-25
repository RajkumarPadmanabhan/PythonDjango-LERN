---
id: static-files
track: django
level: Beginner
module: Foundations
title: Static files and media
minutes: 12
keywords: static, collectstatic, STATIC_URL, WhiteNoise, media
summary: Static files are CSS, JavaScript, and images you ship. Media files are uploads. They are served differently.
---

Put project CSS in `tasks/static/tasks/site.css`. The doubled folder matches the template rule.

```django
{% load static %}
<link rel="stylesheet" href="{% static 'tasks/site.css' %}">
```

With `DEBUG=True`, `django.contrib.staticfiles` serves these files. With `DEBUG=False`, Django does not. You run `python manage.py collectstatic`, which copies files into `STATIC_ROOT`, and the production server or WhiteNoise serves that directory.

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

`ManifestStaticFilesStorage` hashes filenames so browsers pick up changes instead of keeping a year-old CSS file. It is the storage to use once you are deploying. Django 6 makes the manifest order stable, which keeps noisy diffs out of the manifest file.

## Media is not static

User uploads go to `MEDIA_ROOT` and are referenced with `MEDIA_URL`. Do not put uploads in the static folder. Do not trust an uploaded filename or an uploaded SVG. The uploads lesson covers validation. In production, a dedicated file store (an object bucket) is more common than a folder on the web server's disk.

:::why
Static files are part of the deployment artifact. They can be cached forever if the URL changes when the contents change. Media files belong to a user and must follow the same authorization as the row that points at them. A file that is served by nginx with no check is public, even if the Django view that lists it is login-protected.
:::

:::quiz
Why doesn't Django serve static files when DEBUG is False?
+ Production serving is the web server's job, or a storage backend's, after collectstatic
- Static files only exist in development
- DEBUG=False deletes the static directory
because: runserver's static serving is a convenience. collectstatic plus a real server is the deployment path.
:::

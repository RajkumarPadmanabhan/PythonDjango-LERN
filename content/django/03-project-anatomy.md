---
id: project-anatomy
track: django
level: Beginner
module: Foundations
title: Project and app anatomy
minutes: 16
keywords: settings, urls, wsgi, asgi, apps.py, models, views
summary: Each file Django generates has one job. Learn the map before you add features.
---

A new project looks like this. Names match the lab, which uses `config` as the project package and `tasks` as the app.

```text
taskboard/
  manage.py
  config/
    __init__.py
    settings.py
    urls.py
    wsgi.py
    asgi.py
  tasks/
    __init__.py
    admin.py
    apps.py
    models.py
    views.py
    urls.py
    forms.py
    tests.py
    migrations/
    templates/tasks/
```

| File | Job |
| --- | --- |
| `manage.py` | Sets the settings module and dispatches commands |
| `config/settings.py` | Configuration: apps, database, templates, middleware |
| `config/urls.py` | The root URL conf. Includes each app |
| `config/wsgi.py` | Entry for synchronous WSGI servers such as gunicorn |
| `config/asgi.py` | Entry for ASGI servers such as uvicorn, including websockets |
| `tasks/apps.py` | App config, including the app's label and the default auto field |
| `tasks/models.py` | Model classes |
| `tasks/views.py` | Callables that handle requests |
| `tasks/urls.py` | This app's URL patterns |
| `tasks/admin.py` | What the admin site shows |
| `tasks/forms.py` | Form classes |
| `tasks/tests.py` | Tests |
| `migrations/` | Ordered database schema changes |
| `templates/` | HTML templates |

You can split `views.py` into a package later (`views/lists.py`). Do that when the file is hard to navigate, not on the first day.

`INSTALLED_APPS` must include `"tasks"` or Django will not see the models, the admin registration, or the app's template tags. The lab already lists it.

:::why
Django loads apps in `INSTALLED_APPS` order. `AppConfig.ready()` runs once models are loaded. Put signal registration there, not at import time in `models.py`, or you will register the same receiver twice under the reloader and the signal will fire twice.
:::

## Import paths

`config.urls` means the `urls` module inside the `config` package. `tasks.models.Task` is the model class. These are ordinary Python imports. The collision rules from the modules lesson apply: do not name an app `email`, `json`, `test`, or `django`.

:::quiz
Which file chooses the view for a path?
+ urls.py, included from the project into the app
- models.py
- wsgi.py
because: The URL resolver walks patterns in the URL conf. wsgi.py only exposes the application object to the server.
:::

---
id: django-and-setup
track: django
level: Beginner
module: Foundations
title: What Django is, and the first project
minutes: 18
keywords: Django, startproject, startapp, MVT, manage.py
summary: Django is a Python framework that maps URLs to views, renders templates, and stores data through models. Create a project and an app inside a virtual environment.
---

Django is batteries-included: routing, an ORM, migrations, forms, templates, auth, sessions, an admin, and a security checklist. You use the pieces you need. A project is the whole site. An app is a package inside the project that owns one area of the domain (tasks, billing, accounts).

The pattern people call MVT:

| Piece | Role |
| --- | --- |
| Model | The data and the rules close to the data |
| View | Python that receives a request and returns a response |
| Template | The HTML shape, filled with values the view passes |

A URL conf sits in front and chooses the view. It is not a fourth letter in the acronym, but nothing runs without it.

## Create the lab

From a terminal:

```powershell
cd C:\Users\Rajkumar\Downloads\PythonDjango-LERN\labs\taskboard
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install "Django>=6.1,<6.2"
```

This repository already contains the task board. To start a different project yourself:

```powershell
django-admin startproject config .
python manage.py startapp tasks
python manage.py runserver
```

Open `http://127.0.0.1:8000/`. The rocket page means Django is serving. Stop it with Ctrl+C.

`startproject config .` names the project package `config` and puts it in the current folder. Naming it `config` or `project` avoids colliding with a Python package also called `django` or with your domain app. `manage.py` is the command-line entry. It sets `DJANGO_SETTINGS_MODULE` to `config.settings` and then runs the command you typed.

:::why
`django-admin` is the global command available after you install Django. `python manage.py` is the same machinery, pointed at this project's settings. Once the project exists, prefer `manage.py` so you cannot accidentally talk to a different settings module.
:::

## The development server is not the production server

`runserver` reloads when you save a file and prints tracebacks to the browser when `DEBUG` is True. It is single-purpose and not hardened for the public internet. Production uses gunicorn or uvicorn behind a reverse proxy. That is a later lesson. Do not point a domain at `runserver`.

:::watch
Installing Django outside a virtual environment, then wondering why `import django` fails inside one, is the usual first hour. Activate the environment in every new terminal. The prompt shows `(.venv)`.
:::

:::try
With the environment active, run `python -c "import django; print(django.get_version())"` inside `labs/taskboard` and confirm you see a 6.1.x version.
:::

:::solution
```powershell
.\.venv\Scripts\Activate.ps1
python -c "import django; print(django.get_version())"
```
:::

:::quiz
What is the difference between a project and an app?
+ A project is the whole site. An app is one installable area of that site
- They are two names for the same folder
- An app is the database and a project is the CSS
because: startproject builds the settings, URLs, and manage.py. startapp builds a package you add to INSTALLED_APPS.
:::

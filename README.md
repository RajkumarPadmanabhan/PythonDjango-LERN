# Pathline

A complete Python and Django course you read in the browser. It starts from "what is a program" and goes through advanced Python, Django 6.1, security, tests, and deployment.

The lessons are the course. The lab in `labs/taskboard` is a real project you can run. `labs/contact_book.py` is the Python project.

## Open the course

```powershell
python tools/build_course.py
.\start-course.ps1
```

Then open http://127.0.0.1:8765

If you change a lesson in `content/`, run `python tools/build_course.py` again and reload the page.

## What is covered

- Python 3.12+ syntax, aimed at 3.15: every keyword, data types, control flow, functions, modules, files, exceptions, OOP, protocols, typing, tests, concurrency, asyncio, packaging, and the 3.14 / 3.15 additions.
- Django 6.1: projects, settings, URLs, views, templates, static files, models, fields, migrations, the ORM, admin, forms, class-based views, auth, permissions, sessions, uploads, middleware, signals, tests, security, REST framework, tasks, cache, channels, and deployment.
- A Projects track from a guessing game through files, tests, Django sites, a team workspace, a JSON API, and a deploy checklist. Python programs are in `labs/projects`.
- Reference pages for keywords, builtins, dunder methods, the exception tree, the standard library, ORM lookups, and template tags.
- Exercises with solutions, and short quizzes inside the lessons.

Python's standard library and Django's contrib apps are larger than one sitting. The reference map names them. The lessons teach the parts you need to build software, including the rules underneath the syntax.

## Run the task board

```powershell
cd labs\taskboard
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python manage.py test
```

Official references: [Python docs](https://docs.python.org/3/) and [Django docs](https://docs.djangoproject.com/en/stable/).

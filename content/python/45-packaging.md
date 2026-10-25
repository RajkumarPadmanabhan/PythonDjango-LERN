---
id: packaging
track: python
level: Advanced
module: Advanced Python
title: Packaging and environments
minutes: 14
keywords: pip, venv, pyproject, requirements, wheel
summary: Pin dependencies, isolate them in a virtual environment, and declare a project in pyproject.toml when you want to ship it.
---

For an application, the practical set is:

```text
pyproject.toml      # project metadata and dependencies
requirements.txt    # optional exact pins for deploys
.venv/              # not committed
```

A minimal `pyproject.toml`:

```toml
[project]
name = "taskboard"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
  "Django>=6.1,<6.2",
]
```

Install the project in editable mode while you work: `python -m pip install -e .` from a virtual environment. For a deploy, generate an exact lock with your chosen tool (`pip freeze`, `pip-tools`, or `uv lock`) and install that. `Django>=6.1,<6.2` accepts security patches and refuses the next feature release until you have read its notes.

## What not to do

- Do not install Django into the system Python and hope every project agrees.
- Do not commit `SECRET_KEY`, database passwords, or API tokens. Read them from the environment.
- Do not `pip install` a package you have not heard of because a tutorial from an old year said to. Check the project, the maintainer, and whether the standard library already does the job.

`__init__.py` marks a regular package. A `src/` layout (`src/taskboard/...`) avoids accidentally importing the folder you are sitting in instead of the installed package. Small apps can live at the repository root the way the lab does. Libraries should use `src/`.

Entry points in `pyproject.toml` create commands:

```toml
[project.scripts]
hello = "taskboard.cli:main"
```

After install, `hello` runs that function. Django's `manage.py` is a small script that sets `DJANGO_SETTINGS_MODULE` and calls `execute_from_command_line`. You now know every part of that sentence.

:::tip
`python -m pip index versions Django` shows versions your index knows about. Upgrade patch releases. Read the release notes before you cross from 6.1 to 6.2 or from 5.2 LTS to 6.x.
:::

:::quiz
Why pin Django to >=6.1,<6.2 instead of Django?
+ You get patch fixes and avoid an unreviewed feature release
- The unpinned name installs no package
- Django refuses ranged versions
because: A feature release can remove deprecated APIs. A patch release in the same series is the one you want automatically.
:::

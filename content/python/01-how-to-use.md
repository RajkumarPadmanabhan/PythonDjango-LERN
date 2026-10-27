---
id: how-to-use
track: python
level: Beginner
module: Start here
title: How to use this course
minutes: 10
keywords: practice, lesson, lab, keyword, solution
summary: Read in order, type the code yourself, and use the labs as proof that you can build something.
---

You do not need to know what a program is. You do need a computer, a browser, and the willingness to type code instead of only reading it.

## What you are learning

Python is the programming language. Django is a toolkit, written in Python, for building websites and web APIs. You learn Python first because Django is Python. If the Python parts feel slow, they are doing the real work: every Django model, view, and setting is a Python object.

The course is aimed at **Python 3.15** and **Django 6.1**, the current releases as of October 2026. Django 6.1 runs on Python 3.12 through 3.15. Install a current 3.12+ if 3.15 is awkward on your machine, and read the lesson on 3.14 and 3.15 features before you use the newest syntax.

## How a lesson is built

Each lesson has four kinds of blocks:

- **Why this works** explains the rule underneath the syntax. This is where most tutorials skip, and where bugs come from.
- **Watch this** is a mistake that looks reasonable and is wrong.
- **Try this** is work for you. Attempt it before you open the solution.
- A **quiz** checks one idea. The point is the reason, not the score.

A code block labeled **Python** has a **Run** button. It executes in your browser with [Pyodide](https://pyodide.org/). The first run downloads the runner. The browser runner is a recent Python, but it is not always 3.15, so `lazy import`, `frozendict`, and `sentinel` should be run on your own install. Django code never runs in the browser. You type that into the lab project.

## A way to study that works

1. Read one lesson.
2. Type every example. Change one value and predict the new result before you run it.
3. Do the exercise from a blank file.
4. Mark the lesson complete. The mark is stored in this browser only.
5. When a word is unfamiliar, search it in the sidebar. The reference lessons list every keyword, the operators, the exceptions, and the Django field and lookup catalogs.

Press `/` to jump to search.

## What "complete" means here

You will meet every Python keyword and soft keyword, the data model (names, objects, mutability, identity), the standard tools people use daily, and the parts of Django that a production project actually uses: URLs, views, templates, models, migrations, the ORM, forms, admin, auth, security, tests, REST, background tasks, and deployment.

Python's standard library has more modules than a course can narrate one by one. The standard-library map names them and says what each is for. The deep lessons teach the ones you will use while building software. Django's official reference remains the spec for every setting and every obscure contrib app; this course teaches the ones you must understand and gives you a catalog so you know the rest exist.

## Projects, then two labs you can run today

The Practice track is where logic is trained on purpose. Logic lessons show how to turn a sentence into steps. Tasks are short problems with solutions under a disclosure. Cheat codes are the lookup pages for shapes, Python lines, Django lines, and what to do when you are stuck.

The Projects track in the sidebar is the build ladder: beginner programs, intermediate file and test projects, beginner Django sites, and a professional team app with an API. Do those after the matching lessons, or when you want a break from reading.

Two finished labs are also in the repository:

- `labs/contact_book.py` is a command-line address book. It uses functions, dictionaries, files, and exceptions.
- `labs/taskboard/` is a Django project: accounts, a task model, forms, templates, the admin, and tests.

:::tip
When an error appears, read the last line first (the exception type and message), then the last file that is yours, not a library. The lesson on exceptions and the lesson on debugging show you how.
:::

:::quiz
What should you do with a Try this block?
- Open the solution, then retype it
+ Attempt it yourself before opening the solution
- Skip it and stay on the reading
because: Typing from memory is what moves a concept into your hands. The solution is there to compare after you have tried.
:::

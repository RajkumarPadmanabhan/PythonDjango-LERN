---
id: template-tags
track: django
level: Advanced
module: Views, auth, and requests
title: Custom template tags and filters
minutes: 12
keywords: template tag, filter, simple_tag, inclusion_tag, load
summary: A custom tag or filter is a Python function registered for templates. Keep it small. Do not hide queries in it by accident.
---

Create `tasks/templatetags/task_tags.py` and an empty `tasks/templatetags/__init__.py`. The folder name `templatetags` is required. Restart the server after adding it, because template tag modules are loaded at startup.

```python
from django import template

register = template.Library()

@register.filter
def completed_mark(task):
    return "done" if task.done else "open"

@register.simple_tag
def task_count(user):
    return user.tasks.count()
```

```django
{% load task_tags %}
{{ task|completed_mark }}
{% task_count request.user %}
```

`simple_tag` can take arguments and the context, with `takes_context=True`. `inclusion_tag` renders another template and returns the HTML. That is how you build a component before reaching for partials. Django 6 partials cover the "same snippet, same template" case without Python. A tag is justified when the snippet needs Python that is not already in the context.

Filters should be pure. A filter that queries makes the template's cost invisible. Pass the count from the view, or accept the cost consciously and prefetch.

`{% load %}` is per template. A base template's load does not apply to a child. Load in the template that uses the tag.

:::watch
A tag that marks a string safe with `mark_safe` must escape any user-controlled piece first, using `django.utils.html.format_html`. `format_html("<li>{}</li>", task.title)` escapes the title and marks the result safe. Concatenating strings and calling `mark_safe` does not escape.
:::

:::quiz
What is the required package name for custom tags?
+ templatetags, inside the app
- tags, next to views.py
- template_tags, in the project package only
because: Django looks for a templatetags package in each installed app when you load a library.
:::

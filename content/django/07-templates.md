---
id: templates
track: django
level: Beginner
module: Foundations
title: Templates
minutes: 20
keywords: template, extends, block, for, if, url, csrf_token, autoescape
summary: The Django template language fills HTML with values. It escapes them. It is not Python, on purpose.
---

```django
{% extends "tasks/base.html" %}
{% block content %}
  <h1>{{ heading }}</h1>
  <ul>
    {% for task in tasks %}
      <li>{{ task.title }}</li>
    {% empty %}
      <li>No tasks yet.</li>
    {% endfor %}
  </ul>
{% endblock %}
```

`{{ value }}` prints a value, escaped. `{% tag %}` runs a tag. `{# comment #}` is a comment. The view passes the context: `render(request, "tasks/task_list.html", {"tasks": tasks, "heading": "Tasks"})`.

Templates are found in each app's `templates/` directory when `APP_DIRS` is True, and in `DIRS`. The lab uses `tasks/templates/tasks/task_list.html`. The extra `tasks/` folder avoids collisions: two apps can both define `list.html` and you will load the one you named.

## Inheritance

`base.html` holds the document skeleton. Child templates replace blocks.

```django
<!DOCTYPE html>
<html lang="en">
<head><title>{% block title %}Tasks{% endblock %}</title></head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

`{{ block.super }}` inside a block inserts the parent's version. `include "tasks/_item.html"` pulls a partial in. Variables in the included template see the current context.

## Tags and filters you will use constantly

| Tag or filter | Role |
| --- | --- |
| `if` / `elif` / `else` | Conditions. There is no Python here |
| `for` | Loop. `forloop.counter`, `forloop.first`, `forloop.last`, and (Django 6) `forloop.length` |
| `url` | Reverse a named URL |
| `csrf_token` | Hidden input required on POST forms |
| `static` | URL of a static file. `{% load static %}` first |
| `now` | Current time |
| `default` | `{{ name\|default:"guest" }}` if the value is falsey |
| `default_if_none` | Only when the value is `None` |
| `length`, `date`, `linebreaks`, `truncatewords`, `yesno`, `pluralize` | Formatting |
| `dictsort` | Sort a list of dicts or objects |

The reference cheatsheet lists the full built-in tag and filter set, including `partial` and `csp_nonce_attr`.

## Logic stays in Python

Templates cannot assign arbitrary variables in a useful way (the `with` tag is the limited exception) and cannot call functions with arguments except in the filter form. That limitation is the design. If you are computing a price, a permission, or a query in the template, move it to the view or to a model method. A template that queries (`task.owner.profile.city` across a loop) causes the N+1 problem. Prepare the data in the view with `select_related`.

## Autoescape

`{{ task.title }}` turns `<` into `&lt;`. A user who names a task `<script>` sees the characters, not a running script. `{{ html|safe }}` and `{% autoescape off %}` disable that. Use them only for HTML you built yourself, never for request data. `mark_safe` in Python is the same promise: "I have already escaped this."

Django 6 template partials:

```django
{% partialdef button inline %}
  <button type="submit">{{ label }}</button>
{% endpartialdef %}
{% partial button %}
```

You can also render `template_name#partial_name` from `include` and from Python. Partials replace a lot of tiny files.

:::watch
`{{ task.title|safe }}` on a title the user typed is XSS. The `|safe` filter is not a compliment. It is a switch that turns escaping off.
:::

:::quiz
Where should a database query live?
+ In the view or a model method, not in the template
- In the template, because it is next to the HTML
- In the URLconf
because: Templates receive a context. Querying from a template hides the cost and is awkward to test.
:::

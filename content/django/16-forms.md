---
id: forms
track: django
level: Beginner
module: Forms and the admin
title: Forms
minutes: 18
keywords: Form, Field, is_valid, cleaned_data, CSRF, widget
summary: A form validates input and produces cleaned Python values. The template renders it and must include the CSRF token.
---

```python
from django import forms

class TaskForm(forms.Form):
    title = forms.CharField(max_length=200)
    detail = forms.CharField(required=False, widget=forms.Textarea)

    def clean_title(self):
        title = self.cleaned_data["title"].strip()
        if not title:
            raise forms.ValidationError("Give the task a title.")
        return title
```

```python
def task_create(request):
    if request.method == "POST":
        form = TaskForm(request.POST)
        if form.is_valid():
            Task.objects.create(owner=request.user, **form.cleaned_data)
            return redirect("task-list")
    else:
        form = TaskForm()
    return render(request, "tasks/task_form.html", {"form": form})
```

Unbound form: no data, for GET. Bound form: `request.POST`, for POST. `is_valid` runs field validators and `clean_<field>` and `clean`. Only then is `cleaned_data` complete. Read values from `cleaned_data`, not from `request.POST`. The raw data is still strings and may be invalid.

```django
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Save</button>
</form>
{{ form.errors }}
```

`as_p` is fine for a first version. For layout control, loop `{% for field in form %}` and render `{{ field.label_tag }}`, `{{ field }}`, `{{ field.errors }}`. Do not forget `csrf_token` on any POST form that uses the session.

## Validation order

1. Field-level `to_python` and validators, including `max_length` and `required`.
2. `clean_<fieldname>`, which must return the cleaned value.
3. `clean()`, for errors that involve two fields. Use `self.add_error("title", "...")` or raise `ValidationError`.

`form.errors` is a dict. `form.non_field_errors()` holds errors that are not tied to one input.

:::why
CSRF tokens stop another site from submitting this form using the victim's cookies. The browser would attach the session cookie. The attacker cannot read or guess the token if the cookie is set correctly and the page is not vulnerable to XSS. Django checks the token in middleware on unsafe methods.
:::

:::watch
`required=False` still returns `""` for an empty `CharField`, not `None`. If the model column is NULL-able and you need `None`, convert the empty string in `clean_detail`.
:::

:::quiz
Why read form.cleaned_data instead of request.POST?
+ cleaned_data has passed validation and has Python types
- request.POST is empty after is_valid
- POST only contains the CSRF token
because: The raw POST is untrusted text. The form's job is to turn it into safe Python or reject it.
:::

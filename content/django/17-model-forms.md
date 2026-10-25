---
id: model-forms
track: django
level: Intermediate
module: Forms and the admin
title: ModelForms, formsets, and files
minutes: 16
keywords: ModelForm, formset, commit, save, ImageField
summary: A ModelForm builds a form from a model. You choose the fields. save() writes the row. commit=False lets you set the owner first.
---

```python
class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ["title", "detail"]

    def clean_title(self):
        title = self.cleaned_data["title"].strip()
        if len(title) < 2:
            raise forms.ValidationError("Too short.")
        return title
```

`fields = "__all__"` trusts every future field you add, including ones that should not be editable by this form. List the fields.

```python
form = TaskForm(request.POST)
if form.is_valid():
    task = form.save(commit=False)
    task.owner = request.user
    task.save()
```

`commit=False` returns the instance without writing it, so you can set `owner` from the session rather than from the POST body. If you let the client send `owner`, anyone can create tasks for someone else.

Updating uses `instance`:

```python
form = TaskForm(request.POST, instance=task)
```

## Formsets

A formset is a list of forms plus management fields (`TOTAL_FORMS`, and so on). `modelformset_factory` and `inlineformset_factory` build them. Always include `{{ formset.management_form }}` in the template. The management form is how Django knows how many forms were submitted. Django 6.1 fixed a privilege bug around model formsets whose primary key can be edited (natural keys, UUIDs, one-to-one parent links). Keep primary keys out of the editable fields unless you have a reason and have read that advisory. The default `BigAutoField` was not affected.

## Files

A form with a file needs `request.FILES` and `enctype="multipart/form-data"`.

```python
form = ProfileForm(request.POST, request.FILES, instance=profile)
```

The field stores a path. The bytes go to the storage backend. Validate content type and size. Do not use the original filename as a path without cleaning it.

:::watch
`ModelForm` will happily save a field you forgot to exclude. Review `Meta.fields` when you add a column such as `is_staff` to a model that has a public form. Better: the public model does not have `is_staff`. That flag belongs on the user model, edited only in the admin.
:::

:::quiz
What does save(commit=False) do?
+ Returns the model instance without writing it, so you can set fields the user must not post
- Validates without cleaning
- Deletes the row
because: The owner, the creator, and server-side timestamps are set in the view, then save() writes the complete instance.
:::

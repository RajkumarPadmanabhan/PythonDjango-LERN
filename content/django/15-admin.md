---
id: admin
track: django
level: Beginner
module: Forms and the admin
title: The admin
minutes: 14
keywords: admin, ModelAdmin, list_display, createsuperuser, register
summary: The admin is a staff interface generated from your models. It is not the product your users log into, unless you deliberately make it so.
---

```powershell
python manage.py createsuperuser
```

Then visit `/admin/`. A superuser can see every registered model.

```python
from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "done", "created_at")
    list_filter = ("done",)
    search_fields = ("title", "detail")
    autocomplete_fields = ("owner",)
    readonly_fields = ("created_at",)
```

`list_display` is the table. `search_fields` builds an `icontains` query. `list_filter` is the sidebar. `autocomplete_fields` needs `search_fields` on the related model's admin, and it avoids a million-row `<select>`.

`fieldsets` group the edit page. `inlines` edit related rows on the same page. `prepopulated_fields` fills a slug from a title in the browser.

## Permissions

The admin checks `is_staff` and model permissions (`tasks.view_task`, `tasks.change_task`). A superuser passes every check. Create a staff user with only the permissions they need when someone other than you uses the admin. The admin is a powerful tool. Protect it with a real password and, in production, HTTPS.

## What not to put in the admin

Custom workflows with several steps, public sign-up, and anything that must be beautiful for customers. Those are views. The admin is for operators. Django 6 refreshed the admin icons and lets you replace the password-change form via `AdminSite.password_change_form`. Message levels `DEBUG` and `INFO` now look different from `SUCCESS`.

:::tip
`admin.site.site_header = "Pathline"` in an `AppConfig.ready` or `admin.py` is enough branding for an internal tool. For a second admin site with a different set of models, instantiate another `AdminSite`.
:::

:::quiz
Who can open the admin?
+ Users with is_staff, and only for models they have permission to see. Superusers see all
- Anyone who knows the URL
- Only the user created by startproject
because: Authentication plus is_staff plus model permissions gate the admin. The URL is not a secret.
:::

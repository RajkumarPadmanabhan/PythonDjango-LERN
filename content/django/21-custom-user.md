---
id: custom-user
track: django
level: Advanced
module: Views, auth, and requests
title: A custom user model
minutes: 14
keywords: AUTH_USER_MODEL, AbstractUser, AbstractBaseUser, swappable
summary: If you might ever change the user model, do it before the first migration. Point every foreign key at AUTH_USER_MODEL.
---

The default user has a username, email, and password. Many products want email as the identifier. The supported way is a custom user model, created at the beginning of the project.

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
```

```python
AUTH_USER_MODEL = "accounts.User"
```

`AbstractUser` keeps the username machinery and the permissions. `AbstractBaseUser` is the bare hasher and password API, for when you do not want usernames at all. Choosing `AbstractBaseUser` means you also supply a manager with `create_user` and a `UserCreationForm` the admin understands. Do that when you have the requirement, not as a warm-up.

Foreign keys:

```python
owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
```

This stays correct if the user model moves. `from django.contrib.auth.models import User` does not.

## The timing constraint

Changing `AUTH_USER_MODEL` after you have applied migrations that point at the old user is a project you do not want. Start with a custom user even if it only subclasses `AbstractUser` and adds nothing. The lab uses the default user so the first migrate is the stock one. Your next project should set `AUTH_USER_MODEL` before `migrate`.

`get_user_model()` returns the active class. Use it in forms and views. At module import time, apps may not be ready. Inside a function, `get_user_model()` is safe. In a foreign key field declared on a model, use the `settings.AUTH_USER_MODEL` string, which Django resolves later.

:::tip
Add profile fields that are not identity (biography, timezone) on a `Profile` with a `OneToOneField` to the user, unless you are sure they belong on the user row. Both are valid. Identity and permissions belong on the user model.
:::

:::quiz
When do you introduce a custom user model?
+ Before the first migration that involves users
- Any time, with no migration cost
- Only after the site is in production
because: Swapping the user model later rewrites foreign keys across the project. Doing it first is cheap.
:::

---
id: authentication
track: django
level: Intermediate
module: Views, auth, and requests
title: Authentication
minutes: 18
keywords: login, logout, User, authenticate, login_required, password
summary: Django's auth app stores users, hashes passwords, and attaches the user to the request. You use it. You do not store plaintext passwords.
---

`django.contrib.auth` is in `INSTALLED_APPS` from the start. `AuthenticationMiddleware` loads the session and sets `request.user`. If nobody is logged in, `request.user` is an `AnonymousUser` and `request.user.is_authenticated` is `False`.

```python
from django.contrib.auth.decorators import login_required

@login_required
def task_list(request):
    ...
```

`login_required` redirects to `LOGIN_URL` (the lab sets it to the `login` name) and adds `?next=` so you can send the user back. Class-based views use `LoginRequiredMixin`. Django also ships `LoginRequiredMiddleware` if you want authentication by default and `login_not_required` on the exceptions. Prefer that on a new internal tool. Prefer explicit decorators when many pages are public.

## Login and logout views

```python
from django.contrib.auth import views as auth_views

path("accounts/login/", auth_views.LoginView.as_view(template_name="registration/login.html"), name="login"),
path("accounts/logout/", auth_views.LogoutView.as_view(), name="logout"),
```

Logout is POST-only. A GET logout lets another site log the user out with an image tag. The template posts:

```django
<form method="post" action="{% url 'logout' %}">
  {% csrf_token %}
  <button type="submit">Log out</button>
</form>
```

`LOGIN_REDIRECT_URL` and `LOGOUT_REDIRECT_URL` are the defaults when `next` is absent or unsafe. Django rejects a `next` that points at another host.

## Passwords

`User.objects.create_user("ada", password="a-long-passphrase")` hashes the password. `create` does not. `set_password` hashes. `check_password` compares. The default hasher is PBKDF2. Django 6 raised the iteration count. You do not need to configure that to be safe. You need to avoid replacing it with a fast hash.

Password reset uses a signed token and the email backend. In development, set `EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"` and read the link in the terminal. The views live in `django.contrib.auth.urls`. Include them when you want the full set: login, logout, password change, password reset.

`authenticate(request, username=..., password=...)` returns a user or `None`. `login(request, user)` writes the session. `logout(request)` clears it. The built-in `LoginView` does this for you.

:::watch
A custom login view that compares `user.password == request.POST["password"]` compares a hash to a plaintext password and will never match, or worse, you stored the plaintext. Call `authenticate`.
:::

:::quiz
Why is logout a POST?
+ A GET logout can be triggered by another site without the user's intent
- POST is faster
- The session cookie only exists on POST
because: Unsafe actions use unsafe HTTP methods plus a CSRF token. Logging out is a state change.
:::

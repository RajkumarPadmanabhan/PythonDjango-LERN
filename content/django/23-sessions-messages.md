---
id: sessions-messages
track: django
level: Intermediate
module: Views, auth, and requests
title: Sessions, messages, and cookies
minutes: 14
keywords: session, messages, cookie, signed, flash
summary: The session stores small server-side state keyed by a cookie. The messages framework carries a one-time notice across a redirect.
---

```python
request.session["draft_title"] = "Untitled"
title = request.session.get("draft_title")
del request.session["draft_title"]
```

The default session backend stores data in the database and sends only a session id cookie. That cookie is signed and, by default, HTTP-only so page scripts cannot read it. Put small JSON-serializable values in the session. Do not put a model instance. Store the primary key and load the row.

`SESSION_COOKIE_SECURE = True` in production so the cookie is only sent over HTTPS. `CSRF_COOKIE_SECURE` too. `SESSION_COOKIE_AGE` is the lifetime.

Signing a cookie yourself uses `django.core.signing`. The signature uses `SECRET_KEY`. A signed cookie is tamper-evident, not secret. Do not put a password in one. Anyone can read the payload.

## Messages

```python
from django.contrib import messages
messages.success(request, "Task saved.")
return redirect("task-list")
```

```django
{% if messages %}
  <ul>
    {% for message in messages %}
      <li>{{ message }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

The storage is the session or a cookie, depending on settings. Each message is consumed when displayed. That is the flash-message pattern, and it is why Post/Redirect/Get can still tell the user what happened. Levels: `DEBUG`, `INFO`, `SUCCESS`, `WARNING`, `ERROR`. Django 6 gives `DEBUG` and `INFO` their own admin styling. `message_user` in the admin defaults to `INFO`.

`messages` requires `MessageMiddleware` and the `messages` context processor, both in the default settings.

:::watch
Session data is per browser, not a database of record. Two devices have two sessions. If a value must survive logout or be shared, it belongs in a model.
:::

:::quiz
What is stored in the browser for the default session backend?
+ A session id cookie, not the whole session dict
- Every key you put in request.session, as plain text
- The user's password hash
because: The database row holds the data. The cookie identifies the row. Treat the cookie as a credential.
:::

---
id: signals
track: django
level: Advanced
module: Views, auth, and requests
title: Signals
minutes: 12
keywords: signal, post_save, pre_delete, receiver, ready
summary: A signal is a function Django calls when something happens. Use one when you do not own the code that should trigger the work. Prefer an explicit call when you do.
---

```python
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=get_user_model())
def ensure_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
```

Register this in `AppConfig.ready`, by importing the module from `ready`. Importing it at the bottom of `models.py` often works and also often double-registers under the autoreloader if you are not careful. `ready` plus a guard is the documented place.

Built-in signals include `pre_save`, `post_save`, `pre_delete`, `post_delete`, `m2m_changed`, and `request_started` / `request_finished`. `QuerySet.update` and `QuerySet.delete` do **not** send the per-object save and delete signals. `DB_CASCADE` does not send delete signals either. If your only copy of "create a profile" lives in a signal, a bulk path will skip it.

## When a signal is the wrong tool

Creating a profile from `User.objects.create_user` in your own signup view is easier to read than a signal. Signals shine when the user can be created from the admin, a management command, and a view, and all three must share the side effect. They are painful when the signal imports the sender's module and you build an import cycle, and when a test cannot tell why a row appeared.

`get_or_create` inside the receiver is deliberate. `post_save` can run twice in a process if you registered twice. The handler should tolerate that.

:::tip
Name the handler after the policy (`ensure_profile`), not after the signal (`on_save`). The next reader needs the policy.
:::

:::quiz
Which write path skips post_save?
+ QuerySet.update
- Model.save
- The admin change form, which calls save
because: update() is a SQL UPDATE. It does not construct instances or send per-object save signals.
:::

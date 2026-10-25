---
id: class-based-views
track: django
level: Intermediate
module: Views, auth, and requests
title: Class-based views
minutes: 16
keywords: View, get, post, dispatch, as_view, mixin
summary: A class-based view dispatches HTTP methods to methods. as_view() returns the function the URL conf expects.
---

```python
from django.http import HttpResponse
from django.views import View

class Ping(View):
    def get(self, request):
        return HttpResponse("pong")
```

```python
path("ping/", Ping.as_view(), name="ping"),
```

`as_view()` builds a function that constructs the class and calls `dispatch`. `dispatch` looks at `request.method` and calls `get`, `post`, `put`, `patch`, `delete`, or `head`. If the method is missing, the response is 405.

Instance attributes set in `as_view` or in `setup` are per request, because a new instance is created per request. Class attributes are shared. Do not store request data on the class.

## When a class helps

Use a function when the view is a straight sequence. Use a class when you want to override a hook (`get_queryset`, `form_valid`) or share behavior through a mixin. A class that is one `get` method and no reuse is a function wearing a costume.

Mixins are small classes you combine. Django's `LoginRequiredMixin` must be listed **before** the view class so its `dispatch` runs first:

```python
class TaskList(LoginRequiredMixin, ListView):
    model = Task
```

The MRO is why the order matters. `LoginRequiredMixin` comes first, then the generic view.

## Reading the source

`View.setup` stores `request`, `args`, and `kwargs`. Override `setup` if you need those before `dispatch`, and call `super().setup(...)`. Override `dispatch` only when you are writing middleware-like policy. Prefer the mixin that already exists.

:::tip
You can use a function and a class in the same project. The lab uses functions so you can read the whole request in one screen. The generic-view lesson shows the class version of the same ideas.
:::

:::quiz
What does as_view() return?
+ A function the URL resolver can call for each request
- An HttpResponse
- A model instance
because: URL patterns store callables. as_view builds that callable and closes over the class and its init kwargs.
:::

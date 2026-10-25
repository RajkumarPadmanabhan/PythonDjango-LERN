---
id: generic-views
track: django
level: Intermediate
module: Views, auth, and requests
title: Generic class-based views
minutes: 16
keywords: ListView, DetailView, CreateView, UpdateView, DeleteView, FormView
summary: Generic views implement the common shapes. You configure them with attributes and override a method when the default is wrong.
---

```python
class TaskList(LoginRequiredMixin, ListView):
    model = Task
    template_name = "tasks/task_list.html"
    context_object_name = "tasks"
    paginate_by = 20

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)
```

`ListView` evaluates the queryset, paginates if you set `paginate_by`, and renders. The template receives `page_obj`, `paginator`, and `is_paginated` when pagination is on. The object list is also named `object_list` unless you set `context_object_name`.

`DetailView` uses `pk` or `slug` from the URL. Override `get_queryset` so a user cannot load another user's task by guessing the id. Filtering in `get_queryset` turns a miss into a 404.

```python
class TaskCreate(LoginRequiredMixin, CreateView):
    model = Task
    fields = ["title", "detail"]
    success_url = reverse_lazy("task-list")

    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)
```

`form_valid` is the hook that runs after validation and before save, for `CreateView` and `UpdateView`. Setting `owner` here is the class-based version of `commit=False`. `reverse_lazy` waits until URLs are loaded. `reverse` at class-body import time can run too early.

`DeleteView` confirms with a GET page and deletes on POST. Keep it that way. `FormView` is for forms that are not a single model save. `TemplateView` renders a template and can add context in `get_context_data`. Call `super()` and then add keys.

## Pagination

```python
from django.core.paginator import Paginator
paginator = Paginator(queryset, 20)
page = paginator.get_page(request.GET.get("page"))
```

`get_page` clamps bad numbers instead of raising. `paginator.get_page` is what you use in a function view. Django 6 adds `AsyncPaginator` for async views. The template links look like `?page={{ page_obj.next_page_number }}`. The `querystring` tag keeps the other GET parameters when you build that link, and since Django 6 it prefixes `?` consistently and accepts several mappings.

:::watch
A `DetailView` with `model = Task` and no `get_queryset` filter publishes every row to anyone who can hit the URL. Authorization is part of the queryset, not only a login check.
:::

:::quiz
Where do you set the owner on CreateView?
+ form_valid, on form.instance, before super().form_valid saves
- In the template
- As a hidden input the browser fills in
because: The owner comes from the logged-in user. A hidden input is attacker-controlled.
:::

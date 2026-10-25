---
id: views-and-responses
track: django
level: Beginner
module: Foundations
title: Views, requests, and responses
minutes: 18
keywords: HttpRequest, HttpResponse, render, redirect, JsonResponse, QueryDict
summary: A view is a callable that takes a request and returns a response. Read inputs from the request. Write outputs only as a response.
---

```python
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

def ping(request):
    return HttpResponse("pong")

def task_list(request):
    return render(request, "tasks/task_list.html", {"tasks": []})
```

`request` is an `HttpRequest`. The attributes you will use every day:

| Attribute | Contents |
| --- | --- |
| `method` | `"GET"`, `"POST"`, and so on |
| `GET` | Query string as a `QueryDict` |
| `POST` | Form body as a `QueryDict` |
| `path` | The path |
| `user` | The logged-in user, or `AnonymousUser`. Set by `AuthenticationMiddleware` |
| `session` | The session dict |
| `FILES` | Uploaded files |
| `COOKIES` | Incoming cookies |
| `headers` | Header lookup |
| `META` | The raw WSGI/ASGI environment |

`QueryDict.get("q")` returns one value. `getlist` returns repeated keys. Missing keys return `None` from `get`, and raise from `request.GET["q"]`.

## Responses

`HttpResponse(content, status=200, content_type="text/html")` is the base. `render` fills a template and returns an `HttpResponse`. `redirect("task-list")` returns a 302 with a `Location` header. `JsonResponse({"ok": True})` sets the JSON content type and serializes the dict. `get_object_or_404(Task, pk=pk)` returns the row or raises `Http404`, which Django turns into a 404 response.

```python
def toggle_task(request, pk):
    if request.method != "POST":
        return HttpResponse(status=405)
    task = get_object_or_404(Task, pk=pk, owner=request.user)
    task.done = not task.done
    task.save(update_fields=["done"])
    return redirect("task-list")
```

Always redirect after a successful POST (the Post/Redirect/Get pattern). If you render a page in response to POST, a refresh submits the form again.

## Status and errors

Raise `Http404` or `PermissionDenied` when those are the meanings. Django's handler converts them. An unexpected `ValueError` becomes a 500. With `DEBUG=False`, the visitor sees a generic page and the traceback goes to logging. Configure `LOGGING` so you actually receive it.

`request.build_absolute_uri("/tasks/")` includes the scheme and host. Trust that host only because `ALLOWED_HOSTS` already filtered it.

:::watch
Do not build HTML with f-strings of user input. Templates escape. An f-string does not. `HttpResponse(f"<h1>{request.GET['q']}</h1>")` is an XSS bug.
:::

:::quiz
Why redirect after a successful POST?
+ A refresh then repeats a GET, not the POST that changed data
- Redirects are required by the URL conf
- POST cannot return 200
because: Post/Redirect/Get keeps the change on the POST and the page view on a GET that is safe to refresh.
:::

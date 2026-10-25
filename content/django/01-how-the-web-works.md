---
id: how-the-web-works
track: django
level: Beginner
module: Foundations
title: How the web works
minutes: 14
keywords: HTTP, URL, request, response, HTML, cookie
summary: A browser sends an HTTP request. A server sends a response. Django's job is to turn that request into a response using your Python.
---

A URL such as `https://example.com/tasks/?done=1` has a scheme (`https`), a host (`example.com`), a path (`/tasks/`), and a query string (`done=1`). The browser opens a connection and sends a request:

```text
GET /tasks/?done=1 HTTP/1.1
Host: example.com
Cookie: sessionid=...
```

The server replies with a status code, headers, and a body.

| Code | Meaning you should remember |
| --- | --- |
| 200 | OK, here is the body |
| 201 | Created |
| 204 | OK, no body |
| 301 / 302 | Look elsewhere. Browsers will follow |
| 400 | The client sent something we refuse |
| 403 | Authenticated, but not allowed |
| 404 | No such resource |
| 405 | This verb is not allowed on this URL |
| 500 | The server raised an error |

`GET` reads. `POST` submits a change. `PUT` and `PATCH` update. `DELETE` deletes. Browsers navigate with GET and submit forms with POST (or GET). An API can use all of them. GET must be safe: a crawler, a prefetch, or a curious user refreshing the page should not delete a row. Django's CSRF protection exists because browsers will attach cookies to requests another site triggered.

HTML is the body of a normal page. CSS presents it. JavaScript runs in the browser. Django renders HTML on the server in this course. That is a complete way to build an application. A separate frontend calling a JSON API is a later choice, not a requirement.

A cookie is a small value the browser stores and sends back. Django's session cookie identifies the server-side session. It is not the place to store the whole user record.

:::why
The path is yours to design. The host identifies the machine. Query parameters filter a GET. The body of a POST carries a form or JSON. Mixing those up is how people put passwords in a query string, where they end up in logs.
:::

:::quiz
Why should deleting a task not be a GET request?
+ GET is supposed to be safe. Browsers and tools may retry or prefetch it
- GET cannot carry a URL
- Django rejects GET
because: Safe methods must not change data. Use POST, or DELETE on an API, for a change.
:::

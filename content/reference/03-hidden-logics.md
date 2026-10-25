---
id: hidden-logics
track: reference
level: Reference
module: Language reference
title: Hidden logic under the syntax
minutes: 22
keywords: binding, iterator protocol, descriptor, MRO, GIL, lazy queryset, middleware
summary: The mechanisms that make the syntax do what it does. These are the bugs that look impossible until you see the rule.
---

## Names are bindings

`a = b` binds the name `a` to the object `b` already refers to. No copy. `a.append` is visible through `b` when the object is mutable. `a = something_else` is not. Function arguments follow the same rule.

## The for loop is a protocol

`for x in obj` calls `iter(obj)`, then `next` until `StopIteration`. Lists, files, generators, and Django querysets all participate. The loop variable is an ordinary name. Assigning to it does not talk to the iterator.

## Closures read names later

A lambda created in a loop looks up the loop variable when it runs, not when it was created. Default arguments are evaluated at creation and are the usual fix: `lambda n=n: n`.

## Defaults are created once

`def f(items=[])` shares one list. Use `None` and create the list inside the call.

## Methods are descriptors

A function on a class implements `__get__`. Looking it up on an instance returns a bound method with `self` filled in. `property` and Django fields are descriptors too. Attribute access can run code.

## The MRO decides super()

`super()` is the next class in the instance's method resolution order, not "the first base I typed" in every case. Cooperative classes call `super()` and accept `**kwargs`. `Class.mro()` prints the order.

## Imports execute and cache

The first import runs the module and stores it in `sys.modules`. A second import returns the same module object. Circular imports see a partially initialized module. The script directory is first on `sys.path`, so a local `json.py` hides the standard library.

## The GIL

On the default build, one thread runs Python bytecode at a time. Threads overlap while waiting on IO. CPU-bound Python does not scale by adding threads. Free-threaded builds exist as an opt-in. Write locks as if the GIL were not your mutex, because a read-modify-write is not atomic either way.

## Django's request walk

The server calls the WSGI or ASGI application. Middleware runs top to bottom. The URL resolver picks a view. The view returns a response. Middleware runs bottom to top. `request.user` exists only after `AuthenticationMiddleware`. CSRF is checked before the view for unsafe methods.

## Querysets are descriptions

`filter` builds SQL. Evaluation runs it. `update` and `delete` on a queryset skip instance `save` and `delete` and skip their signals. `select_related` joins. `prefetch_related` batches. Touching `task.owner` in a loop without one of those is a query per row.

## Migrations are the schema's memory

`makemigrations` diffs models against migration files, not against whatever the database happens to contain. The database is the result of applying that history.

## Templates escape

`{{ name }}` escapes HTML. The database does not store escaped HTML. You escape at render time so an API can return the same string safely as JSON. `|safe` turns the escape off.

## Sessions are server-side

The cookie is an id. The data lives in the store you configured. Signing a cookie does not encrypt it.

:::quiz
What does a = b copy?
+ Nothing. Both names refer to the same object
- The object's fields into a new object
- Only immutable objects, automatically
because: Assignment binds a name. copy and deepcopy are how you actually copy.
:::

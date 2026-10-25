---
id: glossary
track: reference
level: Reference
module: Study tools
title: Glossary
minutes: 14
keywords: glossary, term, definition
summary: Short definitions of the words the lessons use, in one place.
---

**Argument.** A value passed in a call. **Parameter.** The name in the function definition.

**Awaitable.** An object `await` accepts: a coroutine, a task, or an object with `__await__`.

**Binding.** Attaching a name to an object. Assignment binds. It does not copy.

**Bound method.** A method with `self` already filled in.

**Bytecode.** The compiled form CPython executes. Stored in `__pycache__`.

**Context manager.** An object `with` can enter and exit.

**Coroutine.** The object returned by calling an `async def` function.

**CSRF.** A forged request that uses the victim's cookies. Django's token stops the common form of it.

**Descriptor.** An object on a class that customizes attribute access.

**DRY.** Don't repeat yourself. Share a queryset method or a template block instead of copying.

**Eager.** Does the work now. **Lazy.** Describes the work and does it when the result is needed.

**Epoch.** A reference instant. Timestamps are often seconds from one.

**Expression.** Code that produces a value. **Statement.** Code that does a job.

**Fixture.** The setup a test needs. Also, in Django, a serialized dataset `loaddata` reads.

**GIL.** A lock in default CPython that lets one thread run bytecode at a time.

**Hashable.** Can be a dict key or a set item. Must not change its hash.

**Idempotent.** Doing it twice has the same result as doing it once. PUT is often designed this way. A POST that creates a row usually is not.

**Iterable.** Can produce an iterator. **Iterator.** Produces the next item or raises `StopIteration`.

**Middleware.** Code around every request, in a defined order.

**Migration.** A versioned change to the database schema.

**MRO.** The order Python searches classes for an attribute.

**Mutable.** Can change in place. **Immutable.** Operations return a new object.

**Namespace.** A mapping of names to objects. A module, a class, and a function call each have one.

**ORM.** A layer that maps model classes to SQL.

**Primary key.** The column that identifies a row. `pk` in Django.

**Queryset.** A lazy description of a database query.

**Race.** Two operations whose result depends on timing.

**Repr.** A developer-facing string for an object.

**Serializer.** DRF's object that validates input and renders output.

**Side effect.** A change beyond the returned value: writing a file, printing, updating a global.

**Soft keyword.** A word that is a keyword only in one kind of statement.

**Transaction.** A group of database writes that commit or roll back together.

**Truthy and falsey.** How an object behaves in `if`. Not the same as the booleans `True` and `False`.

**View.** A callable that takes a request and returns a response.

**WSGI and ASGI.** The interfaces between a Python web app and a server. ASGI also covers async and websockets.

**XSS.** Injecting markup that runs as script in someone else's browser. Template escaping is the main defense.

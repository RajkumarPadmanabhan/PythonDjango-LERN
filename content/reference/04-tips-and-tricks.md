---
id: tips-and-tricks
track: reference
level: Reference
module: Study tools
title: Tips, tricks, and patterns
minutes: 18
keywords: tip, pattern, idiom, guard, unpack, walrus
summary: Small patterns that show up constantly, and the wrong version of each.
---

## Python

- Swap with `a, b = b, a`. The right side is evaluated first.
- Unpack a function result: `low, high = bounds()`.
- Ignore a value with `_`: `name, _ = pair`. This is convention.
- Merge dicts with `{**base, **overrides}` or `base | overrides` on 3.9+.
- Default a missing dict value with `value = mapping.get("k", default)`. Remember `get` does not insert.
- Count with `collections.Counter`. Group with `defaultdict(list)`.
- Flatten one level with `[x for row in rows for x in row]`. On 3.15, `[*row for row in rows]`.
- Guard a chain: `user is not None and user.is_active`.
- Use `pathlib.Path` and `/` to join paths. Never add them with string `+`.
- Open text with `encoding="utf-8"`.
- Compare sentinels and `None` with `is`.
- Raise specific exceptions. Catch specific exceptions.
- Return data. Let the caller print.
- Put the entry point under `if __name__ == "__main__"`.
- A comprehension can replace `map` and `filter`. A `for` loop can replace a comprehension that has side effects.
- `enumerate(items, start=1)` instead of `range(len(items))`.
- `zip(..., strict=True)` when the lengths must match.
- `math.isclose` for floats. `Decimal` for money.
- `secrets.token_urlsafe()` for tokens. `random` for games and samples.

## Django

- Name every URL. Reverse the name.
- Redirect after POST.
- `{% csrf_token %}` in every POST form.
- Filter by owner in the queryset, not only in the template.
- `get_object_or_404` with the owner in the lookup.
- `commit=False` or `form_valid` to set server-side fields.
- `select_related` for foreign keys you will display.
- `update_fields` when you save one column you just changed.
- `transaction.atomic` around two writes that must agree, and `on_commit` for the email.
- `reverse` in tests, not hard-coded paths.
- `force_login` unless the test is about the login form.
- `blank` for forms, `null` for the database.
- Callables as defaults: `default=list`, `default=timezone.now`.
- `AUTH_USER_MODEL` in foreign keys.
- `check --deploy` before you ship.
- Upgrade Django patch releases when security notes land.

## Wrong and right

| Wrong | Right |
| --- | --- |
| `if x == True` | `if x` or `if x is True` when you truly mean the boolean |
| `if x == None` | `if x is None` |
| `except:` | `except ValueError:` |
| `list = []` | `items = []` |
| `tasks = tasks.append(x)` | `tasks.append(x)` |
| HTML f-string of user input | A template |
| SQL f-string of user input | The ORM, or parameters |
| `User` imported directly in a new project | `settings.AUTH_USER_MODEL` |
| GET that deletes | POST, plus CSRF |

:::tip
When you copy a pattern, copy the test that makes it safe. The owner filter without the cross-user test will disappear in a refactor.
:::

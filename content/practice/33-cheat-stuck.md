---
id: cheat-stuck
track: practice
level: Reference
module: Cheat codes
title: Cheat codes — when you are stuck
minutes: 14
keywords: debug, traceback, error, bug, stuck
summary: A short order of checks for when the code runs and the answer is wrong, or when it will not run at all.
---

Use this page in order. Stop at the first check that you cannot answer.

## It will not run

1. Read the **last** line of the traceback. That is the exception type and the message.
2. Find the last file that is yours. Lines inside site-packages are the library noticing your mistake.
3. Match the type:

| Exception | First place to look |
| --- | --- |
| `SyntaxError` | The line named, and the line just above it |
| `IndentationError` | Mixed spaces, or a missing block after `:` |
| `NameError` | Typo, or the name is inside a branch that did not run |
| `TypeError` | You called a number, or added a string to an int, or passed the wrong arguments |
| `ValueError` | The type is right and the contents are not, such as `int("no")` |
| `KeyError` | The dict key is missing. Use `.get` when missing is normal |
| `IndexError` | The list is empty, or the index is `len(items)` instead of `len(items) - 1` |
| `AttributeError` | That object does not have that method. Print `type(obj)` |
| `RecursionError` | A recursive call is not shrinking, or the base case is missing |
| Django `TemplateDoesNotExist` | The template path, and `APP_DIRS` |
| Django 403 on POST | `{% csrf_token %}` missing, or the view is not exempt on purpose |
| Django 404 | The URL pattern, the `pk`, or an owner filter that excluded the row |

## It runs and the answer is wrong

1. Write the example that fails, as a function call and the result you expected.
2. Trace the names on that example. One row per change.
3. Check the start value. Sums start at 0. Products start at 1. "Not found" is not 0 if 0 can be real data.
4. Check the end of a range. `range(n)` never yields `n`.
5. Check whether you compared an item with itself, or added it to the set before the lookup.
6. Print `repr(value)` if spaces might be hiding in a string.

## Django, and the page looks empty

1. Is the queryset filtered so tightly that no row matches?
2. Did you forget to migrate?
3. Are you logged in as the owner the rows were created with?
4. Is the template looping over the right context name?
5. Did a successful POST redirect to a different page than the one you are staring at?

:::why
Guessing a fix and running again feels faster for one minute. The traceback and one traced example are faster after that, because each guess without a failing example can "fix" the wrong line.
:::

:::tip
When you find the bug, add the failing example next to the function as a comment or a test. The next time the same shape breaks, you already have the cheat code.
:::

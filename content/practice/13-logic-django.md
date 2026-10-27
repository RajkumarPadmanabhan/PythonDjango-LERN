---
id: logic-django
track: practice
level: Pro
module: Logic building
title: Logic inside a Django view
minutes: 18
keywords: view, owner, form, redirect, queryset
summary: A view is a decision chain. Method, user, which rows, valid input, write, then redirect. Ask those questions in that order.
---

Syntax lessons show `request` and `render`. Logic building asks which question you are answering on each line. A safe view answers them in order:

1. Is this person logged in?
2. Is the method one you accept?
3. Which rows is this person allowed to see or change?
4. If they sent data, is it valid?
5. Which fields does the server set, that the form must not?
6. What response matches the outcome?

```py
def toggle(request, pk):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])
    task = get_object_or_404(Task, pk=pk, owner=request.user)
    task.done = not task.done
    task.save(update_fields=["done"])
    return redirect("task-list")
```

:::how
The method test is first. Anything other than POST returns 405 and does not touch the row. `get_object_or_404` puts the primary key and the owner in one lookup. A miss raises 404 before `done` changes. `not task.done` flips the stored boolean. `update_fields` writes that column only. `redirect` sends the browser to the list with GET, so refresh does not toggle again. `@login_required` belongs on the function so "who is this?" is answered before line 1.
:::

Put `@login_required` on the view so question 1 is not a copy-paste inside every function. The owner lives in the lookup, so another user's id is a 404 rather than a toggle.

## What not to trust

The browser can send any field. Logic that matters belongs on the server.

| Question | Wrong place | Right place |
| --- | --- | --- |
| Who owns this row? | A hidden `owner` input | `request.user` in the view |
| May they see it? | `{% if %}` in the template only | `filter(owner=request.user)` |
| Did the write succeed? | Assuming `save` always matches the form | Validate, then save, then redirect |
| Counting a vote | `votes += 1` then `save` | `F("votes") + 1` in the database |

:::why
Two people can read `votes == 3` and both save `4`. The database never saw 5. `F("votes") + 1` tells the database to add one to the stored value. The logic "one click, one vote" has to be true under two clicks at once, not only in a single-user trace.
:::

:::watch
Returning the form page after a successful POST makes refresh submit again. The logic of a successful write is "redirect to a page that loads with GET." Show the form again only when the input is invalid.
:::

:::quiz
Where do you decide that a task belongs to the logged-in user?
+ In the queryset, together with the primary key
- Only in the template, around the button
- In a hidden field the form posts back
because: The template can be skipped and a hidden field can be edited. The query is the decision that actually loads the row.
:::

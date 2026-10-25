---
id: project-poll
track: project
level: Beginner
module: Beginner Django
title: Project — one poll
minutes: 35
keywords: ForeignKey, F, transaction, project
summary: One question, several choices, one vote action that cannot trust a hidden count from the browser.
---

Build `labs/polls` the same way as the guestbook: project `config`, app `polls`.

## Models

```python
class Question(models.Model):
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name="choices", on_delete=models.CASCADE)
    text = models.CharField(max_length=200)
    votes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.text
```

Create the question and choices in the admin. The public page only votes.

## Vote without a race

Two people voting at once must not read `5`, both compute `6`, and both save `6`. Update the column in the database.

```python
from django.db.models import F
from django.db import transaction

@require_POST
def vote(request, choice_id):
    with transaction.atomic():
        choice = get_object_or_404(
            Choice.objects.select_for_update(),
            pk=choice_id,
        )
        Choice.objects.filter(pk=choice.pk).update(votes=F("votes") + 1)
    return redirect("results", question_id=choice.question_id)
```

`F("votes") + 1` is SQL. `select_for_update` matters when you also check a rule ("one vote per user") in the same transaction. SQLite locks the whole database for that moment, which is fine for this project. The pattern is what you are learning.

Do not take the new vote count from `request.POST`. The browser does not get to say what the total is.

## Results

```python
def results(request, question_id):
    question = get_object_or_404(Question.objects.prefetch_related("choices"), pk=question_id)
    return render(request, "polls/results.html", {"question": question})
```

`prefetch_related` loads the choices in one extra query. The template loops `question.choices.all` and prints `{{ choice.votes }}`.

## Test

```python
def test_vote_increments_once(self):
    question = Question.objects.create(text="Language?")
    choice = Choice.objects.create(question=question, text="Python")
    self.client.post(reverse("vote", args=[choice.pk]))
    choice.refresh_from_db()
    self.assertEqual(choice.votes, 1)
```

Post twice in a second test and expect 2. A GET to `vote` should be 405 because of `@require_POST`.

:::why
This project is still "beginner Django" and it already contains the pro bug: lost updates. If you only learn `choice.votes += 1; choice.save()`, you will ship that bug later when the page gets popular. Learn the `F` expression while the model has two fields.
:::

:::try
Show the leading choice on the results page. If there is a tie, show all leaders. Compute it in the view, not the template.
:::

:::solution
`top = max((c.votes for c in question.choices.all()), default=0)` then `leaders = [c for c in question.choices.all() if c.votes == top and top > 0]`. Pass `leaders` in the context. Remember the queryset is prefetched, so the second loop does not query again if you iterate the same related manager.
:::

:::quiz
Why use F("votes") + 1 instead of choice.votes += 1?
+ The database applies the increment to the current value, so two votes cannot overwrite each other with the same number
- F() is required for PositiveIntegerField
- Templates cannot print a normal integer
because: Reading the value into Python and writing it back loses an update when two requests overlap.
:::

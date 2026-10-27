---
id: logic-how
track: practice
level: Beginner
module: Logic building
title: How logic is built
minutes: 16
keywords: sequence, decision, loop, logic, steps
summary: Every program is three moves. Do the next step, choose, or repeat. Name those moves before you write code.
---

A program does not "think." It follows steps you wrote. Logic building is the skill of turning a sentence into those steps.

There are only three moves:

1. **Sequence.** Do this, then that, then the next thing.
2. **Decision.** If a test is true, do one thing. Otherwise do another.
3. **Repetition.** Do a step again until a test says stop.

Bigger programs are these three moves stacked. A Django view is the same shape: read the request, decide, maybe loop over rows, then respond.

## A sentence, then the moves

Sentence: "A year is a leap year when it is divisible by 4, except years divisible by 100, unless they are also divisible by 400."

Moves:

1. If the year divides by 400, it is a leap year. Stop.
2. If the year divides by 100, it is not. Stop.
3. If the year divides by 4, it is a leap year.
4. Otherwise it is not.

The order is the logic. Checking "divides by 4" first would mark the year 1900 as a leap year, and 1900 is not.

```python
def is_leap(year):
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0

print(is_leap(2024), is_leap(1900), is_leap(2000))
```

:::why
`%` is the remainder. A remainder of 0 means the number divides evenly. Returning as soon as you know the answer is a decision that stops the rest of the tests. That is why 2000 never reaches the `% 4` line: it already returned on `% 400`.
:::

:::watch
Writing `if year % 4 == 0 and year % 100 != 0 or year % 400 == 0` can be correct, but `and` and `or` bind in an order that is easy to get wrong. Separate `if` lines match the sentence and are easier to trace.
:::

:::quiz
Why is 1900 not a leap year even though 1900 % 4 == 0?
+ It is divisible by 100 and not by 400, and that test is checked first
- Every year divisible by 4 is a leap year
- 1900 is too far in the past for the % operator
because: The century exception is a decision that must run before the plain "divisible by 4" rule.
:::

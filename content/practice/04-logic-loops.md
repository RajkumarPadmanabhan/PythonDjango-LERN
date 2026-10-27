---
id: logic-loops
track: practice
level: Beginner
module: Logic building
title: The four jobs of a loop
minutes: 18
keywords: loop, count, sum, find, filter
summary: A loop counts, totals, finds one item, or keeps many. Give each loop one job.
---

When a loop feels confusing, name its job. Almost every beginner loop is one of these four.

| Job | Start with | Each step | Stop with |
| --- | --- | --- | --- |
| Count | `0` | add 1 when the test passes | the count |
| Total | `0` | add the value | the total |
| Find | nothing yet | return when you see it | the item, or say it is missing |
| Keep | `[]` | append when the test passes | the new list |

```python
def evens(nums):
    kept = []
    for num in nums:
        if num % 2 == 0:
            kept.append(num)
    return kept

def first_even(nums):
    for num in nums:
        if num % 2 == 0:
            return num
    return None

print(evens([1, 2, 3, 4]))
print(first_even([1, 2, 3, 4]))
```

`evens` is a keep. `first_even` is a find. Mixing them — appending and also returning inside the same loop — usually means you have not chosen the job.

:::why
The start value is the answer for an empty list. A keep starts at `[]`, so an empty input returns `[]`. A find has nothing to return, so after the loop you return `None` or raise. Do not return `0` for "not found" if `0` can be a real item.
:::

:::tip
Say the job out loud before you type `for`. "I am keeping." Then the only line inside the `if` is `kept.append(...)`.
:::

:::quiz
You need the first negative number in a list, or None when there is none. Which job is that?
+ Find
- Keep
- Total
because: You stop at one match and you need a way to say the match never came. That is a find, not a list of every match.
:::

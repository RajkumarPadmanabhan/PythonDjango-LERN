---
id: logic-functions
track: practice
level: Intermediate
module: Logic building
title: Split the problem into functions
minutes: 16
keywords: function, step, pure, decompose
summary: One function, one job. The top function should read like the sentence you started with.
---

When a problem has two sentences, it wants two functions. The top function calls them in order. Each small function is easy to trace because it has one job.

Sentence: "Read a score written as text. Reject blanks and words. Then turn the number into a pass or fail at 50."

```python
def parse_score(text):
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("score is blank")
    return int(cleaned)

def passed(score):
    return score >= 50

def report(text):
    score = parse_score(text)
    if passed(score):
        return f"{score}: pass"
    return f"{score}: fail"

print(report(" 49 "))
print(report("50"))
```

:::how
`parse_score` strips first, so the spaces around 49 do not reach `int`. A blank string raises before `int`, with your message. `int` does the conversion and raises `ValueError` on a word. `passed` sees only an int and compares it with 50. `report` calls them in the order of the sentence: parse, then decide, then build the text. `passed` does not know about strings. `parse_score` does not know about pass marks.
:::

`report` reads like the sentence. `parse_score` does not know about pass marks. `passed` does not know about text.

:::why
A function that both parses and decides is hard to test. You cannot check the pass rule without also feeding it strings. Splitting lets you test `passed(49)` and `passed(50)` with plain numbers, and test `parse_score(" 49 ")` on its own.
:::

:::try
`report("nope")` raises `ValueError` from `int`. Catch that in `report` and return `"not a number"` without changing `passed`.
:::

:::solution
Wrap only the parse:

```python
def parse_score(text):
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("score is blank")
    return int(cleaned)

def passed(score):
    return score >= 50

def report(text):
    try:
        score = parse_score(text)
    except ValueError:
        return "not a number"
    if passed(score):
        return f"{score}: pass"
    return f"{score}: fail"

print(report("49"))
print(report("nope"))
print(report("  "))
```

:::how
`try` runs the parse. `int("nope")` and a blank both raise `ValueError`, so one handler turns both into `"not a number"`. `passed` is not inside the `try`. It runs only after a real score exists. A pass still returns the pass string. A fail returns the fail string. The blank message and the `int` message are both `ValueError`, which is why they share this handler. Catch the blank before calling `int` if those two cases should say different things.
:::

`parse_score("")` raises your blank message, which is also a `ValueError`, so blanks and words both become `"not a number"` with this handler. If blanks should say something else, catch them before calling `int`.
:::

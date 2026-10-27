---
id: logic-decisions
track: practice
level: Beginner
module: Logic building
title: Decisions without a tangle
minutes: 16
keywords: if, elif, guard, order, decision
summary: Put the most specific test first. Return early when the answer is already known. Deep nesting usually means the order is wrong.
---

A decision is a question with two answers. Chains of `elif` are several questions where only the first true one counts.

```python
def ticket_price(age):
    if age < 0:
        raise ValueError("age cannot be negative")
    if age < 5:
        return 0
    if age < 18:
        return 8
    if age < 65:
        return 15
    return 10

print(ticket_price(3), ticket_price(16), ticket_price(40), ticket_price(70))
```

:::how
Negative ages fail the data, so the first line raises and does not invent a price. Each later test is the next band, and `return` means the first true band wins. Age 16 is less than 18 and also less than 65. Because `< 18` is earlier, the price is 8 and `< 65` is never asked. Age 70 fails every `<` test, so the last line is the senior price, with no extra `if`.
:::

Age 16 is less than 18 and also less than 65. The `< 18` test is first, so the price is 8. Swap those two tests and every child pays the adult price.

## Guard, then the main path

A guard is a decision that handles the bad or boring case and leaves. The rest of the function can assume the happy path.

```python
def label(name):
    cleaned = name.strip()
    if not cleaned:
        return "anonymous"
    return cleaned.title()

print(label("  ada "), label("   "))
```

:::how
`strip()` removes the spaces so the decision is about the letters, not the padding. `not cleaned` is true for `""`, and that path returns `"anonymous"` immediately. `"ada"` fails that test, so `title()` capitalizes it and that string is returned. There is no `else`. After a return, the rest of the function is the normal path.
:::

:::why
Once the empty name has returned, the last line does not need an `else`. The reader sees the normal result at the bottom, which is where they look.
:::

:::watch
Nesting a new `if` inside every previous `if` makes a staircase. Each extra indent is a question the reader must remember. Prefer a guard that returns, or an `elif` chain on one subject. Nest only when the inner question is meaningless unless the outer one is true.
:::

:::quiz
An age of 10 matches both `age < 18` and `age < 65`. Which price is used?
+ The price on the first true test
- The price on the last true test
- Python averages the matching prices
because: if / elif runs one branch. Later tests are not asked after a match.
:::

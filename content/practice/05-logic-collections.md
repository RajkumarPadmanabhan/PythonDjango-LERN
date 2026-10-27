---
id: logic-collections
track: practice
level: Intermediate
module: Logic building
title: Pick the collection that matches the question
minutes: 16
keywords: list, set, dict, lookup, membership
summary: A list remembers order. A set answers "have I seen this?" A dict answers "what is stored under this key?"
---

Choosing the wrong box makes the logic longer. Match the question.

| Question | Use |
| --- | --- |
| What is the third one? | list |
| Have I already seen this value? | set |
| What value is stored for this key? | dict |
| How many times did each value appear? | dict of counts |

```python
def counts(text):
    tally = {}
    for ch in text.casefold():
        if not ch.isalpha():
            continue
        tally[ch] = tally.get(ch, 0) + 1
    return tally

print(counts("Ada, ada"))
```

`get(ch, 0)` is the logic "zero if this letter is new." Then add one. A list of letters would make you scan the whole list for every character.

:::why
A set or dict lookup does not walk every stored item in the way a beginner loop does. "Is this key present?" is the question those types are built to answer. A list is the right tool when position and duplicates matter.
:::

:::watch
A set forgets order and duplicates. If the problem says "in the order they first appeared," a set alone is the wrong final answer. Keep a list for the order and a set for the "already seen" test.
:::

```python
def unique_in_order(items):
    seen = set()
    ordered = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        ordered.append(item)
    return ordered

print(unique_in_order(["b", "a", "b", "c", "a"]))
```

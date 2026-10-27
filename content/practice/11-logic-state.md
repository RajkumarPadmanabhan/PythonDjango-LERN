---
id: logic-state
track: practice
level: Advanced
module: Logic building
title: Remember state on purpose
minutes: 16
keywords: state, running total, toggle, state machine
summary: State is a name that remembers what happened so far. Change it in one place, and decide the next step from its current value.
---

A running total is state. A "have I seen a space yet" flag is state. The logic is: look at the current state and the next input, then write the next state.

```python
def running_max(nums):
    best = None
    history = []
    for num in nums:
        if best is None or num > best:
            best = num
        history.append(best)
    return history

print(running_max([3, 1, 4, 2]))
```

:::how
`best` starts as `None` because no number has been seen, and 0 would be wrong for a list of negatives. The first number always replaces `None`. Later numbers replace `best` only when they are strictly greater. `history.append(best)` runs on every item, including the ones that did not win, so 1 and 2 still record the earlier max. The result `[3, 3, 4, 4]` is the memory after each step, not a sorted copy of the input.
:::

`best` is the memory. `history` is the list of what that memory was after each step. `[3, 3, 4, 4]` means "the max so far," not "the list sorted."

## A tiny machine

Some text is "inside a word" or "between words." That is two states.

```python
def word_count(text):
    in_word = False
    count = 0
    for ch in text:
        if ch.isspace():
            in_word = False
        elif not in_word:
            count += 1
            in_word = True
    return count

print(word_count("ada  lovelace"))
print(word_count("   "))
```

:::how
`in_word` starts false, meaning "between words." A space sets it false and does not touch `count`. A letter while `in_word` is false is the first letter of a word: add 1, then set the flag true. Further letters of the same word hit the `elif` as false, so they are not counted. `"ada  lovelace"` enters a word twice. A string of spaces never enters, so the count stays 0.
:::

You count only on the step that **enters** a word. Spaces only flip the flag off. Extra spaces do not create extra words.

:::why
If you counted every non-space character you would count letters, not words. The flag is what distinguishes "first letter of a word" from "another letter of the same word."
:::

:::tip
Name the states with words you could say: `in_word`, `seen_dot`, `depth`. A pile of booleans named `flag1` and `flag2` means the states are not clear yet.
:::

Django uses the same idea. `request.user.is_authenticated` is state about the session. `task.done` is state about one row. A view reads that state, decides, and writes a new value. It should not keep a second copy of "done" in a global variable.

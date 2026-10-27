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

You count only on the step that **enters** a word. Spaces only flip the flag off. Extra spaces do not create extra words.

:::why
If you counted every non-space character you would count letters, not words. The flag is what distinguishes "first letter of a word" from "another letter of the same word."
:::

:::tip
Name the states with words you could say: `in_word`, `seen_dot`, `depth`. A pile of booleans named `flag1` and `flag2` means the states are not clear yet.
:::

Django uses the same idea. `request.user.is_authenticated` is state about the session. `task.done` is state about one row. A view reads that state, decides, and writes a new value. It should not keep a second copy of "done" in a global variable.

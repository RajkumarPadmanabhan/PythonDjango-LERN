---
id: conditionals
track: python
level: Beginner
module: Control flow
title: Conditions with if, elif, and else
minutes: 14
keywords: if, elif, else, match, case
summary: if runs one block. elif chains further tests. else runs when nothing matched. match compares a value against patterns.
---

An `if` statement runs its block only when the condition is true. `elif` tries another condition when earlier ones were false. `else` runs when every condition was false. Only one of the blocks runs.

```python
score = 82
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "retry"
print(grade)
```

The order matters. A `score` of 95 satisfies both `>= 90` and `>= 80`. The first true branch wins, so later branches are not tested.

There is no `switch` keyword. For a chain of equality tests against one subject, Python 3.10+ has `match`.

```python
command = "save"
match command:
    case "save":
        print("writing")
    case "quit" | "exit":
        print("stopping")
    case _:
        print("unknown")
```

`case` patterns can bind names, unpack sequences, and check types. `_` matches anything and binds nothing. `match` is a soft keyword, so a variable named `command` is unrelated to the statement.

A pattern with a capture:

```python
point = (4, 0)
match point:
    case (0, 0):
        print("origin")
    case (x, 0):
        print("on the x axis at", x)
    case (x, y):
        print("somewhere", x, y)
```

:::why
`elif` is not `else if` spelled oddly for decoration. It is one statement with one `else`. Writing a nested `else: if` works but drifts to the right and makes the "exactly one branch" structure harder to see.
:::

## Conditional expressions

```python
label = "even" if 4 % 2 == 0 else "odd"
print(label)
```

This is an expression. Use it when both branches are short. Use a statement when either branch has more than one step. Nesting conditional expressions is how code becomes unreadable.

:::watch
`if score >= 80 and <= 89` is a syntax error. The second comparison needs a subject: `80 <= score <= 89`, or `score >= 80 and score <= 89`.
:::

:::try
Given `n = 15`, print `fizz` if it is divisible by 3, `buzz` if divisible by 5, `fizzbuzz` if divisible by both, and the number otherwise. Test the "both" case first.
:::

:::solution
```python
n = 15
if n % 15 == 0:
    print("fizzbuzz")
elif n % 3 == 0:
    print("fizz")
elif n % 5 == 0:
    print("buzz")
else:
    print(n)
```
:::

:::quiz
A score of 90 matches both the A test and the B test. Which block runs?
+ The first true branch, the A block
- Both blocks
- The else block
because: if / elif / else runs exactly one block. Later tests are skipped after a match.
:::

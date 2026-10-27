---
id: cheat-logic
track: practice
level: Reference
module: Cheat codes
title: Cheat codes — logic shapes
minutes: 18
keywords: cheat, pattern, logic, loop, lookup
summary: When the sentence sounds like this, the code has this shape. Use it as a lookup while you solve a task.
---

Read the problem until one row matches. Then write that shape. Do not start from a blank `for`.

| You hear | Shape | Start value |
| --- | --- | --- |
| How many | count loop | `0` |
| How much, the total | add loop | `0` |
| The product | multiply loop | `1` |
| The first match | return inside the loop, then a missing value | `None` after the loop |
| Every match, same order | append into a new list | `[]` |
| Yes if every item passes | return `False` on the first failure | `True` after the loop |
| Yes if any item passes | return `True` on the first success | `False` after the loop |
| The largest or smallest | remember the best so far | the first item, after an empty check |
| Have I seen this? | set | `set()` |
| How many of each? | dict of counts | `{}` |
| Group these | dict of lists | `setdefault(key, [])` |
| What was stored under this name? | dict lookup | `.get(key)` when missing is allowed |
| Same forward and back | two indexes, or compare with a reverse | left `0`, right `len - 1` |
| Most recent unmatched opener | stack (a list, append and pop) | `[]` |
| Best stretch of k neighbors | sliding window | sum of the first k |
| Find in a sorted list | binary search | low `0`, high `len - 1` |
| Nested boxes, folders, replies | recursion with a base case | the empty case |
| Who may touch this row | filter by the logged-in user | `request.user` |

## The card you fill in before coding

1. Input and its type.
2. Output and its type.
3. Three examples, including empty.
4. The row from the table above.
5. What you refuse (`ValueError`, 404, invalid form).

## Order of tests

- More specific test first (`FizzBuzz` before `Fizz`, `% 400` before `% 4`).
- Guard the bad case and return.
- Then the normal case, unindented.

## One loop, one job

If you are both appending and returning inside the same loop, you have two jobs. Split them.

:::tip
Search this page for a word from the problem: "first", "every", "group", "seen", "sorted". The row is the cheat code. The tasks are where you practice it until you do not need the table.
:::

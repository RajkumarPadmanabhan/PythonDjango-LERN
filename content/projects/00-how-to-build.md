---
id: project-how-to-build
track: project
level: Beginner
module: Start building
title: How to build a project
minutes: 14
keywords: project, spec, slice, test, refactor
summary: A project is a small promise you can run. Specify it, build one slice, then the next. Do not start with a framework you have not used.
---

The lessons teach one idea at a time. A project is where those ideas have to live in the same file and survive a user who does not follow your script. Build the projects in the order in this track. Each one adds one new kind of difficulty.

## The five-line spec

Before you write code, answer these in a comment at the top of the file:

1. Who uses it?
2. What can they do?
3. What data does it remember?
4. What must never happen?
5. How will you know it works?

A guessing game's answers are: one player, guess a number, the secret and the attempt count, no crash on a blank line, a function that scores a guess without asking for input.

## One slice at a time

A slice is a path you can run today.

| Slice | You can demo |
| --- | --- |
| 1 | The program starts and prints instructions |
| 2 | One correct action works |
| 3 | The wrong actions show a clear message |
| 4 | The data survives a restart, if the project needs memory |
| 5 | A test or a `self_check` fails when you break the rule |

Stop when the slice runs. Commit, or copy the file somewhere safe, then start the next slice. A half-written login page plus a half-written model plus a half-written design is not a project. It is three unfinished slices.

## Where the code goes

Python projects in this track have a finished file in `labs/projects/`. Type your own first. Compare when you are stuck, not before you have tried the first slice.

Django projects are folders you create with `startproject`. The lesson lists every file. The task board in `labs/taskboard` is the pattern for settings, login, and tests. Copy the shape, not the task nouns, when a later project needs accounts.

## Beginner, intermediate, pro

| Level | You practice |
| --- | --- |
| Beginner | Input, decisions, loops, functions, one file |
| Intermediate | Files, modules, tests, a Django app with one model |
| Pro | Ownership, permissions, an API, transactions, a deploy checklist |

Pro does not mean more pages. It means a stranger cannot read someone else's rows, a refresh does not submit the form twice, and you can explain where the rule lives.

:::tip
When a project feels too big, delete a feature from the spec. A guestbook with comments, likes, and image uploads is three projects. Ship the guestbook.
:::

:::quiz
What is a slice?
+ A path you can run today, before the rest of the spec exists
- A CSS layout technique
- The last step, after every feature is written
because: You only know the project works if a small path already runs. The next slice stands on that.
:::

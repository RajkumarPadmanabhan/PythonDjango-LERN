---
id: project-guess
track: project
level: Beginner
module: Beginner Python
title: Project — guess the number
minutes: 25
keywords: random, input, loop, function, project
summary: A number is hidden. The player guesses until they hit it. Scoring the guess is a function so you can test it without typing.
---

You will build a game that picks a number from 1 to 20 and tells the player "higher" or "lower" until they guess it, or they quit.

Concepts: `random.randint`, `input`, `int`, `while`, functions, `try` / `except ValueError`.

The finished file is `labs/projects/guess_the_number.py`. Run it with `py -3 labs/projects/guess_the_number.py`. The browser runner cannot answer `input()`, so this project runs in your terminal.

## Slice 1 — score a guess

Do not ask the player anything yet. Write a function that compares two numbers.

```python
def judge(secret, guess):
    if guess == secret:
        return "correct"
    if guess < secret:
        return "higher"
    return "lower"
```

`higher` means the secret is higher than the guess, which is the hint you show.

## Slice 2 — one round of input

```python
def parse_guess(text):
    stripped = text.strip()
    if stripped.casefold() in {"q", "quit"}:
        return None
    return int(stripped)
```

`int("no")` raises `ValueError`. The loop catches that and asks again. Returning `None` is the quit signal. Do not use `None` to mean "bad number" as well. A bad number is the exception.

## Slice 3 — the loop

```python
import random

def play(secret, read_line):
    attempts = 0
    while True:
        try:
            guess = parse_guess(read_line("Guess 1-20, or q: "))
        except ValueError:
            print("Type a whole number.")
            continue
        if guess is None:
            return "quit", attempts
        attempts += 1
        result = judge(secret, guess)
        if result == "correct":
            return "correct", attempts
        print(result)

def main():
    secret = random.randint(1, 20)
    outcome, attempts = play(secret, input)
    if outcome == "correct":
        print(f"Yes, in {attempts} guesses.")
    else:
        print("Stopped.")
```

`play` takes `read_line` so a test can pass a fake input function. `main` passes the real `input`.

## Check it

```python
def self_check():
    assert judge(10, 10) == "correct"
    assert judge(10, 3) == "higher"
    assert judge(10, 12) == "lower"
    answers = iter(["nope", "3", "q"])
    outcome, attempts = play(10, lambda prompt: next(answers))
    assert outcome == "quit"
    assert attempts == 1
```

`self_check` runs before the game starts. If you break `judge`, you find out before you play.

:::try
Add a limit of 5 guesses. When the player uses them up, `play` returns `"lost"` and the attempts. Do not change `judge`.
:::

:::solution
Count after a real guess. When `attempts == 5` and the guess was wrong, return `"lost", attempts` instead of looping. Print the secret from `main` only after a loss, so the function stays pure about the outcome.
:::

:::quiz
Why does play take read_line instead of calling input directly?
+ Tests can supply answers without a keyboard
- input is a keyword
- random needs a callback
because: input blocks on a person. A stand-in function lets self_check drive the same loop.
:::

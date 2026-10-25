"""Guess a number from 1 to 20.

Run: py -3 labs/projects/guess_the_number.py
"""

from __future__ import annotations

import random


def judge(secret, guess):
    if guess == secret:
        return "correct"
    if guess < secret:
        return "higher"
    return "lower"


def parse_guess(text):
    stripped = text.strip()
    if stripped.casefold() in {"q", "quit"}:
        return None
    return int(stripped)


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


def self_check():
    assert judge(10, 10) == "correct"
    assert judge(10, 3) == "higher"
    assert judge(10, 12) == "lower"
    answers = iter(["nope", "3", "q"])
    outcome, attempts = play(10, lambda prompt: next(answers))
    assert outcome == "quit"
    assert attempts == 1


def main():
    self_check()
    secret = random.randint(1, 20)
    outcome, attempts = play(secret, input)
    if outcome == "correct":
        print(f"Yes, in {attempts} guesses.")
    else:
        print("Stopped.")


if __name__ == "__main__":
    main()

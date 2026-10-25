"""A quiz whose questions are data.

Run: py -3 labs/projects/quiz_game.py
"""

from __future__ import annotations

QUESTIONS = [
    {
        "prompt": "What does None mean?",
        "choices": ["The number zero", "No value", "An empty string"],
        "answer": 1,
    },
    {
        "prompt": "Which test is right for None?",
        "choices": ["value == None", "value is None", "not value"],
        "answer": 1,
    },
]


def score_answer(question, choice):
    return choice == question["answer"]


def ask(question, read_line):
    print(question["prompt"])
    for index, choice in enumerate(question["choices"], start=1):
        print(f"  {index}. {choice}")
    raw = read_line("Number: ").strip()
    picked = int(raw) - 1
    if not 0 <= picked < len(question["choices"]):
        raise ValueError("That number is not a choice")
    return score_answer(question, picked)


def percent(correct, total):
    if total == 0:
        return 0
    return round(100 * correct / total)


def play(questions, read_line):
    correct = 0
    for question in questions:
        while True:
            try:
                if ask(question, read_line):
                    correct += 1
                    print("Yes.")
                else:
                    print("No.")
                break
            except ValueError as exc:
                print(exc)
    return correct, len(questions)


def self_check():
    assert score_answer(QUESTIONS[0], 1) is True
    assert score_answer(QUESTIONS[0], 0) is False
    assert percent(1, 2) == 50
    answers = iter(["2", "2"])
    correct, total = play(QUESTIONS, lambda prompt: next(answers))
    assert (correct, total) == (2, 2)


def main():
    self_check()
    correct, total = play(QUESTIONS, input)
    print(f"Score {correct}/{total} ({percent(correct, total)}%)")


if __name__ == "__main__":
    main()

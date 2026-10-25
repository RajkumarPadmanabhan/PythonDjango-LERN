---
id: project-quiz
track: project
level: Beginner
module: Beginner Python
title: Project — quiz game
minutes: 24
keywords: list, dict, score, dataclass, project
summary: Questions live in data. The game loop only asks and scores. Adding a question does not mean editing the loop.
---

Build a five-question quiz. Each question has a prompt, three choices, and the index of the right one. At the end, print the score and the percent.

Concepts: a list of dicts or dataclasses, `enumerate`, functions that do not contain the question text.

File: `labs/projects/quiz_game.py`.

## Data separate from behavior

```python
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
```

The questions are data. `score_answer` is the rule. `ask` is the conversation. If you later load questions from JSON, `score_answer` does not change.

## Percent without integer truncation surprises

```python
def percent(correct, total):
    if total == 0:
        return 0
    return round(100 * correct / total)
```

`/` is true division. `100 * correct // total` would floor. Rounding is the friendlier scoreboard. Say so in the spec if you care which one you use.

:::why
A loop that contains the question text cannot be tested without playing, and you cannot add question six without scrolling through prints. Data in a list, rule in a function, printing in `main`. That split is the whole intermediate skill, practiced here while the program is still small.
:::

:::try
Load `QUESTIONS` from `questions.json` next to the script if the file exists. If it does not, keep the list in the file. Use `pathlib` and `json`.
:::

:::solution
`path = Path(__file__).with_name("questions.json")`. If `path.exists()`, `json.loads(path.read_text(encoding="utf-8"))` replaces `QUESTIONS`. Check that each item has `prompt`, `choices`, and `answer` before you start, and raise `ValueError` with the question number if one is missing.
:::

:::quiz
Where should the text of the questions live?
+ In a list or a file the loop reads, not inside the scoring function
- Only in print calls
- In the except block
because: Scoring compares indexes. The words are content. Mixing them means every new question edits the logic.
:::

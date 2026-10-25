"""Four-function calculator using Decimal.

Run: py -3 labs/projects/calculator.py
"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation

OPERATIONS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}


def evaluate(expression):
    parts = expression.split()
    if len(parts) != 3:
        raise ValueError("Use the form: 2 + 2")
    left, op, right = parts
    if op not in OPERATIONS:
        raise ValueError("Operator must be + - * or /")
    try:
        result = OPERATIONS[op](Decimal(left), Decimal(right))
    except InvalidOperation as exc:
        raise ValueError("Both sides must be numbers") from exc
    except ZeroDivisionError as exc:
        raise ValueError("Cannot divide by zero") from exc
    return result


def self_check():
    assert evaluate("2 + 2") == Decimal("4")
    assert evaluate("12.50 - 0.50") == Decimal("12.00")
    try:
        evaluate("1 / 0")
    except ValueError as exc:
        assert "zero" in str(exc)
    else:
        raise AssertionError("division by zero must fail")


def main():
    self_check()
    print("Enter things like 2 + 2. q quits.")
    while True:
        line = input("> ").strip()
        if line.casefold() in {"q", "quit"}:
            break
        try:
            print(evaluate(line))
        except ValueError as exc:
            print(exc)


if __name__ == "__main__":
    main()

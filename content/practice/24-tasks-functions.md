---
id: tasks-functions
track: practice
level: Intermediate
module: Tasks
title: Tasks — functions and edges
minutes: 28
keywords: task, function, edge, parse, page
summary: Clamp, chunk, parse, and paginate. Each function does one job and says what it refuses.
---

## Task 1 — clamp

Force `n` into `low`..`high`. Raise `ValueError` if `low > high`.

:::solution
```python
def clamp(n, low, high):
    if low > high:
        raise ValueError("low cannot be above high")
    if n < low:
        return low
    if n > high:
        return high
    return n

print(clamp(15, 0, 10), clamp(-2, 0, 10), clamp(4, 0, 10))
```
:::

## Task 2 — chunks

`chunks([1, 2, 3, 4, 5], 2)` returns `[[1, 2], [3, 4], [5]]`. Raise `ValueError` if the size is less than 1.

:::solution
```python
def chunks(items, size):
    if size < 1:
        raise ValueError("size must be at least 1")
    return [items[i:i + size] for i in range(0, len(items), size)]

print(chunks([1, 2, 3, 4, 5], 2))
print(chunks([], 3))
```
:::

## Task 3 — parse an int from text

Strip spaces. Return the int. Raise `ValueError` with a short message for blanks and for words.

:::solution
```python
def parse_int(text):
    cleaned = text.strip()
    if not cleaned:
        raise ValueError("blank")
    try:
        return int(cleaned)
    except ValueError as exc:
        raise ValueError("not an integer") from exc

print(parse_int(" 42 "))
```
:::

## Task 4 — one page

Return the slice for a 1-based page number. `page([], 1, 10)` is `[]`. Page 2 of a 3-item list with size 2 is the last item. Raise `ValueError` if the page is below 1 or the size is below 1.

:::solution
```python
def page(items, number, size):
    if number < 1 or size < 1:
        raise ValueError("page and size start at 1")
    start = (number - 1) * size
    return items[start:start + size]

print(page(["a", "b", "c", "d", "e"], 2, 2))
print(page(["a"], 3, 2))
```
:::

## Task 5 — password rules as separate checks

Return a list of problems. An empty list means the password passed. Rules: at least 8 characters, one lowercase, one uppercase, one digit. Do not print.

:::solution
```python
def password_problems(text):
    problems = []
    if len(text) < 8:
        problems.append("use at least 8 characters")
    if not any(ch.islower() for ch in text):
        problems.append("add a lowercase letter")
    if not any(ch.isupper() for ch in text):
        problems.append("add an uppercase letter")
    if not any(ch.isdigit() for ch in text):
        problems.append("add a digit")
    return problems

print(password_problems("short"))
print(password_problems("Longpass1"))
```

Each rule is its own test so the caller can show every problem, not only the first.
:::

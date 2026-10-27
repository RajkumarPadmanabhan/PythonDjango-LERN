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

:::how
The first `if` refuses a backwards range before any clamping. Then the number is compared with each end. Below `low`, the low end is the closest allowed value, so that is returned. Above `high`, the high end is returned. A number inside the range matches neither test and is returned as itself. 15 becomes 10, -2 becomes 0, 4 stays 4.
:::
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

:::how
`range(0, len(items), size)` produces the start index of each chunk: 0, 2, 4 for a size of 2. `items[i:i + size]` takes that many items, and a slice that runs past the end simply stops, which is why the last chunk can be shorter: `[5]`. An empty list has length 0, so the range is empty and the result is `[]`. A size below 1 would make the range step invalid or infinite in spirit, so it is rejected first.
:::
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

:::how
`strip()` removes the spaces before any test, so `" 42 "` becomes `"42"`. An empty string after stripping is a blank, not a number, and raises your message. `int(cleaned)` does the real conversion. Words raise `ValueError` from `int`. Catching that and raising again with `from exc` replaces the message but keeps the original error attached, so a debugger can still see that `int` failed.
:::
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

:::how
Pages are 1-based, indexes are 0-based. Page 1 starts at index 0, page 2 starts at `size`, so `(number - 1) * size` is the start. The slice `items[start:start + size]` is that page. Page 2 with size 2 starts at 2 and takes `c` and `d`. A start past the end, such as page 3 of a one-item list, is an empty slice, not an error. The guard only rejects a page or size below 1, which would mean "before the first page."
:::
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

:::how
`problems` starts empty, and an empty list is the "passed" answer. Each `if` can append without returning, so a short password with no uppercase and no digit collects three messages. `any(...)` is true when one character passes the test. `not any(...)` means none did. `"Longpass1"` fails none of the tests, so the returned list stays empty.
:::

Each rule is its own test so the caller can show every problem, not only the first.
:::

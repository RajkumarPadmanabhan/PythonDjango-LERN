---
id: testing-python
track: python
level: Intermediate
module: Intermediate Python
title: Testing Python
minutes: 16
keywords: unittest, pytest, assert, TestCase, fixture
summary: A test calls your function with a known input and checks the result. Run them every time you change the code.
---

```python
def clamp(n, low, high):
    return max(low, min(high, n))

def test_clamp_inside():
    assert clamp(5, 0, 10) == 5

def test_clamp_high():
    assert clamp(15, 0, 10) == 10

if __name__ == "__main__":
    test_clamp_inside()
    test_clamp_high()
    print("ok")
```

That file is a real test. `pytest` finds functions named `test_*` and runs them without the `if __name__` block. The standard library's `unittest` uses classes:

```python
import unittest

class ClampTests(unittest.TestCase):
    def test_low(self):
        self.assertEqual(max(0, min(10, -3)), 0)

if __name__ == "__main__":
    unittest.main()
```

Run `python -m unittest` or `pytest`. A failing assert shows the values. Fix the code or fix the test. Do not weaken the assertion to make it green.

## What to test

Test behavior a caller depends on: return values, raised exceptions, and state changes you promised. Do not test the standard library. One assertion theme per test keeps the failure message pointed at one reason.

```python
import pytest

def parse_score(text):
    score = int(text)
    if score < 0:
        raise ValueError("negative")
    return score

def test_rejects_negative():
    with pytest.raises(ValueError):
        parse_score("-1")
```

`unittest` uses `with self.assertRaises(ValueError)`.

## Fixtures and isolation

A test that writes a file should use `tmp_path` (pytest) or `tempfile` and delete after itself. A test that needs the network is slow and fragile. Push the HTTP call behind a function you can replace.

Django's `TestCase` wraps each test in a transaction and rolls it back, so the database you use for tests does not keep rows. That lesson is in the Django track. The habit starts here: every test should be able to run alone, in any order.

:::tip
Write the test before the fix when you are debugging. A test that fails for the bug you just saw is a lock that keeps the bug from returning.
:::

:::quiz
Why should tests avoid depending on each other's order?
+ Each test should set up the state it needs, so one failure does not cascade into fiction
- Python randomizes order and will refuse ordered tests
- Assertions only work in the first test
because: Shared leftover state makes a test pass only when another test ran first. That is not a test of the function.
:::

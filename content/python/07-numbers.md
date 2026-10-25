---
id: numbers
track: python
level: Beginner
module: Data
title: Numbers
minutes: 18
keywords: int, float, complex, Decimal, Fraction, operator
summary: Integers are exact and unbounded. Floats are binary approximations. Money belongs in Decimal.
---

Python has three built-in number types, plus two standard-library types you should know before you store money.

## int

An `int` is a whole number of arbitrary size. `10**100` is fine. There is no silent overflow to a negative number the way some languages overflow a 32-bit integer.

```python
print(10 ** 100)
print(7 // 2)
print(7 % 2)
print(divmod(7, 2))
print(-7 // 2)
```

`/` is true division and always returns a float. `//` is floor division: it rounds toward negative infinity, so `-7 // 2` is `-4`, not `-3`. `%` is the remainder, and it follows the same floor. `divmod(a, b)` returns both.

## float

A `float` is a binary floating-point number, usually IEEE 754 double precision. It cannot represent most decimal fractions exactly.

```python
print(0.1 + 0.2)
print(round(0.1 + 0.2, 10))
```

You will see `0.30000000000000004`. That is not a Python bug. It is the value that binary floating point actually stored. Compare floats with a tolerance, or do not use them for money.

Useful tools: `abs`, `round`, `pow`, `math.sqrt`, `math.floor`, `math.ceil`, `math.isclose`.

```python
import math
print(math.isclose(0.1 + 0.2, 0.3))
```

## complex

```python
z = 2 + 3j
print(z.real, z.imag, abs(z))
```

The suffix is `j`, not `i`. You will rarely need this for Django. It exists, and `abs` of a complex number is its magnitude.

## Decimal and Fraction

```python
from decimal import Decimal, ROUND_HALF_UP
price = Decimal("19.99")
tax = (price * Decimal("0.08")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(price + tax)

from fractions import Fraction
print(Fraction(1, 3) + Fraction(1, 6))
```

Pass strings to `Decimal`, not floats. `Decimal(0.1)` stores the binary approximation you were trying to avoid. `Decimal("0.1")` stores one tenth.

## Operators on numbers

| Operator | Meaning |
| --- | --- |
| `+ - *` | Add, subtract, multiply |
| `/` | True division, float result |
| `//` | Floor division |
| `%` | Remainder |
| `**` | Power |
| `+x -x` | Unary plus and minus |
| `abs(x)` | Distance from zero |

Augmented assignment `n += 1` rebinds `n` to `n + 1` for numbers, because numbers cannot be mutated.

## Bases and conversions

```python
print(int("1010", 2), int("ff", 16), bin(10), hex(255))
print(int(3.9))
print(float("3.5"))
```

`int(3.9)` truncates toward zero. It does not round. `int("3.5")` raises `ValueError` because the string is not an integer literal. Convert through `float` if that is what you meant.

:::watch
`float` equality in tests is a source of flaky failures. Prefer `Decimal` for currency and `math.isclose` for measurements.
:::

:::try
Compute how many whole weeks are in 50 days, and how many days are left over, using `divmod`. Print both numbers.
:::

:::solution
```python
weeks, days = divmod(50, 7)
print(weeks, days)
```
:::

:::quiz
Why is Decimal("0.10") safer than Decimal(0.10) for money?
+ The string is parsed as a decimal. The float is already a binary approximation
- Strings are faster
- Decimal refuses floats entirely
because: 0.10 as a float is not exactly one tenth. Decimal then preserves that error. The string "0.10" is exact.
:::

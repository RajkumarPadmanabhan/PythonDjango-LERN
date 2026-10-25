---
id: builtins-and-operators
track: reference
level: Reference
module: Language reference
title: Builtins and operators
minutes: 20
keywords: builtin, operator, precedence, walrus, unpacking
summary: The operators, in precedence order, and the builtins you are expected to recognize.
---

## Operators, from tighter to looser

| Operators | Role |
| --- | --- |
| `()` `[]` `.` attribute, call, subscript | Binding |
| `await` | Await an awaitable |
| `**` | Power |
| `+x` `-x` `~x` | Unary plus, minus, bitwise not |
| `*` `/` `//` `%` `@` | Multiply, true divide, floor divide, remainder, matrix multiply |
| `+` `-` | Add, subtract. `+` also concatenates sequences |
| `<<` `>>` | Bit shifts |
| `&` | Bitwise and |
| `^` | Bitwise xor |
| `\|` | Bitwise or. Also dict merge and union types |
| `in`, `not in`, `is`, `is not`, `<` `<=` `>` `>=` `!=` `==` | Comparisons. Chains are `and` |
| `not` | Boolean not |
| `and` | Boolean and, returns an operand |
| `or` | Boolean or, returns an operand |
| `if else` | Conditional expression |
| `:=` | Named expression (walrus). Assignment inside an expression |
| `lambda` | Anonymous function |
| `=` and `+=` and the other augmented forms | Statements, not expressions, except `:=` |

`/` on integers returns a float. `//` floors toward negative infinity. `@` is matrix multiply used by libraries such as NumPy. You will not use it in Django.

Comparisons can chain: `0 <= n < 10`. Identity (`is`) is not equality (`==`).

## Built-in functions worth knowing cold

`abs`, `all`, `any`, `ascii`, `bin`, `bool`, `breakpoint`, `bytearray`, `bytes`, `callable`, `chr`, `classmethod`, `compile`, `complex`, `delattr`, `dict`, `dir`, `divmod`, `enumerate`, `eval`, `exec`, `filter`, `float`, `format`, `frozenset`, `getattr`, `globals`, `hasattr`, `hash`, `help`, `hex`, `id`, `input`, `int`, `isinstance`, `issubclass`, `iter`, `len`, `list`, `locals`, `map`, `max`, `memoryview`, `min`, `next`, `object`, `oct`, `open`, `ord`, `pow`, `print`, `property`, `range`, `repr`, `reversed`, `round`, `set`, `setattr`, `slice`, `sorted`, `staticmethod`, `str`, `sum`, `super`, `tuple`, `type`, `vars`, `zip`.

Python 3.15 adds `frozendict` and `sentinel` to this set.

`eval` and `exec` run code. Do not point them at user input. `compile` is how tools build code objects. `dir` and `vars` are for exploration. `help` reads docstrings.

`isinstance(obj, (Task, Note))` accepts a tuple of types. `issubclass` compares classes. Prefer `isinstance` to comparing `type(obj) is Task`, so a subclass still counts.

`zip(*rows, strict=True)` transposes and complains if lengths differ. Without `strict`, it stops at the shortest.

`slice(1, 4, 2)` is the object behind `seq[1:4:2]`. You rarely build it yourself.

## Truth, identity, and containers

`all([])` is `True`. `any([])` is `False`. `bool` uses `__bool__` or `__len__`. Empty containers are false. `None` is false. The integer `0` is false. The string `"0"` is true.

:::tip
When an expression is hard to parse, add parentheses. Precedence is a fact, not a puzzle you should make the next reader solve.
:::

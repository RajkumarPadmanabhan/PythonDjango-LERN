---
id: functional-tools
track: python
level: Advanced
module: Advanced Python
title: Functional tools
minutes: 12
keywords: map, filter, reduce, partial, operator, sorted
summary: map, filter, and comprehensions do the same job. Comprehensions are usually clearer. functools and operator fill the gaps.
---

```python
numbers = [1, 2, 3, 4]
print(list(map(lambda n: n * n, numbers)))
print(list(filter(lambda n: n % 2 == 0, numbers)))
print([n * n for n in numbers if n % 2 == 0])
```

The comprehension is the one to write. `map` and `filter` return iterators. They still appear in older code, so you should read them. `functools.reduce` folds a sequence. `sum` covers the common case. Reach for `reduce` when the operation is not addition and a loop would be harder to read, which is rare.

```python
from functools import reduce
from operator import mul
print(reduce(mul, [1, 2, 3, 4], 1))
```

`operator.itemgetter` and `attrgetter` are faster, clearer keys for `sorted`:

```python
from operator import itemgetter
rows = [{"name": "Grace", "n": 2}, {"name": "Ada", "n": 1}]
print(sorted(rows, key=itemgetter("name")))
```

`sorted` returns a new list. The `key` function is called once per item. `reverse=True` flips the order. To sort by two fields, return a tuple from the key: `key=lambda row: (row["n"], row["name"])`.

`any` and `all` short-circuit:

```python
print(any(n > 3 for n in numbers))
print(all(n > 0 for n in numbers))
```

`any` on an empty iterable is `False`. `all` on an empty iterable is `True`. That vacuous truth surprises people writing validation.

:::tip
Side effects do not belong in `map`. If you are calling `map` for the appending and throwing away the result, write a `for` loop. The loop says "I am doing this for the effect."
:::

:::quiz
What does all([]) return?
+ True
- False
- It raises
because: Every item in an empty set satisfies the condition. There is no counterexample. any([]) is False because there is no example either.
:::

---
id: mutability-and-memory
track: python
level: Advanced
module: Advanced Python
title: Mutability, identity, and memory
minutes: 16
keywords: mutable, immutable, copy, deepcopy, intern, gc
summary: Mutable objects can change while names still point at them. Copying has depth. The garbage collector reclaims objects with no references.
---

Immutable: `int`, `float`, `complex`, `str`, `bytes`, `tuple`, `frozenset`, `frozenset`, and (3.15) `frozendict` when you treat it as frozen. Also `bool` and `None`.

Mutable: `list`, `dict`, `set`, `bytearray`, most objects you write.

Binding a name never copies. `copy.copy` is shallow: a new container, the same items. `copy.deepcopy` copies the items, and their items, and stops on objects that define a custom reduce. Cycles are handled.

```python
import copy
grid = [[1], [2]]
shallow = copy.copy(grid)
deep = copy.deepcopy(grid)
grid[0].append(9)
print(shallow[0], deep[0])
```

`shallow[0]` sees the `9` because the inner list is shared. `deep[0]` does not.

## Arguments

Python is pass-by-object-reference. The function receives a reference to the same object. Rebinding the parameter is local. Mutating the object is visible to the caller. This is the whole rule. There is no pass-by-value copy of the list.

## Interning and equality

CPython may reuse small integers and some strings, so `is` can look true by accident. `==` is the value test. Identity is for `None`, sentinels, and objects you mean to share.

## Garbage collection

When nothing refers to an object, its memory can be reclaimed. CPython uses reference counts plus a cyclic collector, because two objects can point at each other and still be garbage. You do not free memory yourself. You do drop references by leaving a scope, deleting a name, or clearing a collection.

A closure, a default argument, or a cache can keep an object alive longer than you think. `weakref.WeakValueDictionary` holds values without keeping them alive. Django's request objects should die at the end of the request. Storing a request on a long-lived object is a leak of both memory and data.

`sys.getsizeof` reports the container, not the whole graph of nested objects. It is a hint, not a bill.

:::watch
Using a mutable object as a dict key is forbidden when the type is unhashable. Stuffing a mutable into a tuple and using the tuple as a key is legal and wrong: the hash was computed from the current contents, and mutating the inner list strands the entry. Do not do it.
:::

:::quiz
After b = a where a is a list, which operation is visible through both names?
+ a.append(1)
- a = [1]
- b = []
because: append changes the shared object. Assigning to a or b only rebinds that one name.
:::

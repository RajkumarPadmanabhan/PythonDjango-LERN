---
id: logic-nested
track: practice
level: Intermediate
module: Logic building
title: Nested loops, and the lookup that replaces one
minutes: 18
keywords: nested loop, pair, lookup, set
summary: A loop inside a loop compares every item with every other item. A set or dict often answers the same question in one pass.
---

A nested loop is the honest shape of "compare each item with the others." It is also slow once the list is long, and it is easy to compare an item with itself.

```python
def has_pair_sum(nums, target):
    for i, left in enumerate(nums):
        for right in nums[i + 1:]:
            if left + right == target:
                return True
    return False

print(has_pair_sum([2, 7, 11], 9))
print(has_pair_sum([1, 2, 3], 10))
```

:::how
The outer loop picks one item and remembers its index with `enumerate`. The inner loop starts at `i + 1`, so an item is not paired with itself and earlier pairs are not repeated. `left + right == target` is the test. The first success returns `True`. If both loops finish, no pair worked and the answer is `False`. This tries every remaining pair. That is correct, and it is the slow version of the question.
:::

`nums[i + 1:]` skips the item itself and the pairs already checked. That is the logic. The inner loop is still a scan.

## One pass with a set

Ask a different question: "I have `left`. Have I already seen `target - left`?"

```python
def has_pair_sum_fast(nums, target):
    seen = set()
    for num in nums:
        if target - num in seen:
            return True
        seen.add(num)
    return False

print(has_pair_sum_fast([2, 7, 11], 9))
```

:::how
`seen` holds numbers already passed. For each `num`, `target - num` is the partner that would finish the pair. The lookup happens before `add`. On `[2, 7]` with target 9, 2 is stored, then 7 finds 2 and returns. Adding first would put the current number in the set before the test, so a single 4 would look like a pair for target 8.
:::

Add the number **after** the test. If you add it first, a value can pair with itself. `target` 8 and a single `4` would look like a pair even though 4 appears once.

:::why
The nested version tries every pair. The set version remembers what it has already walked past. Both are correct for this yes/no question. The set version is the one to reach for when the inner loop is only asking "have I seen this?"
:::

:::tip
Draw the nested version first if the problem is new. Replace the inner loop only when you can name the lookup. Replacing it too early hides the logic.
:::

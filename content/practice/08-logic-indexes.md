---
id: logic-indexes
track: practice
level: Intermediate
module: Logic building
title: Index logic, from both ends
minutes: 16
keywords: index, palindrome, two pointers, slice
summary: An index is a position. Moving one index from each end is how you compare a sequence without building a reversed copy first.
---

`text[0]` is the first character. `text[-1]` is the last. A loop that only counts upward sees the sequence from the left. Some questions need both ends at once.

Is it a palindrome if you ignore spaces and case?

```python
def is_palindrome(text):
    chars = [ch.casefold() for ch in text if ch.isalnum()]
    left = 0
    right = len(chars) - 1
    while left < right:
        if chars[left] != chars[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("nope"))
```

:::how
The comprehension builds a list of letters and digits, folded to one case. `left` starts at the first index. `right` starts at `len(chars) - 1`, the last valid index. `len(chars)` itself is one past the end and would raise `IndexError`. While `left < right`, the two positions are compared. A mismatch returns `False` immediately. A match moves both indexes inward. They stop when they meet, so a middle character is not compared with itself. If the loop finishes, every pair matched.
:::

`left < right` stops when the indexes meet or cross. A middle character in an odd-length list is never compared with itself, which is fine: it matches itself.

:::why
You clean the text once, then move. If you compared raw characters, the comma and the spaces would make a real palindrome look false. Cleaning is its own step. The loop's only job is "do these two positions match?"
:::

:::watch
`right = len(chars)` points one past the end. The last valid index is `len(chars) - 1`. Using the length as an index raises `IndexError` on the first comparison.
:::

The same two-index shape finds a pair in a **sorted** list that adds up to a target: if the sum is too small, move `left` rightward; if it is too big, move `right` leftward. It only works because the list is sorted. On an unsorted list, use a dict (see the patterns lesson).

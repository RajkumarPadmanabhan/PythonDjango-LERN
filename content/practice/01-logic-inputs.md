---
id: logic-inputs
track: practice
level: Beginner
module: Logic building
title: Name the inputs and the output
minutes: 14
keywords: input, output, example, spec, logic
summary: Before any code, write what goes in, what comes out, and three examples. One of the examples should be awkward.
---

Most stuck beginners start typing before they know what "done" looks like. A logic problem becomes a function with a known input and a known output.

Write four lines on paper, or in a comment:

1. **Name.** What question am I answering?
2. **Input.** What values arrive, and what type is each?
3. **Output.** What do I return? A number, a list, a yes/no, a message?
4. **Examples.** At least three. Include an empty or tiny case.

## Worked spec

Question: keep the words longer than 3 letters.

| Input | Output |
| --- | --- |
| `"a cat sat"` | `["cat", "sat"]` — "a" is too short |
| `""` | `[]` |
| `"four five"` | `["four", "five"]` |

Now the code is a translation of the table, not a guess.

```python
def long_words(text):
    words = text.split()
    kept = []
    for word in words:
        if len(word) > 3:
            kept.append(word)
    return kept

print(long_words("a cat sat"))
print(long_words(""))
print(long_words("four five"))
```

:::how
`split()` with no argument cuts on whitespace and drops empty pieces, so `""` becomes `[]` and the loop body never runs. `kept` starts empty and is the answer for that case. For each word, `len(word) > 3` decides. `"a"` has length 1 and is not appended. `"cat"` and `"sat"` are. `return kept` hands the list back. Nothing is printed inside the function, so the three `print` calls are the examples from the table.
:::

:::why
`split()` with no argument splits on any whitespace and drops empty pieces, so `""` becomes `[]` and the loop body never runs. Returning `kept` means the caller can test the function without looking at printed text.
:::

:::try
Add a fourth example before you change the function: `"the"` should return `[]` because 3 is not greater than 3. Then change the test to `>= 3` and predict the new results for all four examples.
:::

:::solution
`"the"` has length 3, so `> 3` rejects it. After you switch to `>= 3`, `"a cat sat"` returns `["cat", "sat"]` still, `""` returns `[]`, `"four five"` is unchanged, and `"the"` returns `["the"]`.
:::

:::quiz
What belongs in the spec before you write the loop?
+ The inputs, the output, and examples that include an empty case
- The name of the Python file
- A list of every keyword in the language
because: Examples tell you what the loop must keep and what it must ignore. Keywords are tools you pick after the spec is clear.
:::

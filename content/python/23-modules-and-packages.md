---
id: modules-and-packages
track: python
level: Beginner
module: Functions and files
title: Modules, packages, and imports
minutes: 20
keywords: import, from, package, __name__, sys.path
summary: A module is a file. A package is a folder of modules. Import runs the file once and caches the module object.
---

A module is a `.py` file. `import math` finds `math`, executes it, and binds the resulting module object to the name `math`. A second import in the same process returns the cached module. It does not run the file again.

```python
import math
print(math.sqrt(16))
from math import pi
print(round(pi, 3))
```

`from math import pi` binds the name `pi` in your module. It does not bind `math`. Prefer `import math` when the name would be unclear on its own (`pi` is fine, `loads` is not — write `json.loads`).

## Packages

A package is a directory that Python treats as a module. On current Python you do not need an empty `__init__.py` for a simple namespace, but put one in anyway: it marks the directory as a regular package and gives you a place for package-level names.

```text
app/
  __init__.py
  models.py
  views.py
```

`from app.models import Task` loads `app`, then `app.models`, then binds `Task`.

## How Python finds modules

`sys.path` is the list of directories searched. The first entry is the directory of the script you ran, or `''` for the current directory in the REPL. Then comes the standard library and the virtual environment's site-packages.

That is why a file named `json.py` in your project breaks `import json`. Your file wins, and the standard library becomes invisible. Name files after your domain, not after the library.

## `if __name__ == "__main__"`

Every module has `__name__`. When you run a file directly, `__name__` is `"__main__"`. When the file is imported, `__name__` is the module name.

```python
def main():
    print("running as a program")

if __name__ == "__main__":
    main()
```

Put the program's entry point under that guard so importing the file to test a function does not start the program.

## Relative imports

Inside a package, `from .models import Task` means "the models module next to me." `from ..billing.models import Invoice` goes up one package. Relative imports fail if you run a file inside the package as a script. Run the package (`python -m app`) or use the project as a package.

## Lazy imports (3.15)

Startup cost is often imports you do not use on this run. Python 3.15 lets you defer them:

```python
# lazy import json
# The module object is a proxy until you first use json.loads(...)
```

`lazy` is only legal at module level, not inside a function, class, or `try`. The alternative that works on every version is to import inside the function that needs the library. That is still the right move for an optional dependency.

:::why
Circular imports happen when `a.py` imports `b.py` while `b.py` is still importing `a.py`. One of them sees a half-initialized module and `AttributeError` follows. Fix it by moving the shared piece to a third module, or by importing inside the function that needs it, after both modules have finished loading. Do not paper over it with `lazy` until the cycle itself makes sense.
:::

:::watch
`from module import *` dumps every public name into your namespace and makes it unclear where a name came from. Avoid it outside a few REPL experiments and some package `__init__` files that define `__all__`.
:::

:::quiz
Why does a local file named json.py break import json?
+ The script's directory is searched first, so your file hides the standard library
- json is a keyword
- Python refuses duplicate names with a special error before import
because: sys.path puts the script directory ahead of the standard library. The import system loads the first match.
:::

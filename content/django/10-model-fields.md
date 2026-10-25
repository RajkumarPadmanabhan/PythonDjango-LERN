---
id: model-fields
track: django
level: Intermediate
module: Models and the database
title: Model fields
minutes: 18
keywords: CharField, ForeignKey, JSONField, choices, GeneratedField, on_delete
summary: Each field class maps a Python type to a column, with constraints and form behavior.
---

## The field catalog

| Field | Stores |
| --- | --- |
| `AutoField`, `BigAutoField`, `SmallAutoField` | Integer primary keys. Big is the Django 6 default |
| `IntegerField`, `BigIntegerField`, `SmallIntegerField` | Integers |
| `PositiveIntegerField`, `PositiveSmallIntegerField`, `PositiveBigIntegerField` | Integers, validated as non-negative in forms |
| `FloatField` | Floating point. Not for money |
| `DecimalField(max_digits, decimal_places)` | Exact decimals. Use this for money |
| `BooleanField` | True or false. It does not take NULL unless you use `NullBooleanField`'s replacement: `BooleanField(null=True)` |
| `CharField(max_length)` | Short text. `max_length` is required |
| `TextField` | Long text |
| `SlugField` | URL slug. Pair with `prepopulated_fields` in the admin |
| `EmailField`, `URLField` | Text plus validation. Django 6's `URLField` defaults to HTTPS-oriented forms; read the release notes if you accept `http://` |
| `UUIDField` | UUIDs. A good public identifier when you do not want to expose a sequential id |
| `DateField`, `DateTimeField`, `TimeField`, `DurationField` | Time |
| `BinaryField` | Bytes. Do not use it for uploaded files |
| `FileField`, `ImageField` | A path in storage, not the bytes in the row. `ImageField` needs Pillow |
| `FilePathField` | A choice among files on disk. Rare |
| `GenericIPAddressField` | An IP address |
| `JSONField` | JSON. Prefer it over a text field you parse yourself |
| `ForeignKey`, `OneToOneField`, `ManyToManyField` | Relationships |
| `GeneratedField` | A column the database computes. Django 5+ |

`choices` restricts values. Django's `TextChoices` keeps the values and the labels together:

```python
class Task(models.Model):
    class Priority(models.TextChoices):
        LOW = "low", "Low"
        HIGH = "high", "High"

    priority = models.CharField(max_length=8, choices=Priority.choices, default=Priority.LOW)
```

## Arguments you will set

| Argument | Meaning |
| --- | --- |
| `null` | Database NULL allowed |
| `blank` | Forms may omit it |
| `default` | Value used when you omit the field. Use a callable for mutable or per-row values |
| `unique` | Column uniqueness |
| `db_index` | An index for filters |
| `primary_key` | This field is the primary key |
| `editable` | Hidden from forms and the admin |
| `db_column` | Column name, if it must not match the field |
| `validators` | Extra callables |
| `help_text`, `verbose_name` | Admin and form copy |

`on_delete` is required on foreign keys. `CASCADE` deletes the dependent rows in Python, firing signals. `PROTECT` refuses the delete. `SET_NULL` needs `null=True`. `SET_DEFAULT` needs a default. `DO_NOTHING` leaves it to the database and can raise an integrity error. Django 6.1 adds `DB_CASCADE`, `DB_SET_NULL`, and `DB_SET_DEFAULT`, which express the rule in SQL. `DB_CASCADE` does **not** fire `pre_delete` or `post_delete`. Choose it when you want the database to do the work and you do not depend on those signals.

## Constraints

```python
class Meta:
    constraints = [
        models.UniqueConstraint(fields=["owner", "title"], name="uniq_task_title_per_owner"),
        models.CheckConstraint(condition=models.Q(title__gt=""), name="title_not_empty"),
    ]
```

A unique constraint on two fields is how "each user has unique task titles" becomes a real guarantee. Checking it only in the view allows two simultaneous requests to both succeed.

:::tip
Add an index for columns you filter or order by on large tables: foreign keys are indexed automatically, ordinary `CharField` filters are not.
:::

:::quiz
Where should money be stored?
+ DecimalField
- FloatField
- CharField
because: Float is binary and drifts. DecimalField maps to a decimal column and pairs with Python's Decimal.
:::

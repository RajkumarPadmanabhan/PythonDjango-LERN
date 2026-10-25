---
id: project-bookmarks
track: project
level: Intermediate
module: Intermediate Django
title: Project — bookmarks
minutes: 40
keywords: search, pagination, tag, unique, project
summary: Each user saves links with tags. Search and pagination stay in the queryset. Duplicate URLs per user are rejected by the database.
---

App idea: a logged-in user saves a URL, a title, and optional tags. They can search their own titles. They never see another user's rows.

Create `labs/bookmarks`, app `marks`. Reuse the login setup from the blog project.

## Models

```python
class Tag(models.Model):
    name = models.SlugField(max_length=40, unique=True)

    def __str__(self):
        return self.name

class Bookmark(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="bookmarks")
    title = models.CharField(max_length=200)
    url = models.URLField()
    tags = models.ManyToManyField(Tag, blank=True, related_name="bookmarks")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["owner", "url"], name="uniq_bookmark_url_per_owner"),
        ]
        ordering = ["-created_at"]
```

The unique constraint is the product rule: one user, one copy of a URL. Two users may save the same URL. Checking `exists()` in the view is a nicer error for the common case and still loses a race. Keep the constraint.

## Queryset

```python
def visible(user):
    return Bookmark.objects.filter(owner=user).prefetch_related("tags")

def search(user, query):
    qs = visible(user)
    query = query.strip()
    if query:
        qs = qs.filter(title__icontains=query)
    return qs
```

The view reads `request.GET.get("q", "")`. The template form is `method="get"` so a search is a link someone can refresh. Adding a bookmark stays POST.

Paginate after search, not before. `Paginator(search(request.user, query), 20)`.

## Tags without a second form's worth of pain

Accept a comma-separated string on the form, not the raw many-to-many widget.

```python
tags = forms.CharField(required=False)

def save(self, owner):
    bookmark = super().save(commit=False)
    bookmark.owner = owner
    bookmark.save()
    names = [part.strip().lower() for part in self.cleaned_data["tags"].split(",") if part.strip()]
    tag_objects = []
    for name in names:
        tag, _created = Tag.objects.get_or_create(name=slugify(name))
        tag_objects.append(tag)
    bookmark.tags.set(tag_objects)
    return bookmark
```

`get_or_create` plus the unique `name` is safe enough here. If two requests create the same tag, catch `IntegrityError` and `get` the row that won.

Always call `visible(request.user)` for list, detail, and delete. Delete is POST and `@require_POST`.

## Tests

- User A does not see user B's title in the list or in search.
- Saving the same URL twice for one user fails the second time.
- `?q=django` returns only matching titles for that user.
- A second page of results does not repeat the first page. Create 21 rows and request `?page=2`.

:::tip
`prefetch_related("tags")` before you paginate is correct: pagination slices the bookmark query, and prefetch runs for the bookmarks on that page, not for every bookmark the user owns.
:::

:::quiz
Why is the unique rule a database constraint and not only a view check?
+ Two requests can both pass exists() and both insert. The constraint lets only one succeed
- Django forms cannot see URLField
- Search requires a constraint
because: The check in the view is a friendly message. The constraint is the guarantee.
:::

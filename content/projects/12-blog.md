---
id: project-blog
track: project
level: Intermediate
module: Intermediate Django
title: Project — personal blog
minutes: 45
keywords: slug, login, author, pagination, project
summary: You write posts. Visitors read published ones. Drafts stay hidden. The author is the logged-in user, never a form field.
---

Create `labs/blog` with an app `posts`. This time include login the way the task board does: `LoginView`, `LogoutView`, `LOGIN_URL`, a POST logout form.

## Model

```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    body = models.TextField()
    published = models.BooleanField(default=False)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
```

`PROTECT` means you cannot delete a user who still has posts. That is the right accident to prevent on a blog.

`slug` is the URL, `/posts/hello-world/`, not the numeric id. Generate it from the title if the form leaves it blank:

```python
from django.utils.text import slugify

def clean_slug(self):
    slug = self.cleaned_data.get("slug") or slugify(self.cleaned_data.get("title", ""))
    if not slug:
        raise forms.ValidationError("Add a title that can become a URL.")
    return slug
```

The form fields are `title`, `slug`, `body`, `published`. Not `author`.

## Who can see what

```python
def published_posts():
    return Post.objects.filter(published=True).select_related("author")

@login_required
def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect(post_detail_url(post))
    else:
        form = PostForm()
    return render(request, "posts/form.html", {"form": form})
```

The public detail view uses `get_object_or_404(published_posts(), slug=slug)`. A draft returns 404 for everyone except a later edit view that filters `author=request.user`.

Paginate the index with `Paginator(published_posts(), 10)` and `paginator.get_page(request.GET.get("page"))`.

## Tests that define the product

1. Anonymous `GET` of the create page redirects to login.
2. A published post appears on the index. A draft does not.
3. Anonymous detail of a draft is 404.
4. The author of a created post is the logged-in user even if the POST body contains `author`.
5. Two posts cannot share a slug. The second save raises `IntegrityError` or the form shows an error. Catch it and add a form error if you want a friendly page.

:::watch
`Post.objects.get(slug=slug)` on the public page shows drafts to anyone who can guess the slug. The queryset is the permission. Login is a different check.
:::

:::try
Add an edit view. Only the author gets 200. Another logged-in user gets 404. A test creates two users and posts as the second against the first user's edit URL.
:::

:::solution
`get_object_or_404(Post, slug=slug, author=request.user)` then `PostForm(request.POST, instance=post)`. Do not look the post up without the author and then compare. The filter is the 404.
:::

:::quiz
Why is author missing from the form fields?
+ The browser would be allowed to submit someone else's id. The view sets the author from the session
- SlugField replaces ForeignKey
- Anonymous visitors need to pick an author
because: commit=False plus request.user is the server-side field. Hidden inputs are still user input.
:::

---
id: project-guestbook
track: project
level: Beginner
module: Beginner Django
title: Project — guestbook
minutes: 40
keywords: Model, Form, CSRF, template, project
summary: Visitors leave a name and a message. The page lists the latest notes. There is no login yet. That is the point of the next projects.
---

Create a new project next to the task board, not inside it.

```powershell
mkdir labs\guestbook
cd labs\guestbook
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install "Django>=6.1,<6.2"
django-admin startproject config .
python manage.py startapp notes
```

Add `"notes"` to `INSTALLED_APPS`.

## Model

```python
class Note(models.Model):
    author = models.CharField(max_length=80)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author}: {self.message[:40]}"
```

Anyone can type the author name. Say that in the page footer: "Names are not checked." The pro projects replace this with `request.user`.

## Form and view

```python
class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ["author", "message"]

    def clean_message(self):
        message = self.cleaned_data["message"].strip()
        if len(message) < 2:
            raise forms.ValidationError("Write a little more.")
        return message

def guestbook(request):
    if request.method == "POST":
        form = NoteForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("guestbook")
    else:
        form = NoteForm()
    notes = Note.objects.all()[:50]
    return render(request, "notes/guestbook.html", {"form": form, "notes": notes})
```

The redirect is Post/Redirect/Get. A refresh after a successful post must not insert a second note.

The template extends nothing yet. One file is enough:

```django
<form method="post">
  {% csrf_token %}
  {{ form.as_p }}
  <button type="submit">Sign</button>
</form>
{% for note in notes %}
  <article>
    <strong>{{ note.author }}</strong>
    <p>{{ note.message|linebreaksbr }}</p>
  </article>
{% empty %}
  <p>No notes yet.</p>
{% endfor %}
```

`{{ note.message }}` escapes HTML. Do not add `|safe`.

## Admin and a test

Register `Note` in `admin.py` with `list_display = ("author", "created_at")`.

```python
def test_post_creates_one_note(self):
    response = self.client.post(reverse("guestbook"), {"author": "Ada", "message": "Hello"})
    self.assertRedirects(response, reverse("guestbook"))
    self.assertEqual(Note.objects.count(), 1)
```

`Client` skips CSRF in tests. The template still needs the token for a real browser.

:::try
Reject messages longer than 500 characters in `clean_message`, and show the form error without saving.
:::

:::solution
After strip, if `len(message) > 500: raise forms.ValidationError("Keep it under 500 characters.")`. Add a test that posts 501 characters and asserts `Note.objects.count()` is still 0 and the response status is 200.
:::

:::quiz
Why redirect after a valid POST?
+ Refreshing the browser then loads the list with GET instead of submitting the note again
- Django forms only save during a redirect
- CSRF requires a 302
because: Post/Redirect/Get splits the write from the page the user can safely refresh.
:::

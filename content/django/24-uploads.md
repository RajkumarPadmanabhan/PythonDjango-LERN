---
id: uploads
track: django
level: Intermediate
module: Views, auth, and requests
title: Uploads and media
minutes: 12
keywords: FileField, ImageField, MEDIA_ROOT, upload, storage
summary: Uploads are untrusted bytes with a client-supplied name. Store them outside the code tree, validate them, and authorize downloads.
---

```python
avatar = models.ImageField(upload_to="avatars/", blank=True)
```

`upload_to` can be a callable `(instance, filename) -> str`. Use it to ignore the original name:

```python
import uuid
from pathlib import Path

def avatar_path(instance, filename):
    ext = Path(filename).suffix.lower()
    return f"avatars/{instance.pk}/{uuid.uuid4().hex}{ext}"
```

Settings:

```python
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
```

Serving media in development:

```python
from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

That helper is for `DEBUG`. In production, private files should be served by a view that checks permission and then uses `FileResponse`, or by a storage backend that issues a short-lived signed URL. A public bucket is public.

## Checks

- Limit size with `DATA_UPLOAD_MAX_MEMORY_SIZE` and a form validator.
- Allow an extension list you control. Do not trust `Content-Type` alone.
- `ImageField` verifies the file opens as an image, which is better than an extension check and still not a reason to process images with the same privileges as your database.
- Do not serve SVG uploads as images to other users. SVG can contain script.
- Virus-scanning is a product decision for public file hosts. The minimum bar is the list above.

`FileResponse(open(path, "rb"), as_attachment=True, filename="task.txt")` sets headers for a download. Use a path you computed, never a path joined directly to `request.GET["file"]`. That join is a path traversal bug (`../../etc/passwd` or a file outside `MEDIA_ROOT`).

:::quiz
Why not use the uploaded filename as the storage path?
+ The client controls it, so it can contain path segments or collide with another user
- Django rejects original names
- Filenames are not Unicode
because: Treat the original name as a label at most. Generate the stored name yourself.
:::

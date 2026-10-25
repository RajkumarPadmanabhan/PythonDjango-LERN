---
id: rest-framework
track: django
level: Advanced
module: Advanced Django
title: Django REST framework
minutes: 18
keywords: serializer, ViewSet, router, APIView, permission, token
summary: DRF turns querysets and models into JSON and back. It is a third-party package with the same security duties as a template view.
---

Django does not include DRF. Install it when you have a real API client. A few JSON endpoints can be `JsonResponse` and a form-shaped parser. DRF earns its place when you have resources, validation, and authentication to keep consistent.

```powershell
python -m pip install djangorestframework
```

```python
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}
```

Session authentication is right for a first-party frontend that already has the Django session, and it enforces CSRF. Token and JWT schemes are for non-browser clients. Do not invent a token header that is just the user id.

## Serializers

```python
from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ["id", "title", "detail", "done", "created_at"]
        read_only_fields = ["id", "created_at"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
```

`read_only_fields` is the API version of "the client does not send the owner." Set the owner in `create` or in `perform_create` on the viewset.

## Viewsets and routers

```python
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
```

`ModelViewSet` gives list, retrieve, create, update, partial_update, and destroy. If the product does not delete, do not use a viewset that deletes. Use `ReadOnlyModelViewSet` or a `GenericAPIView` with the mixins you mean.

Routers generate the URLs. Filtering the queryset is still your job. A viewset with `queryset = Task.objects.all()` publishes every user's tasks to every authenticated user.

## Status codes

Return `400` with the serializer errors for bad input. DRF does this when you call `is_valid(raise_exception=True)` or use a viewset. `401` means unauthenticated. `403` means authenticated and forbidden. `204` is a delete with no body.

Pagination is not optional on a list that can grow. Page number pagination is the default above. Cursor pagination is kinder to large, changing tables.

:::watch
`serializer.save()` without passing `owner`, on a serializer that marks `owner` read-only, raises an integrity error. On a serializer that does not, it trusts the client. Look at `fields` every time you add one.
:::

:::quiz
Why filter get_queryset on a viewset?
+ The default queryset is every row the model has, and authentication is not ownership
- Routers filter by the logged-in user automatically
- Serializers reject other users' rows
because: Permissions answer "may this user use this endpoint?" The queryset answers "which rows?"
:::

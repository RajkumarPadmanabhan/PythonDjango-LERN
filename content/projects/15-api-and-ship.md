---
id: project-api-and-ship
track: project
level: Pro
module: Professional Django
title: Project — API and ship checklist
minutes: 45
keywords: DRF, serializer, test, deploy, project
summary: Add a JSON API to the team workspace, then walk the same app through a production checklist. The API uses the same queryset as the HTML.
---

Do this on the workspace project, after the membership tests are green. An API that has its own copy of the permission rules will drift. Call `projects_for(request.user)` from both the template view and the API.

## Serializer

Install Django REST framework in that project's environment only.

```python
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "created_at"]
        read_only_fields = ["id", "created_at"]

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return projects_for(self.request.user)

    def perform_create(self, serializer):
        team = get_object_or_404(teams_for(self.request.user), pk=self.request.data.get("team"))
        serializer.save(team=team)
```

`team` is not a writable field on the serializer in this version. You resolve it in `perform_create` from a team the user belongs to. If you put `team` in `fields` without that check, anyone can post another team's id.

Destroy and update must use `get_queryset`, which DRF does. Do not override `get_object` with `Project.objects.get(pk=pk)`.

Pagination: set `PAGE_SIZE` to 20 in `REST_FRAMEWORK`. A list with no page size becomes a problem the day a team has thousands of rows.

## API tests

Use `rest_framework.test.APIClient`.

- Anonymous list is 401 or 403, whichever your authentication classes produce. Session auth often returns 403. Assert the one you configured.
- A member lists only their team's projects.
- Creating with another team's id returns 404 and does not insert.
- A patch from a non-member returns 404 and the name is unchanged.

## Ship checklist

Walk this list on the workspace project before you would point a hostname at it. Check the box in a `SHIP.md` file in that project. The file is part of the project.

| Check | What "done" looks like |
| --- | --- |
| Secrets | `SECRET_KEY` comes from the environment when `DEBUG` is off. It is not in git |
| Hosts | `ALLOWED_HOSTS` is the real hostname, not `*` |
| Debug | `DEBUG` is off. `manage.py check --deploy` has been read |
| Database | PostgreSQL in production. SQLite stays a local convenience. Migrations are committed |
| Static | `collectstatic` runs in the release. WhiteNoise or the proxy serves `STATIC_ROOT` |
| HTTPS | `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE`, and `SECURE_SSL_REDIRECT` are on behind the proxy |
| Media | Uploads, if you add them later, are not in the static folder and are not world-readable by accident |
| Logs | Errors go to stdout. Passwords and session cookies do not |
| Workers | gunicorn or a platform process, not `runserver` |
| Release order | Migrate, then collect static, then restart the app |
| Rollback | You know the previous git revision and whether its migrations can stay while you roll code back |

## A slice you can finish this week

You do not need a cloud account to finish the project. `check --deploy` with `DEBUG` temporarily false, a `SHIP.md` that records each warning, API tests green, and HTML tests still green is the pro bar for this course. Renting a server is optional and comes after the checklist is honest.

:::tip
When an API test fails open — it can see another team's name — fix `get_queryset` first. Do not add a second filter in the serializer. One door.
:::

:::quiz
Which queryset should the API use?
+ The same projects_for(user) the HTML views use
- Project.objects.all(), with a comment that the serializer is safe
- A copy of the filter typed again inside the viewset
because: Two copies of a rule become one copy the next time only one of them is updated. Call the function.
:::

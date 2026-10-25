---
id: project-team-workspace
track: project
level: Pro
module: Professional Django
title: Project — team workspace
minutes: 55
keywords: membership, role, permission, transaction, project
summary: People belong to teams. A team owns projects. A member sees the team. A stranger gets 404. Roles decide who can invite.
---

This is the pro shape behind most SaaS apps. Build it as `labs/workspace`, app `teams`. Keep the features small so the rules stay visible.

## The nouns

| Model | Fields that matter |
| --- | --- |
| `Team` | `name`, `slug` unique |
| `Membership` | `team`, `user`, `role` (`owner` or `member`), unique together on team and user |
| `Project` | `team`, `name`, `created_at` |

```python
class Membership(models.Model):
    class Role(models.TextChoices):
        OWNER = "owner", "Owner"
        MEMBER = "member", "Member"

    team = models.ForeignKey(Team, related_name="memberships", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="memberships", on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["team", "user"], name="uniq_member_per_team"),
        ]
```

Creating a team and the owner's membership is one transaction. If the membership insert fails, the team should not remain ownerless.

```python
with transaction.atomic():
    team = Team.objects.create(name=name, slug=slug)
    Membership.objects.create(team=team, user=request.user, role=Membership.Role.OWNER)
```

## The only queryset you use for projects

```python
def teams_for(user):
    return Team.objects.filter(memberships__user=user)

def projects_for(user):
    return Project.objects.filter(team__memberships__user=user).select_related("team")
```

Detail views:

```python
project = get_object_or_404(projects_for(request.user), pk=pk)
```

A logged-in non-member and an anonymous user do not get different leaks. Anonymous users hit `login_required` first. Non-members get 404, not 403, so the URL does not confirm that the project exists. Write that choice down in the spec. 403 is also defensible when the name is already public. Pick one and test it.

## Invites

Only an owner can add a member. The view loads the team through `teams_for(request.user)` and then checks the role:

```python
membership = get_object_or_404(Membership, team=team, user=request.user)
if membership.role != Membership.Role.OWNER:
    raise PermissionDenied
```

Here 403 is right: the person knows the team, because they are on it, and they are not allowed to invite. Do not take the role from the POST body.

Look up the invitee with `User.objects.get(username=...)` inside the transaction and `get_or_create` the membership. A duplicate hits the unique constraint. Catch `IntegrityError` and show "Already on the team."

## Tests that make it pro

1. A member of team A does not see team B's project.
2. A member cannot invite. An owner can.
3. Creating a team leaves exactly one owner membership, and it is the creator.
4. Two owners cannot be created by posting `role=owner` as a member.
5. `assertNumQueries` on the project list stays flat when you add a second project. That means `select_related` is doing its job.

## What you leave out on purpose

Billing, email invites, and audit logs are real and are separate projects. A role string and a queryset filter are the core. Add email only after the tests above are green. Send the email in `transaction.on_commit`, or a failed invite will still notify someone.

:::watch
`Project.objects.all()` in one view "just for the admin report" is how the isolation bug returns. Staff reports belong in the Django admin, behind `is_staff`, or in a queryset that is obviously unscoped and named `projects_for_staff`.
:::

:::quiz
When should a non-member get 404 instead of 403?
+ When knowing that the row exists is itself private
- Never. 403 is always more correct
- When the user is anonymous
because: 403 admits the object is there. 404 does not. Members who lack a role still get 403, because they already know the team.
:::

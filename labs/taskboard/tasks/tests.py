from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Task


class TaskListTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user("ada", password="long-passphrase")
        self.other = user_model.objects.create_user("grace", password="long-passphrase")
        self.task = Task.objects.create(title="Write", owner=self.user)
        self.other_task = Task.objects.create(title="Secret", owner=self.other)

    def test_requires_login(self):
        response = self.client.get(reverse("task-list"))
        self.assertEqual(response.status_code, 302)
        self.assertIn("/accounts/login/", response.url)

    def test_shows_only_own_tasks(self):
        self.client.force_login(self.user)
        response = self.client.get(reverse("task-list"))
        self.assertContains(response, "Write")
        self.assertNotContains(response, "Secret")

    def test_cannot_toggle_someone_elses_task(self):
        self.client.force_login(self.user)
        response = self.client.post(reverse("task-toggle", args=[self.other_task.pk]))
        self.assertEqual(response.status_code, 404)
        self.other_task.refresh_from_db()
        self.assertFalse(self.other_task.done)

    def test_owner_can_toggle(self):
        self.client.force_login(self.user)
        response = self.client.post(reverse("task-toggle", args=[self.task.pk]))
        self.assertRedirects(response, reverse("task-list"))
        self.task.refresh_from_db()
        self.assertTrue(self.task.done)

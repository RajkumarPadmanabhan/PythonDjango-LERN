from django.urls import path

from . import views

urlpatterns = [
    path("", views.task_list, name="task-list"),
    path("tasks/<int:pk>/toggle/", views.toggle_task, name="task-toggle"),
    path("tasks/<int:pk>/delete/", views.delete_task, name="task-delete"),
]

from django.urls import path
from . import views

urlpatterns = [
    path('test-task-backend/v2/', views.TaskListGet.as_view() ),
    path('test-task-backend/v2/login', views.login),
    path('test-task-backend/v2/create', views.TaskListCreate.as_view() ),
    path('test-task-backend/v2/edit/:<int:task_id>', views.edit_task),
]
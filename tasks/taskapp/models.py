from django.contrib.auth.models import User
from django.core.validators import EmailValidator
from django.db import models
from django.conf import settings

# Create your models here.

class TaskStatus(models.IntegerChoices):
    NOTDONE = (0,'not done')
    NOTDONEEDITED  =(1, 'not done. edited by admin')
    DONE = (10, 'ok')
    DONEEDITED = (11, 'ok. edited by admin')

class Task(models.Model):
#    id = models.UUIDField(primary_key=True, editable=False,auto_created=True)
    text = models.CharField(max_length=100,blank=False)
    status = models.IntegerField(editable=True,
    choices = TaskStatus.choices, default=0)
    username = models.CharField(max_length=100,blank=False)
    email = models.CharField(max_length=100,blank=False)

class Token(models.Model):
    token = models.UUIDField()
    expires = models.DateTimeField(blank=False)
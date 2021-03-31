from rest_framework import serializers
from rest_framework.fields import HiddenField
from .models import Task
import django.core.validators

class TaskSerializer(serializers.ModelSerializer):
    email = serializers.CharField()
    username = serializers.CharField()
    text = serializers.CharField()

    def validate_email(self,value):
        try:
            django.core.validators.validate_email(value)
        except Exception as ex:
            raise serializers.ValidationError(ex)
        return value        


    class Meta:
        model = Task
        depth = 1
        fields = (
            'id', 'email', 'username', 'text', 'status'
        )

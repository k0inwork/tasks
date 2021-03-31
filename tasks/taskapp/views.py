from io import SEEK_SET
from django.contrib.auth import authenticate, login as log
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from .models import Task,Token
from .serializers import TaskSerializer
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
import logging

import uuid

from datetime import timedelta
from django.utils import timezone

@api_view(['POST'])
def login(request):
    response={'status':'error','message':'Wrong credentials'}
    login = request.data.get('username')
    passw = request.data.get('password')
    if login and passw:
        logging.error("LOGIN:"+login+passw)
#        user = authenticate(request, username=login, password=passw)
        if login=="admin" and passw=="123":
            t = Token()
            t.expires = timezone.now()+timedelta(days=1)
            t.token = uuid.uuid4()
            t.save()
            response={'status':'ok','token':t.token}
    return Response(response)


@api_view(['POST'])
def edit_task(request,task_id):
    id = task_id

    token = request.data.get('token')
    if token is None:
        raise APIException('No token provided')

    t = Token.objects.get(token=token)
    if t is None:
        raise APIException('No valid token provided')
    if t.expires < timezone.now():
        raise APIException('Expired token provided. Re-login.')


    id = task_id
    task = Task.objects.get(id=id)
    if task is None:
        response = {'status':'error','message':'Wrong id({0}) provided'.format(id)}

    text = request.data.get('text')
    status = request.data.get('status')

    if status:
        task.status = status
    if text:
        if task.text != text:
            task.text = text
            task.status = int(int(task.status)/10)*10+1
    
    task.save()

    response = {'status':'ok'}

    return Response(response)

class TaskListCreate(generics.ListCreateAPIView):
    queryset=Task.objects.all()
    serializer_class = TaskSerializer
    def perform_create(self, serializer):
        developer = self.request.data.get('developer')
        if not developer:
            raise APIException('no developer')
        super().perform_create(serializer)

    def post(self, request):

        response = super().post(request)
        resp = {'status':'ok','message':response.data}
        response.data = resp
        return response

class ThreePagination(PageNumberPagination):
    page_size=3
    def get_paginated_response(self, data):
        return Response({
            'status':'ok',
            'total_task_count': self.page.paginator.count,
            'current':self.page.number,
            'message': {
                'tasks':data
            } 
        })
class TaskListGet(generics.ListAPIView):

    serializer_class = TaskSerializer
    pagination_class = ThreePagination
    
    def get_queryset(self):

        # #testing
        # import time
        # time.sleep(10)

        request = self.request
        developer =request.query_params.get('developer')
        if not developer:
            raise APIException('no developer')

        sort_field = request.query_params.get('sort_field')
        sort_direction = request.query_params.get('sort_direction')
        
        if sort_field:
            if sort_field in ['id','text','username','email','status']:
                if not sort_direction:
                    sort_direction = 'asc'
                if sort_direction in ['asc','desc']:
                    if sort_direction=='asc':
                        queryset = Task.objects.order_by(sort_field)
                    else:
                        queryset = Task.objects.order_by('-'+sort_field)
                else:
                    raise APIException('Wrong sort direction')
            else:
                raise APIException('Wrong sort column')
        else:
            queryset = Task.objects.all()
        
        return queryset
 

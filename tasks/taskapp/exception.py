from rest_framework.response import Response
from typing import Dict
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)


    if response is None:
        return Response({'status':'error', 'message':'unknown error'})
    # Now add the HTTP status code to the response.
    if response is not None:
        if response.data.get('detail'):
            response.data['message'] = response.data['detail']
            response.data.pop('detail')
        else:
            if response.data.keys():
                k = dict()
                for i in response.data.keys():
                    k[i]=response.data[i]
                response.data.clear()
                response.data['message']=k
        response.data['status'] = 'error'

    return response
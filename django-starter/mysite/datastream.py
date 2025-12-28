from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpRequest
from django.db import connection
import json
import time
from django.http import StreamingHttpResponse
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def set(request:HttpRequest):
    with connection.cursor() as cursor:
        for key in request.GET.keys():
            cursor.execute("UPDATE datastreams_streams SET value = %s, isUpdated = 1, updatedOn = now() WHERE stream_key = %s", [request.GET.get(key), key])
    return JsonResponse({ "status": "ok" })

def get(request:HttpRequest, pin:str):
    with connection.cursor() as cursor:
        cursor.execute("SELECT * from datastreams_streams WHERE stream_key = %s", [pin])
        row = cursor.fetchall()[0]
        cursor.execute("UPDATE datastreams_streams SET isUpdated = 0 WHERE stream_key = %s", [pin])

        return JsonResponse({
            "id": row[0], 
            "title": row[1],
            "stream_key": row[2],
            "value": row[3],
            "isUpdated": row[5]
            })
    return HttpResponse("NA")   

def onButtonPressed(request:HttpRequest, device_id:str):
    pin:str = request.GET.get("pin")
    value:int = int(request.GET.get("value"))
    channel_layer = get_channel_layer()
    
    with connection.cursor() as cursor:
        for key in request.GET.keys():
            cursor.execute("UPDATE datastreams_streams SET value = %s, isUpdated = 1, updatedOn = now() WHERE stream_key = %s", [value, pin])
    
    async_to_sync(channel_layer.group_send)(
        f"device_{device_id}",
        {
            "type": "push_pin",
            "pin": pin,
            "value": value
        }
    )
    return JsonResponse({ "status": "ok" });
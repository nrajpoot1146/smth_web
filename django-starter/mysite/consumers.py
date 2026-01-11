# app/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import json

from django.db import connection

class DeviceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.device_id = self.scope["url_route"]["kwargs"]["device_id"]
        self.group_name = f"device_{self.device_id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await sync_to_async(self.mark_active)()
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        await sync_to_async(self.mark_inactive)()

    async def receive(self, text_data):
        # Optional: handle device messages
        device_id = "smth_web"
        print(text_data)
        try:
            data:dict = json.loads(text_data)
            if data["e"] == 3:
                sensordata:dict = data["d"]
                await sync_to_async(self.saveData)(sensordata)
        except Exception as e:
            print(e)
            pass
        
        pass

    async def send_to_web(self, event):
        await self.send(text_data=event["data"])

    async def push_pin(self, event):
        await self.send(text_data=json.dumps({
            "pin": event["pin"],
            "value": event["value"]
        }))

    def saveData(self, data):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE datastreams_streams SET value = %s, isUpdated = 1, updatedOn = now() WHERE stream_key = %s", [data["v"], data["p"]])

    def mark_inactive(self):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE devices SET is_active = 0 WHERE device_id = %s", [self.device_id])
    
    def mark_active(self):
        with connection.cursor() as cursor:
            cursor.execute("UPDATE devices SET is_active = 1 WHERE device_id = %s", [self.device_id])

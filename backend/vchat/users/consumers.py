import json
from urllib.parse import parse_qs
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Message
from .serializers import MessageSerializer
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope["query_string"].decode()
        token = parse_qs(query_string).get("token")
        if token:
            try:
                access_token = AccessToken(token[0])
                user_id = access_token["user_id"]
                self.scope["user"] = await sync_to_async(User.objects.get)(id=user_id)
            except:
                await self.close()
                return

        self.sender_id = int(self.scope["user"].id)
        self.receiver_id = int(self.scope["url_route"]["kwargs"]["receiver_id"])

        print(
            f"this is the sender id {self.sender_id} and this is the receiver_id : {self.receiver_id}"
        )

        self.room_name = f"chat_{min(self.sender_id, self.receiver_id)}_{max(self.sender_id, self.receiver_id)}"
        self.room_group_name = f"chat_{self.room_name}"

        print(f"Connecting to room group: {self.room_group_name}")

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()
        print(f"WebSocket connected: {self.channel_name}")

    async def disconnect(self, code):
        print(f"WebSocket disconnecting: {self.channel_name}, close_code: {code}")
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

        print(f"WebSocket disconnected: {self.channel_name}")

    async def receive(self, text_data=None):
        print("received")
        print(text_data)
        data = json.loads(text_data)
        message = data["message"]
        sender_id = data["sender"]
        receiver_id = data["receiver"]
        
        if not sender_id or not receiver_id or not message:
            print("The receiver args is not enough.")
            return

        message_obj = await self.save_message(sender_id, receiver_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message_obj["message"],
                "sender": message_obj["sender"],
                "receiver": message_obj["receiver"],
                "timestamp": message_obj["timestamp"],
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, sender_id, receiver_id, message):
        sender = User.objects.get(id=sender_id)
        receiver = User.objects.get(id=receiver_id)

        msg = Message.objects.create(sender=sender, receiver=receiver, message=message)
        serializer = MessageSerializer(msg)
        return serializer.data

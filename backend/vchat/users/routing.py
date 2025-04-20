from django.urls import path
from .consumers import ChatConsumer

websocket_urlpattern = [
    path('ws/chat/<int:receiver_id>/', ChatConsumer.as_asgi()),
]
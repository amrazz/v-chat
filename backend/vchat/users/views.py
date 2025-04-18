from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import *
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserDetailSerializer,
    UserLoginSerializer,
    UserRegisterSerializers,
)

# Create your views here.

User = get_user_model()


class UserRegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializers


class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]
            refresh_token = RefreshToken.for_user(user)
            user_serializer = UserDetailSerializer(user)
            return Response(
                {
                    "message": "User Login SuccessFull",
                    "access": str(refresh_token.access_token),
                    "refresh": str(refresh_token),
                    "user": user_serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

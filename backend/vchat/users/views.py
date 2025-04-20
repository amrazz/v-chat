from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import *
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import (
    MessageSerializer,
    UserDetailSerializer,
    UserLoginSerializer,
    UserRegisterSerializers,
)
from .models import Message

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
            user.is_online = True
            user.save()
            refresh_token = RefreshToken.for_user(user)
            user_serializer = UserDetailSerializer(user)
            return Response(
                {
                    "login": True,
                    "access": str(refresh_token.access_token),
                    "refresh": str(refresh_token),
                    "user": user_serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            print("refreh token" ,refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            print("Token blacklisted..")

            user = User.objects.get(id=request.user.id)
            if user:
                user.is_online = False
                user.save()

            return Response(
                {"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT
            )
        except KeyError:
            return Response(
                {"error": "Refresh token not provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except TokenError as e:
            print(str(e))
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ListUserView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailSerializer

    def get_queryset(self):
        return User.objects.exclude(id=self.request.user.id).order_by(
            "first_name", "last_name"
        )


class UserMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            receiver = User.objects.get(id=user_id)
            sender = User.objects.get(id=request.user.id)
            message = (
                Message.objects.filter(sender=sender, receiver=receiver)
                | Message.objects.filter(sender=receiver, receiver=sender)
            ).order_by("timestamp")
            serializer = MessageSerializer(message, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
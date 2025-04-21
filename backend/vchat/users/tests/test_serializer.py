from django.test import TestCase
from users.serializers import *
from users.models import CustomUser, Message
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()


class UserRegisterSerializerTest(TestCase):

    def test_duplicate_username_registration(self):
        data = {
            "username": "newuser",
            "first_name": "New",
            "last_name": "User",
            "password": "StrongPassword@123",
            "password2": "StrongPassword@123",
        }

        serializer = UserRegisterSerializers(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()

        serializer = UserRegisterSerializers(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)


    def test_password_mismatch(self):
        data = {
            "username": "newuser",
            "first_name": "New",
            "last_name": "User",
            "password": "StrongPassword@123",
            "password2": "StrongPassword@123",
        }

        serializer = UserRegisterSerializers(data=data)
        self.assertTrue(serializer.is_valid())
        serializer.save()


class UserLoginSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword123"
        )

    def test_valid_login(self):
        data = {"username": "testuser", "password": "testpassword123"}

        serializer = UserLoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data["user"], self.user)

    def test_invalid_username(self):
        data = {"username": "nonexistentuser", "password": "testpassword123"}

        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("username", serializer.errors)

    def test_invalid_password(self):
        data = {"username": "testuser", "password": "wrongpassword"}

        serializer = UserLoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)


class UserDetailSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            first_name="Test",
            last_name="User",
            password="testpassword123",
            is_online=True,
        )

    def test_user_detail_serialization(self):
        serializer = UserDetailSerializer(self.user)

        expected_data = {
            "id": self.user.id,
            "username": "testuser",
            "first_name": "Test",
            "last_name": "User",
            "profile_img": None,
            "is_online": True,
        }

        self.assertEqual(serializer.data, expected_data)


class MessageSerializerTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="sender", password="password123")
        self.user2 = User.objects.create_user(
            username="receiver", password="password123"
        )
        self.message = Message.objects.create(
            sender=self.user1, receiver=self.user2, message="Test message content"
        )

    def test_message_serialization(self):
        serializer = MessageSerializer(self.message)
        self.assertEqual(serializer.data["sender"], self.user1.id)
        self.assertEqual(serializer.data["receiver"], self.user2.id)
        self.assertEqual(serializer.data["message"], "Test message content")
        self.assertIn("timestamp", serializer.data)

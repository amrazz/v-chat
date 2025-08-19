from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import CustomUser, Message
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UserRegisterViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse("register")

    def test_user_registration(self):
        data = {
            "username": "newuser",
            "first_name": "New",
            "last_name": "User",
            "password": "StrongPassword123!",
            "password2": "StrongPassword123!",
        }

        response = self.client.post(self.register_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="newuser").exists())


class UserLoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse("login")
        self.user = User.objects.create_user(
            username="testuser", password="testpassword123"
        )

    def test_user_login(self):
        data = {"username": "testuser", "password": "testpassword123"}

        response = self.client.post(self.login_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["login"])
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("user", response.data)

        # Check that the user is now online
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_online)


class UserLogoutViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.logout_url = reverse("logout")
        self.user = User.objects.create_user(
            username="testuser", password="testpassword123", is_online=True
        )
        self.refresh_token = RefreshToken.for_user(self.user)
        self.client.force_authenticate(user=self.user)

    def test_user_logout(self):
        data = {"refresh": str(self.refresh_token)}

        response = self.client.post(self.logout_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

        self.user.refresh_from_db()
        self.assertFalse(self.user.is_online)

    def test_logout_without_token(self):
        response = self.client.post(self.logout_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)


class ListUserViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.list_user_url = reverse("list")

        # Create main user and several other users
        self.main_user = User.objects.create_user(
            username="mainuser", password="password123"
        )
        self.user1 = User.objects.create_user(
            username="user1", first_name="First", last_name="User"
        )
        self.user2 = User.objects.create_user(
            username="user2", first_name="Second", last_name="User"
        )

        self.client.force_authenticate(user=self.main_user)

    def test_list_users(self):
        response = self.client.get(self.list_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the main user is not in the response
        user_ids = [user["id"] for user in response.data]
        self.assertNotIn(self.main_user.id, user_ids)

        # Check that other users are in the response
        self.assertIn(self.user1.id, user_ids)
        self.assertIn(self.user2.id, user_ids)


class UserMessageViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create users
        self.user1 = User.objects.create_user(username="user1", password="password123")
        self.user2 = User.objects.create_user(username="user2", password="password123")

        # Create messages
        self.message1 = Message.objects.create(
            sender=self.user1,
            receiver=self.user2,
            message="Message from user1 to user2",
        )
        self.message2 = Message.objects.create(
            sender=self.user2, receiver=self.user1, message="Reply from user2 to user1"
        )

        self.client.force_authenticate(user=self.user1)
        self.message_url = reverse("user-message", kwargs={"user_id": self.user2.id})

    def test_get_messages(self):
        response = self.client.get(self.message_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        # Check that messages are ordered by timestamp
        self.assertEqual(response.data[0]["message"], "Message from user1 to user2")
        self.assertEqual(response.data[1]["message"], "Reply from user2 to user1")

    def test_get_messages_nonexistent_user(self):
        nonexistent_user_url = reverse("user-message", kwargs={"user_id": 9999})
        response = self.client.get(nonexistent_user_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserUpdateViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.update_url = reverse("get-update-user")
        self.user = User.objects.create_user(
            username="testuser",
            first_name="Test",
            last_name="User",
            password="testpassword123",
        )
        self.client.force_authenticate(user=self.user)

    def test_update_profile(self):
        data = {"first_name": "Updated", "last_name": "Name"}

        response = self.client.put(self.update_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check that the user details were updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Updated")
        self.assertEqual(self.user.last_name, "Name")

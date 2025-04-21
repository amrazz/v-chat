from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from users.models import Message
import tempfile
from PIL import Image
import io
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            first_name='Test',
            last_name='User',
            password='testpassword123'
        )
        
    def test_custom_user_creation(self):
        self.assertEqual(self.user.username, 'testuser')
        self.assertEqual(self.user.first_name, 'Test')
        self.assertEqual(self.user.last_name, 'User')
        self.assertFalse(self.user.is_online)
        
    
class MessageModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='sender',
            password='Password123'
        )
        self.user2 = User.objects.create_user(
            username='receiver',
            password='Password123'
        )
        
    def test_message_creation(self):
        message = Message.objects.create(
            sender = self.user1,
            receiver = self.user2,
            message = "Hello, This is a test message."
        )
        self.assertEqual(message.sender, self.user1)
        self.assertEqual(message.receiver, self.user2)
        self.assertEqual(message.message,"Hello, This is a test message.")
        self.assertIsNotNone(message.timestamp)
        
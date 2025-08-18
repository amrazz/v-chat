from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.core.exceptions import ValidationError

# Create your models here.


def validate_image_size(image):
    image_size = image.size
    image_size_limit = 5.0
    if image_size > image_size_limit * 1024 * 1024:
        raise ValidationError(f"Max file size is {image_size_limit}MB")


class CustomUser(AbstractUser):
    profile_img = models.ImageField(
        upload_to="profile_images/",
        validators=[
            FileExtensionValidator(allowed_extensions=["jpg", "jpeg", "png"]),
            validate_image_size,
        ],
        null=True,
        blank=True,
    )
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Message(models.Model):
    sender = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="send_messages"
    )
    receiver = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="received_messages"
    )
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f"{self.sender.username} to {self.receiver.username}: {self.message[:10]}"
        )
        
    class Meta:
        indexes = [
            models.Index(fields=["sender", "receiver", "-timestamp"]),
            models.Index(fields=["receiver", "sender", "-timestamp"]),
        ]

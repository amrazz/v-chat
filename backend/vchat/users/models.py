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
    bio = models.TextField(blank=True, null=True)
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

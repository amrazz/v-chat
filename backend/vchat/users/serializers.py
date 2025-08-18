import re
from rest_framework import serializers
from .models import CustomUser as User, Message
from django.db.models import Q
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password


User = get_user_model()


class UserRegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "password", "password2"]

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Username is required.")

        if len(value) < 5:
            raise serializers.ValidationError("Username must be at least 5 characters.")
        if not re.match(r"^(?![_\s])[A-Za-z0-9_]+$", value):
            raise serializers.ValidationError("Invalid username format.")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")

        return value

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("First name is required.")
        if not value.isalpha():
            raise serializers.ValidationError("First name must contain only letters.")
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Last name is required.")
        if not value.isalpha():
            raise serializers.ValidationError("Last name must contain only letters.")
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        validated_data.pop("password2")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        return user


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        if not username or not password:
            raise serializers.ValidationError("Username and password are required")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        attrs["user"] = user
        return attrs


class UserDetailSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    last_message_time = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "profile_img",
            "is_online",
            "last_message",
            "last_message_time",
        )

    def get_last_message(self, obj):
        user = self.context["request"].user
        msg = (
            Message.objects.filter(
                Q(sender=user, receiver=obj) | Q(sender=obj, receiver=user)
            )
            .order_by("-timestamp")
            .first()
        )
        return msg.message if msg else ""

    def get_last_message_time(self, obj):
        user = self.context["request"].user
        msg = (
            Message.objects.filter(
                Q(sender=user, receiver=obj) | Q(sender=obj, receiver=user)
            )
            .order_by("-timestamp")
            .first()
        )
        return msg.timestamp.isoformat() if msg else ""


class ReadUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "profile_img",
            "is_online",
        )


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"

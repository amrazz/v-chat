from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import *
from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


# Create your views here.

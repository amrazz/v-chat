from django.urls import path
from .views import *

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("list/", ListUserView.as_view(), name="list"),
    path("me/", ReadUpdateUserView.as_view(), name="get-update-user"),
    path("messages/<int:user_id>/", UserMessageView.as_view(), name="user-message"),
]

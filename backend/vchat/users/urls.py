from django.urls import path
from .views import *

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    path("list-user/", ListUserView.as_view(), name="list-user"),
    path("read-update-user/", ReadUpdateUserView.as_view(), name="get-update-user"),
    path("user-message/<int:user_id>/", UserMessageView.as_view(), name="user-message"),
]

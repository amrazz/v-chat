from django.urls import path
from .views import ListUserView, UserLoginView, UserLogoutView, UserMessageView, UserRegisterView, UserUpdateView

urlpatterns = [
    path("register/", UserRegisterView.as_view(), name="register"),
    path("login/", UserLoginView.as_view(), name="login"),
    path('update-profile/', UserUpdateView.as_view(), name='update-profile'),
    path("logout/", UserLogoutView.as_view(), name="logout"),
    
    path("list-user/", ListUserView.as_view(), name="list-user"),
    path("user-message/<int:user_id>/", UserMessageView.as_view(), name="user-message")
]

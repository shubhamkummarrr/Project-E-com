from django.urls import path, include
from ecom.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user-details', UserDetailViewSet, basename='user-details')


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path("productcard/", ProductCard, name="products"),
    path("product/<str:product_id>/", get_product_by_id, name="product-detail"),
    path("recommend/<str:product_id>/", product_recommendations),
    path("contact/", ContactMessageView.as_view(), name="contact"),
    path("purchase-history/", PurchaseHistoryView.as_view(), name="purchase-history"),
    path('', include(router.urls)),
]


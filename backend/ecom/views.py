from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from ecom.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserLoginSerializer, UserPasswordResetSerializer, UserProfileSerializer, UserRegistrationSerializer
from django.contrib.auth import authenticate
from ecom.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, filters
from .models import *
from .serializers import *
import pandas as pd
from rest_framework.decorators import api_view
from django.conf import settings
import os
import numpy as np
from ecom.recommender.recommender import recommend_products
from rest_framework.permissions import AllowAny






# Generate Token Manually
def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {
      'refresh': str(refresh),
      'access': str(refresh.access_token),
  }

class UserRegistrationView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    token = get_tokens_for_user(user)
    return Response({'token':token, 'msg':'Registration Successful'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.data.get('email')
    password = serializer.data.get('password')
    user = authenticate(email=email, password=password)
    if user is not None:
      token = get_tokens_for_user(user)
      return Response({'token':token, 'msg':'Login Success'}, status=status.HTTP_200_OK)
    else:
      return Response({'errors':{'non_field_errors':['Email or Password is not Valid']}}, status=status.HTTP_404_NOT_FOUND)

class UserProfileView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def get(self, request, format=None):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

class UserChangePasswordView(APIView):
  renderer_classes = [UserRenderer]
  permission_classes = [IsAuthenticated]
  def post(self, request, format=None):
    serializer = UserChangePasswordSerializer(data=request.data, context={'user':request.user})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)

class SendPasswordResetEmailView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, format=None):
    serializer = SendPasswordResetEmailSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)

class UserPasswordResetView(APIView):
  renderer_classes = [UserRenderer]
  def post(self, request, uid, token, format=None):
    serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token':token})
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)

class UserDetailViewSet(viewsets.ModelViewSet):
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserDetails.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            print("❌ SERIALIZER ERRORS:", serializer.errors)
            return Response(serializer.errors, status=400)

        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

class ContactMessageView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Save contact message
        Logged-in user → attach user
        Guest → save name & email only
        """
        data = request.data.copy()

        if request.user.is_authenticated:
            data["user"] = request.user.id
            data["email"] = request.user.email

        serializer = ContactMessageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Message sent successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PurchaseHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Save purchase history
        Frontend sends products JSON
        """
        serializer = PurchaseHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Purchase saved successfully"},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        """
        Get purchase history of logged-in user
        """
        history = PurchaseHistory.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = PurchaseHistorySerializer(history, many=True)
        return Response(serializer.data)



class ProductViewSet(viewsets.ModelViewSet):
    queryset         = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    filter_backends  = [filters.SearchFilter, filters.OrderingFilter]
    search_fields    = ['name','description','slug']
    ordering_fields  = ['price','created_at']
    ordering         = ['-created_at']


CSV_PATH = os.path.join(
    settings.BASE_DIR,
    "ecom",
    "amazon.csv"
)

@api_view(["GET"])
def ProductCard(request):
    # 1️⃣ Load CSV
    df = pd.read_csv(CSV_PATH)
    
    # 1️⃣ Remove any WEBP routing path (T1, T2, T3, etc.)
    df['img_link'] = df['img_link'].str.replace(
        r"/images/W/WEBP_[^/]+",
        "",
        regex=True
    )

    # 2️⃣ Remove FMwebp marker if present
    df['img_link'] = df['img_link'].str.replace(
        r"_FMwebp_",
        "_",
        regex=True
    )

    # 3️⃣ Ensure proper .jpg ending
    df['img_link'] = df['img_link'].str.replace(
        r"(?<!\.jpg)$",
        ".jpg",
        regex=True
    )


    # 3️⃣ Clean rating_count
    df['rating_count_clean'] = (
        pd.to_numeric(
            df['rating_count']
            .astype(str)
            .str.replace(",", "", regex=False),
            errors='coerce'
        )
        .fillna(0)
        .astype(int)
    )

    # 4️⃣ Clean prices
    df['discounted_price_clean'] = (
        pd.to_numeric(
            df['discounted_price']
            .astype(str)
            .str.replace("₹", "", regex=False)
            .str.replace(",", "", regex=False),
            errors='coerce'
        )
        .fillna(0)
    )
    
    df['categories'] = df['category'].str.split("|").apply(lambda x:x[0]).apply(lambda x:x.replace("&"," & "))

    # 5️⃣ TOP PRODUCTS (rating_count > 200k)
    top_products = (
        df[df['rating_count_clean'] > 200000]
        .sort_values(by=["rating", "rating_count_clean"], ascending=False)
        .head(20)
    )

    # 6️⃣ CATEGORY SECTIONS
    office_products = df[df['categories'] == "OfficeProducts"].head(20)
    home_kitchen = df[df['categories'] == "Home & Kitchen"].head(50)
    computers_accessories = df[df['categories'] == "Computers & Accessories"].head(50)
    electronics_products = df[df['categories'] == "Electronics"].head(50)

    # 7️⃣ JSON-safe (NaN → null)
    def safe(df_section):
        return df_section.replace({np.nan: None}).to_dict(orient="records")

    # 8️⃣ Final response
    return Response({
        "top_products": safe(top_products),
        "office_products": safe(office_products),
        "home_kitchen": safe(home_kitchen),
        "computers_accessories": safe(computers_accessories),
        "electronics_products": safe(electronics_products),
    })


@api_view(["GET"])
def get_product_by_id(request, product_id):
    df = pd.read_csv(CSV_PATH)
    
    df['img_link'] = df['img_link'].str.replace(
        r"/images/W/WEBP_[^/]+",
        "",
        regex=True
    )

    # 2️⃣ Remove FMwebp marker if present
    df['img_link'] = df['img_link'].str.replace(
        r"_FMwebp_",
        "_",
        regex=True
    )

    # 3️⃣ Ensure proper .jpg ending
    df['img_link'] = df['img_link'].str.replace(
        r"(?<!\.jpg)$",
        ".jpg",
        regex=True
    )


    product_df = df[df["product_id"] == product_id]

    if product_df.empty:
        return Response({"error": "Product not found"}, status=404)

    product = product_df.iloc[0].to_dict()

    return Response(product)

@api_view(["GET"])
def product_recommendations(request, product_id):

    top_n = int(request.GET.get("top_n", 20))
    data = recommend_products(product_id, top_n)
    return Response(data)

























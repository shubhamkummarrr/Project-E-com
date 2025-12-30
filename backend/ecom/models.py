from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser

#  Custom User Manager
class UserManager(BaseUserManager):
  def create_user(self, email, name, tc, password=None, password2=None):
        
      
      """
      Creates and saves a User with the given email, name, tc and password.
      """
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          name=name,
          tc=tc,
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, name, tc, password=None):
      """
      Creates and saves a superuser with the given email, name, tc and password.
      """
      user = self.create_user(
          email,
          password=password,
          name=name,
          tc=tc,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

#  Custom User Model
class User(AbstractBaseUser):
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  name = models.CharField(max_length=200)
  tc = models.BooleanField()
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['name', 'tc']

  def __str__(self):
      return self.email

  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"
      # Simplest possible answer: Yes, always
      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      # Simplest possible answer: Yes, always
      return True

  @property
  def is_staff(self):
      "Is the user a member of staff?"
      # Simplest possible answer: All admins are staff
      return self.is_admin



class Product(models.Model):
    name       = models.CharField(max_length=120)
    slug       = models.SlugField(unique=True)
    description= models.TextField(blank=True)
    price      = models.DecimalField(max_digits=10, decimal_places=2)
    in_stock   = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): return self.name


class UserDetails(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="details"
    )
    user_full_name = models.CharField(max_length=100)

    mobile_number = models.CharField(max_length=20)
    address_line = models.CharField(max_length=255)
    city = models.CharField(max_length=100)

    STATE_CHOICES = [
        ("Andhra Pradesh", "Andhra Pradesh"),
        ("Delhi", "Delhi"),
        ("Gujarat", "Gujarat"),
        ("Karnataka", "Karnataka"),
        ("Maharashtra", "Maharashtra"),
        ("Tamil Nadu", "Tamil Nadu"),
        ("Uttar Pradesh", "Uttar Pradesh"),
    ]

    state = models.CharField(
        max_length=50,
        choices=STATE_CHOICES,
        default="Maharashtra"
    )
# The `pincode` field in the `UserDetails` model is storing the postal code or ZIP code of the
# user's address. It is a CharField with a maximum length of 6 characters, indicating that it is
# designed to store the postal code as a string value.

    pincode = models.CharField(max_length=6)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"


class ContactMessage(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="contact_messages"
    )

    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.created_at}"


class PurchaseHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="purchase_history"
    )

    products = models.JSONField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    payment_id = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(
        max_length=50,
        default="SUCCESS"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.created_at}"

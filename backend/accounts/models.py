from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
	AbstractBaseUser,
	BaseUserManager,
)


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Usuários devem ter um endereço de e-mail.')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        
        # This handles the hashing automatically
        user.set_password(password)
        user.save(using=self._db)
        return user


class Group(models.Model):
	"""Grupo simples que contém permissões como lista de inteiros.

	O campo permissions usa JSONField e armazena uma lista de inteiros,
	por exemplo: [1, 2, 3].
	"""
	name = models.CharField(max_length=150, unique=True)
	permissions = models.JSONField(default=list, blank=True)

	def __str__(self):
		return self.name


class User(AbstractBaseUser):
	"""Modelo de usuário para autenticação.
	"""
	id = models.BigAutoField(primary_key=True)
	username = models.CharField(max_length=150, unique=True)
	email = models.EmailField(unique=True)
	group = models.ForeignKey(Group, null=True, blank=True, on_delete=models.SET_NULL, related_name='users')

	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = ['email']

	def __str__(self):
		return self.username


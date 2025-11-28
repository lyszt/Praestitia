from django.contrib import admin
from .models import User, Group


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'group')
    search_fields = ('username', 'email')
    ordering = ('username',)
    fields = ('username', 'email', 'password', 'group')


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'permissions')
    fields = ('name', 'permissions')

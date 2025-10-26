from peewee import Model, CharField, DateTimeField
from datetime import datetime, timezone
from typing import Any, Dict

from models.db import database


class BaseModel(Model):
    class Meta:
        database = database


class User(BaseModel):
    """Model do usuário.

    Campos:
    - username: único, até 150 chars
    - password: hash da senha
    - email: opcional
    - created_at: timestamp UTC
    """

    username = CharField(unique=True, max_length=150)
    password = CharField(max_length=255)
    email = CharField(null=True, max_length=255)
    created_at = DateTimeField(default=lambda: datetime.now(timezone.utc))

    def to_dict(self) -> Dict[str, Any]:
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }


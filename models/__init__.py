
from .db import database, initialize, DB_PATH
from .user.models import User

__all__ = ["DB_PATH", "database", "initialize", "User"]

print("Pacote 'models' carregado: database e User disponíveis")


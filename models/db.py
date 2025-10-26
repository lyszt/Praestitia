from peewee import SqliteDatabase
import os
from typing import List

DB_PATH = os.path.join(os.path.dirname(__file__), "database.db")

# Banco de dados compartilhado para os models
database = SqliteDatabase(DB_PATH, pragmas={
    'foreign_keys': 1
})


def initialize(models: List = None):
    """Inicializa a conexão com o banco e cria tabelas se uma lista de models for passada.
    """
    print("Inicializando base de dados em:", DB_PATH)
    database.connect(reuse_if_open=True)
    if models:
        database.create_tables(models)
        print("Tabelas criadas:", [m.__name__ for m in models])
    return database


# Re-exportações públicas do módulo
__all__ = ["DB_PATH", "database", "initialize"]

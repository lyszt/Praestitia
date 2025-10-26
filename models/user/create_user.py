from models import User, initialize, database


def create_test_user(username="ronaldo", password="senha123", email="ronaldo@praestitia.com"):
    db = initialize([User])
    try:
        user = User.create(username=username, password=password, email=email)
        print("Usuário criado:", user.to_dict())
        return user
    except Exception as e:
        print("Erro criando usuário:", e)
        return None
    finally:
        database.close()


if __name__ == '__main__':
    create_test_user()

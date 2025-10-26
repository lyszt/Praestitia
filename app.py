import os

import email_validator.exceptions
import unidecode
from email_validator import validate_email
from flask import Flask, request, redirect, jsonify
from flask_cors import CORS
from models import initialize, User, database
from passlib.hash import argon2
from typing import *
initialize([User])

app = Flask(__name__)
# Impede que um usuário possa criar usuários infinitos ou fazer pedidos infinitos
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per hour", "10 per minute"],
    storage_uri="memory://"
)
CORS(app)


@limiter.limit("10 per minute")
@app.route("/auth/login/", methods=["POST"])
def login():
    data = request.get_json() or {}
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not all([username, password]):
        return jsonify({"status": 400, "body": "Dados inválidos. Campos não podem estar vazios."}), 400

    # print("Received:", username, password)
    user = user.get_or_none(User.username == username)

    if user is not None:
        if argon2.verify(password, user.password) :
            return jsonify({"status": 200, "username": username, "token": os.urandom(16).hex()})

    else:
        return jsonify({"status":401}, 401)
    return jsonify({"status": 500}, 500)


@limiter.limit("5 per minute")
@app.route("/auth/register/", methods=["POST"])
def register():
    data = request.get_json()
    request_adress = request.remote_addr

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")

    if not all([username, password, email]):
        return jsonify({"status": 400, "body": "Dados inválidos. Campos não podem estar vazios."}), 400

    if len(password) < 8:
        return jsonify({"body": "A senha deve ter pelo menos 8 caracteres."}), 400

    if len(username) < 3:
        return jsonify({"body": "O nome de usuário deve ter pelo menos 3 caracteres."}), 400

    username = unidecode.unidecode(username)
    password = argon2.hash(data.get("password"))

    try:
        email_info = validate_email(email, check_deliverability=True)
        email = email_info.normalized
    except email_validator.exceptions.EmailNotValidError as e:
        return jsonify({"status": 400, "body": "Dados inválidos. Email inválido."}), 400


    if user.get_or_none(User.username == username) is not None:
        return jsonify({"status": 401, "body": "Usuário já existe."}), 401
    else:
        new_user = User.create(username=username, email=email, password=password)
        print(f"Usuário criado. ID: {new_user.id}")
        return jsonify({"status": 200}), 200
    return jsonify({"status": 500}, 500)


if __name__ == '__main__':
    app.run(debug=True)

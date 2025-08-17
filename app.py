from flask import Flask, request, render_template, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# teste aaaaaaaaaaaaaaaaaaa a
# @app.route('/')
# def hello_world():  # put application's code here
#     return 'Hello World!'
#

@app.route("/auth/login", methods=["POST"])
def login():
    if request.method == "POST":
        # pega os dados enviados pelo formulário
        data = request.json
        username = data.get("username")
        password = data.get("password")

        print("Received:", username, password)
        return jsonify({"status": 200, "username": username})

        # aqui você pode fazer validação ou redirecionar
        # return f"Welcome, {username}!"
    return jsonify({"status": 500})


if __name__ == '__main__':
    app.run(debug=True)




from flask import Flask, request, render_template

app = Flask(__name__)

# teste
# @app.route('/')
# def hello_world():  # put application's code here
#     return 'Hello World!'
#

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # pega os dados enviados pelo formulário
        username = request.form.get("username")
        password = request.form.get("password")

        print("Received:", username, password)

        # aqui você pode fazer validação ou redirecionar
        # return f"Welcome, {username}!"


if __name__ == '__main__':
    app.run()




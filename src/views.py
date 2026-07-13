from flask import render_template, redirect, request, jsonify
from flask_login import logout_user, login_required, login_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from main import app
from database import get_connection
from User import User


@app.route("/")
def home():
    if current_user.is_authenticated:
        return render_template("redachat-main.html")
    return render_template("index.html")


@app.route("/login", methods=["POST"])
def login():
    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()
    email = data["email"]
    senha = data["senha"]

    cursor.execute(
        "SELECT nome, email, id, senha FROM users WHERE email = %s",
        (email,)
    )

    usuario = cursor.fetchone()

    cursor.close()
    conn.close()

    if not usuario:
        return jsonify({
            "success": False,
            "message": "Usuário ou senha incorretos."
        }), 401

    if not check_password_hash(usuario[3], senha):
        return jsonify({
            "success": False,
            "message": "Usuário ou senha incorretos."
        }), 401

    user = User(
        id=usuario[2],
        nome=usuario[0],
        email=usuario[1]
    )

    login_user(user)

    print(f"Login do usuário com id {user.id} realizado com sucesso.")

    return jsonify({
        "success": True,
        "redirect": "/"
    }), 200

@app.route("/criar", methods=["POST"])
def criar_usuario():
    conn = get_connection()
    cursor = conn.cursor()

    data = request.get_json()
    nome = data["nome"]
    email = data["email"]
    senha_hash = generate_password_hash(data["senha"])

    cursor.execute(
        "SELECT id FROM users WHERE email = %s",
        (email,)
    )

    if cursor.fetchone():
        cursor.close()
        conn.close()

        return jsonify({
            "success": False,
            "message": "Este e-mail já está cadastrado."
        }), 409

    cursor.execute(
        "INSERT INTO users (nome, email, senha) VALUES (%s, %s, %s)",
        (nome, email, senha_hash)
    )

    conn.commit()

    cursor.execute(
        "SELECT id, nome, email FROM users WHERE email = %s",
        (email,)
    )

    usuario = cursor.fetchone()

    user = User(
        id=usuario[0],
        nome=usuario[1],
        email=usuario[2]
    )

    login_user(user)

    cursor.close()
    conn.close()

    return jsonify({
        "success": True,
        "redirect": "/"
    }), 201


@app.route("/login-page")
def login_view():
    return render_template("login.html")


@app.route("/criar-conta")
def create_account_page():
    return render_template("criar-conta.html")


@app.route("/redachat-test")
def redachat_test():
    return render_template("redachat-test.html")


@app.route("/redachat-main")
@login_required
def redachat():
    return render_template("redachat-main.html")


@app.route("/logout")
def logout():
    logout_user()
    return redirect("/")


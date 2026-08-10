from flask import Blueprint, request, jsonify
from flask_login import login_user
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_connection
from User import User

auth_routes = Blueprint('auth', __name__)

@auth_routes.route("/login", methods=["POST"])
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

    # print(f"Login do usuário com id {user.id} realizado com sucesso.")

    return jsonify({
        "success": True,
        "redirect": "/"
    }), 200

@auth_routes.route("/criar", methods=["POST"])
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


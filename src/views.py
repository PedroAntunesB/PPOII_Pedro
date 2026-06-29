from flask import render_template, jsonify, redirect, request
from main import app
from database import get_connection
from flask_login import logout_user, login_required, login_user
from werkzeug.security import check_password_hash
from User import User
@app.route("/")
def main_page():
    return render_template('index.html') 

@app.route("/login", methods=["POST"])
def login_page():
    conn = get_connection()
    cursor = conn.cursor()
    data = request.get_json()
    user_email = data["email"]
    user_password = data["senha"]

    cursor.execute("SELECT nome, email, id, senha FROM users WHERE email = %s", (user_email,))
    usuario = cursor.fetchone()
    print(usuario)
    cursor.close()
    conn.close()
    if not usuario:
        return "Usuário ou senha incorretos", 401

    #Colocar o sistema de hash aqui!
    if usuario[3] == user_password:

        user = User(
            id=usuario[2],
            nome=usuario[0],
            email=usuario[1]
        )
        print(f"Login do usuario com id: {user.id} feito com sucesso")
        return redirect("/redachat-main")
    return "Usuário ou senha incorretos", 401

@app.route("/login-page")
def login_view():
    return render_template('login.html')
    
@app.route("/criar-conta")
def create_count_page():
    return render_template('criar-conta.html')

@app.route("/redachat-main-test")
def redachat_page():
    return render_template('redachat-main.html')

@app.route("/redachat-main")
@login_required
def redachat_page_login():
    return render_template('redachat-main.html')


# Rota teste
@app.route("/get-users")
def get_users():
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users")
    usuarios = cursor.fetchall()

    cursor.close()
    conn.close()

    return usuarios

@app.route("/logout")
def logout():
    logout_user()
    return redirect("/")
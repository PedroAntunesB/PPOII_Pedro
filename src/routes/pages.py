from flask import render_template, Blueprint, redirect
from flask_login import current_user, login_required, logout_user

app_pages = Blueprint("pages", __name__)

@app_pages.route("/")
def home():
    if current_user.is_authenticated:
        return render_template("redachat-main.html")
    return render_template("index.html")

@app_pages.route("/login-page")
def login_view():
    return render_template("login.html")


@app_pages.route("/criar-conta")
def create_account_page():
    return render_template("criar-conta.html")

@app_pages.route("/logout")
def logout():
    logout_user()
    return redirect("/")

@app_pages.route("/teste")
def teste():
    return render_template("teste.html")
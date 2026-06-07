from flask import render_template
from main import app

@app.route("/")
def main_page():
    return render_template('index.html') 

@app.route("/login")
def login_page():
    return render_template('login.html')

@app.route("/criar-conta")
def create_count_page():
    return render_template('criar-conta.html')
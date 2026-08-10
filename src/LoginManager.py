from flask_login import LoginManager
from .database import get_connection
from .User import User
from flask import render_template

login_manager = LoginManager()
@login_manager.user_loader
def login_user(user_id):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, nome, email FROM users WHERE id = %s", (user_id,))

    user = cursor.fetchone()
    if user: 
        return User(user[0], user[1], user[2])
    return None

@login_manager.unauthorized_handler
def unauthorized():
    return render_template("errors-page/page401.html"), 401
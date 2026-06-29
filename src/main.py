from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__, template_folder="../public/pages", static_folder="../public/static")
app.secret_key = os.getenv("SECRET_KEY")
from views import *
from LoginManager import login_manager
login_manager.init_app(app)
login_manager.login_view = "login"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
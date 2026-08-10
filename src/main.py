from flask import Flask
from dotenv import load_dotenv
import os
from LoginManager import login_manager
from views import app_bp

load_dotenv()

app = Flask(__name__, template_folder="../public/pages", static_folder="../public/static")
app.secret_key = os.getenv("SECRET_KEY")
app.register_blueprint(app_bp)

login_manager.init_app(app)
login_manager.login_view = "login"


if __name__ == '__main__':
    app.run(debug=True)
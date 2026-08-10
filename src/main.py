from flask import Flask
from dotenv import load_dotenv
import os
from LoginManager import login_manager
from routes import pages, redacao, auth
from errors.register_erros import register_error_handlers

load_dotenv()

app = Flask(__name__, template_folder="../public/pages", static_folder="../public/static")
app.secret_key = os.getenv("SECRET_KEY")
app.register_blueprint(pages.app_pages)
app.register_blueprint(redacao.redacao_routes)
app.register_blueprint(auth.auth_routes)
register_error_handlers(app)

login_manager.init_app(app)
login_manager.login_view = "login"

if __name__ == '__main__':
    app.run()
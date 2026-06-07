from flask import Flask

app = Flask(__name__, template_folder="../public/pages", static_folder="../public/static")

from views import *

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=3000)
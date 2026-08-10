from flask import render_template

def register_error_handlers(app):

    @app.errorhandler(404)
    def not_found(error):
        return render_template("errors-page/page404.html"), 404

    @app.errorhandler(401)
    def unauthorized(error):
        return render_template("errors-page/page401.html"), 401
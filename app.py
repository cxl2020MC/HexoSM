from flask import Flask,  request, jsonify
from flask_cors import CORS
# from api import main
import traceback

app = Flask(__name__)
cors = CORS(app, origins="*", supports_credentials=True)
limiter = Limiter(app, key_func = get_remote_address)
app.config["JSON_AS_ASCII"] = False
app.config['SECRET_KEY'] = 'hexosmcodebycxl2020mc'
app.debug = True

from web.page import page
import web.api

app.register_blueprint(page.bp)
app.register_blueprint(web.api.bp)


@app.errorhandler(400)
def server_error(e):
    return jsonify({"ok": False, "msg": f"{e.__class__}: {e}", "data": None})


@app.errorhandler(404)
def server_error(e):
    return jsonify({"ok": False, "msg": "404错误: 在请求的服务器上找不到请求的URL", "data": None})


if __name__ == '__main__':
    app.run()

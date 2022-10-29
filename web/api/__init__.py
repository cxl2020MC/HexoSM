from flask import Blueprint, request, jsonify, session, redirect, render_template
import os

bp = Blueprint('page', __name__)

@bp.route('/api/<apiname>/')
def index(apiname):
    data = request.json
    print(data)
    if apiname == "login":
        retdata = login(data)
    else:
        return jsonify({"ok": False, "msg": "404错误: 在请求的服务器上找不到请求的URL", "data": None})
    return jsonify({"ok": True, "msg": "ok", "data": retdata})

def login(data):
    if os.getenv("LOGINUSERNAME") != data.get("username"):
        return {"msg": "用户名错误"}
    if os.getenv("LOGINPASSWORD") != data.get("password"):
        return {"msg": "密码错误"}
    return {"msg": "登录成功，等待转跳。"}
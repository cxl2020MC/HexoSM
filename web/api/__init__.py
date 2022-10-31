from flask import Blueprint, request, jsonify, session, redirect, render_template
import os

bp = Blueprint('api', __name__)

@bp.route('/api/<apiname>/')
def index(apiname):
    data = request.json
    print(data)
    if apiname == "xxx":
        retdata = login(data)
    else:
        return jsonify({"ok": False, "msg": "404错误: 在请求的服务器上找不到请求的URL", "data": None})
    return jsonify({"ok": True, "msg": "ok", "data": retdata})

@bp.route('/api/login/')
def login(data):
    data = request.json
    print(data)
    login = False
    if os.getenv("LOGINUSERNAME") != data.get("username"):
        msg = "用户名错误"
    if os.getenv("LOGINPASSWORD") != data.get("password"):
        msg = "密码错误"
    else:
        msg = "登录成功，等待转跳。"
        login = True
        session["login"] = True
    return {"ok": True, "msg": msg, "login": login}
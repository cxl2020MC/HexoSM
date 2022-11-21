from flask import Blueprint, request, jsonify, session # , redirect, render_template
import os
from db import db
from .装饰器 import 注册api

bp = Blueprint('api', __name__)

@bp.route('/api/login/', methods = ["POST"])
@注册api(需要登录 = False)
def login():
    data = request.json
    print(data)
    login = False
    if os.getenv("LOGINUSERNAME") != data.get("username"):
        msg = "用户名错误"
    elif os.getenv("LOGINPASSWORD") != data.get("password"):
        msg = "密码错误"
    else:
        msg = "登录成功，等待转跳。"
        login = True
        session["login"] = True
    return {"login": login, "msg": msg}


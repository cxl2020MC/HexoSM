from flask import session, jsonify
import traceback


def 注册api(需要登录=True):
    retdata = {"ok": True, "msg": "ok", "data": None}

    def decoractor(f):
        def main(*args, **kwargs):
            if 需要登录:
                if session.get("login"):
                    print("用户已登录")
                else:
                    print("用户未登录")
                    retdata["ok"] = False
                    retdata["msg"] = "您未登录"
                    return jsonify(retdata)
            try:
                方法返回数据 = f(*args, **kwargs)
                retdata["data"] = 方法返回数据
                print(f"方法返回数据: {方法返回数据}")
            except Exception as e:
                # print(e)
                错误信息 = traceback.format_exc()
                print(错误信息)
                retdata["ok"] = False
                retdata["msg"] = f'''服务端错误!!!                
{e.__class__}: {e}
详情请查看函数运行日志'''
            return jsonify(retdata)
        return main
    return decoractor

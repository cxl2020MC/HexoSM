from flask import session 


def 注册api(需要登录 = True):
    def main1 (f):
        def main2(*args, **kwargs):
            try:
                return f(*args, **kwargs)
            except Exception as e:
                print(e)
        return main2
    return main1


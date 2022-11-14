import pymongo
import os

modburl = os.getenv('MONGODB_URL')
if modburl == None:
    print("未设置'MONGODB_URL'环境变量")
else:
    print('连接数据库:'+modburl)

if modburl != None:
    client = pymongo.MongoClient(modburl)

    db = client['test']
else:
    db = None

if __name__ == '__main__':
    import time
    databases = client.list_database_names()
    print('共有数据库：' + str(databases))
    collections = db.list_collection_names()
    print('共有集合：' + str(collections))
    # data = {
        # '内容': '测试测试',
        # '时间': time.time(),
        # '设备': 'vscode测试'
    # }
    # db.说说.insert_one(data)

    result = db.说说.find()
    comment = list(result)
    print(comment)

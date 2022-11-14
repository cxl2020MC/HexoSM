from github import Github
from db import db

if db != None:
    gh_config = db.config.find_one({"name": "Github-config"})
    if gh_config != None:
        print("连接Github仓库")
        # using an access token
        g = Github(gh_config["access_token"])
        repo = g.get_repo(gh_config["repo"])
    else:
        print("Github未配置!")
else:
    g = None
    repo = None

# Github Enterprise with custom hostname
# g = Github(base_url="https://{hostname}/api/v3", login_or_token="access_token")
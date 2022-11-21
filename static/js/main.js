function Snackbarshow(text){
    Snackbar.show(
        {
            actionText: '关闭',
            text: text,
            backgroundColor: '#49b1f5',
            actionTextColor: '#ffffff',
            pos: 'top-right',
            duration: '5000'
        }
    );
};

async function post_api(url, body) {
    let data = await fetch(url, {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify(body)
    });
    data = await data.json();
    console.log(data);
    return data;
}

//保活vercel
setInterval(function () {
    post_api("/api/check_login/", {"ok": "true"})
}, 1000*30)

async function up_login_data() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var post_data = {
        'username': username,
        'password': password
    }
    var data = await post_api("/api/login/", post_data)
    Snackbarshow(data["data"]["msg"]);
    if (data["data"]["login"]) {
        location.assign("/");
    };
};
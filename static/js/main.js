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

async function up_login_data() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    let data = await fetch("/api/login/", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({
            'username': username,
            'password': password
        })
    });
    data = await data.json()
    console.log(data)
    Snackbarshow(data["msg"])
};
async function change() {
    console.log("I am being clicked");
    var oldp = document.getElementById("old").value;
    var newp = document.getElementById("new").value;
    console.log(oldp,newp);
    if(oldp==newp){
      document.getElementById("error").classList.remove("hidden");
        setTimeout(function () {
            document.getElementById("error").classList.add("hidden");
        } , 2000);
        return;
    }
    var yourUrl = "http://localhost:3000/users/changePassword";
    const dataToSend = JSON.stringify({ "old": oldp, "new": newp});
    let dataReceived = "";
    await fetch(yourUrl, {
        method: "PUT",
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken")
        },
        body: dataToSend
    })
        .then((resp) => {
            if (resp.status === 200) {
                return resp.json()
            } else {
                console.log("Status: " + resp.status)
                return Promise.reject("server")
            }
        })
        .then(dataJson => {
            if (dataJson.accessToken != undefined) {
                localStorage.setItem("accessToken", dataJson.accessToken);
                console.log("accessToken: " + localStorage.getItem("accessToken"));
                window.location.href = "./index.html";
            }
            else {
                // remove the hidden class and add again after 2 second
                document.getElementById("error").classList.remove("hidden");
                setTimeout(function () {
                    document.getElementById("error").classList.add("hidden");
                }, 2000);
            }
        }).catch(err => {
            console.log(err);
            loginError.innerHTML = "Invalid Username or Password";
        }).finally(() => {
            console.log("Finally");
        })

    console.log(`Received: ${dataReceived}`)
}

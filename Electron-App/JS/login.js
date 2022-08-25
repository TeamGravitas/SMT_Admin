let input = document.getElementbyId("submit");
async function validate() {
    console.log("I am being clicked");
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var yourUrl = "http://localhost:3000/users/login";
    const dataToSend = JSON.stringify({ "username": username, "password": password });
    let dataReceived = "";
    await fetch(yourUrl, {
        method: "post",
        headers: { "Content-Type": "application/json" },
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
                window.location.href = "../html/index.html";
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

input.addEventListener("keypress", (event)=> {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      validate();
    }
});

var searchResults = document.getElementById("searchResults");
var searchList = document.getElementById("ipSearchList").getElementsByTagName('tbody')[0];
var searchButton = document.getElementById("searchBox");
var searchBox = document.getElementById("to-search");
var ipVisibility = document.getElementById("ip-visibility");


searchButton.addEventListener("click", fetchResults);
searchBox.addEventListener("keydown", fetchResults);
searchBox.addEventListener("keyup", clearWhenEmtpy);

// var radioButton1 = document.getElementById("gridRadios1");
// var radioButton2 = document.getElementById("gridRadios2");

// check which one is checked every time the click event is triggered
function checkRadioButton() {
    console.log("clcick");
    var radioButton1 = document.getElementById("gridRadios1");
    var radioButton2 = document.getElementById("gridRadios2");
    if (radioButton1.checked) {
        return "ip";
        console.log("IP");
    } else if (radioButton2.checked) {
        return "name";
        console.log("software");
    }
}
// checkRadioButton();




//changes
var nm_softwarelist = document.getElementById("nm-softwareList").getElementsByTagName('tbody')[0];
var m_softwarelist = document.getElementById("m-softwareList").getElementsByTagName('tbody')[0];

// let ipHead = document.getElementById("ip-val");
let curIp = localStorage.getItem("ip");
// ipHead.textContent = curIp;

ipSoftwareInfo = []

async function deleteSoftware(softwareObj) {
    dataToSend = { "uninstallString": softwareObj.uninstallString };
    dataToSend = JSON.stringify(dataToSend);
    await fetch(`http://${softwareObj.ip}:5000/uninstallSoftware`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: dataToSend
    })
        .then((resp) => {
            if (resp.status === 200) {
                console.log("Software uninstalled successfully");
                window.location.href = '../html/softwareList.html';
            } else {
                console.log("Status: " + resp.status)

            }
        })
        .catch(err => {
            console.log(err);
            // loginError.innerHTML = "Invalid Username or Password";
        }).finally(() => {
            console.log("Finally");
        })

}

function getIpSoftwareInfo(curIp) {
    // 'http://10.2.73.1:3000/installedSoftware'
    fetch(`http://localhost:3000/getSoftware/${curIp}`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem("accessToken")

            }
        })
        .then((response) => {
            // console.log(response);
            return response.json()
        })
        .then((data) => {
            ipSoftwareInfo = data["res"];
            console.log(ipSoftwareInfo);
        })
        .then(() => {
            renderIpSoftwareInfo();
        });
}

function renderIpSoftwareInfo() {
    for (let i = 0; i < ipSoftwareInfo.length; i++) {
        // console.log(ipSoftwareInfo[i]);
        ipSoftwareInfo[i].sid = i + 1;
        insertNewRecord(ipSoftwareInfo[i]);
    }
}


function insertNewRecord(data) {
    // data.isMalicious = 1;
    // data.dateInstalled = "-";
    // data.size = 0;
    // data.sid = 1;
    if (data.isMalicious === 1) {
        let newRow = m_softwarelist.insertRow(m_softwarelist.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = data.sid;
        cell2 = newRow.insertCell(1);
        let ip = document.createElement('a');
        let link = document.createTextNode(data.softwareName);
        ip.href = "#";
        ip.appendChild(link);
        ip.onclick = function () {
            localStorage.setItem("sid", data.sid);
        };
        cell2.appendChild(ip);
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.dateInstalled;
        cell4 = newRow.insertCell(3);
        if (data.size != NaN || data.size != null)
            cell4.innerHTML = data.size;
        else cell4.innerHTML = 25064;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = data.version;
        cell6 = newRow.insertCell(5);
        // add a button to delete the software
        let deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash">';
        deleteButton.onclick = function () {
            // console.log("Logging",data);
            deleteSoftware(data);
        }
        cell6.appendChild(deleteButton);
    } else {
        let newRow = nm_softwarelist.insertRow(nm_softwarelist.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = data.sid;
        cell2 = newRow.insertCell(1);
        let ip = document.createElement('a');
        let link = document.createTextNode(data.softwareName);
        ip.href = "#";
        ip.appendChild(link);
        ip.onclick = function () {
            localStorage.setItem("sid", data.sid);
        };
        cell2.appendChild(ip);
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.dateInstalled;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.size;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = data.version;
        // cell6 = newRow.insertCell(5);
        // // add a button to delete the software
        // let deleteButton = document.createElement('button');
        // deleteButton.className = "btn btn-danger btn-sm";
        // deleteButton.innerHTML = '<i class="fa-solid fa-trash">';
        // deleteButton.onclick = function() {
        //     // console.log(data);
        //     deleteSoftware(data);
        // }
        // cell6.appendChild(deleteButton);
    }

}






function displayResult(data) {
    let newRow = searchList.insertRow(searchList.length);
    cell1 = newRow.insertCell(0);
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "cb-added";
    cell1.appendChild(checkbox)
    cell2 = newRow.insertCell(1);
    let ip = document.createElement('a');
    let link = document.createTextNode(data.ip);
    ip.href = "../html/softwareList.html";
    ip.appendChild(link);
    ip.onclick = function () {
        localStorage.setItem("ip", data.ip);
    };
    cell2.appendChild(ip);
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.os;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.dateAdded;
    cell5 = newRow.insertCell(4);
    // add a button to delete the software
    let deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-danger btn-sm";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash">';
    deleteButton.onclick = function () {
        // console.log("Logging",data);
        deleteSoftware(data);
    }
    cell5.appendChild(deleteButton);
}

function displayResults(results) {
    for (let i = 0; i < results.length; i++) {
        displayResult(results[i]);
    }
}

function fetchResults(event) {
    if (event.key === "Enter" && checkRadioButton() == "name") {
        searchList.innerHTML = "";
        searchResults.classList.remove("d-none");
        // searchResults.textContent = "";
        let options = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem("accessToken")
            },
        }

        let url = "http://localhost:3000/getIpWithSoftware/" + searchBox.value;
        fetch(url, options)
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonData) {
                let results = jsonData["res"];
                displayResults(results);
            });
    }
    else if(event.key === "Enter" && checkRadioButton() == "ip"){
        ipVisibility.classList.remove("d-none");
        getIpSoftwareInfo(searchBox.value);
    }
}


function clearWhenEmtpy(event) {
    if (searchBox.value === "") {
        if(checkRadioButton()=="name"){
            searchResults.classList.add("d-none");
            searchList.innerHTML = "";
        }
        else if(checkRadioButton()=="ip"){
            ipVisibility.classList.add("d-none");
            m_softwarelist.innerHTML = "";
            nm_softwarelist.innerHTML = "";
        }
    }
}
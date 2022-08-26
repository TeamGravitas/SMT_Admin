var addedTable = document.getElementById("addedIpList").getElementsByTagName('tbody')[0];
var unaddedTable = document.getElementById("unaddedIpList").getElementsByTagName('tbody')[0];
const loader = document.getElementById("loadingDiv");
var ipInfo = [];

function getIpInfo() {
    loader.style.display="block";
    fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
    .then((response) => response.json())
    .then((data) => {
        loader.style.display="none";
        ipInfo = data["res"];
        console.log("hrllo");
        console.log(ipInfo);
        renderIpInfo();
    })
    .then(() => {
        fetch('http://localhost:3000/discover_ip', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + localStorage.getItem("accessToken")
            },
            // send the ip in JSON format
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // ipInfo = ipInfo.concat(data["res"]);
            fetch('http://localhost:3000/', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': 'Bearer ' + localStorage.getItem("accessToken")
                }
            })
            .then((response) => response.json())
            .then((data) => {
                ipInfo = data["res"];
                console.log("hrllo");
                console.log(ipInfo);
                addedTable.innerHTML = "";
                unaddedTable.innerHTML = "";
                renderIpInfo();
            })
        });
    });
}

function renderIpInfo() {
    for (let i = 0; i < ipInfo.length; i++) {
        console.log(ipInfo[i]);
        insertNewRecord(ipInfo[i]);
    }
}

function insertNewRecord(data) {
    if (data.isMonitored === 1) {
        let newRow = addedTable.insertRow(addedTable.length);
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
    } else {
        let newRow = unaddedTable.insertRow(unaddedTable.length);
        cell1 = newRow.insertCell(0);
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = "cb-unadded";
        console.log(checkbox.id);
        cell1.appendChild(checkbox)
        cell2 = newRow.insertCell(1);
        cell2.innerHTML = data.ip;
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.os;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.dateAdded;
    }

}
getIpInfo();

function addIPtoHomePage() {
    let ip = document.geentById("newIP").value;
    //Push this ip to database
    console.log("the IP is " + ip);
    fetch('http://localhost:3000/addIP', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken")
        },
        // send the ip in JSON format
        body: JSON.stringify({
            ip: ip
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
            }
            )
    });

}

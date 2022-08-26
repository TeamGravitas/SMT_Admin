
var addAll = document.getElementById("ua-all");
var unaddAll = document.getElementById("a-all");
var addedTable = document.getElementById("addedIpList").getElementsByTagName('tbody')[0];
var unaddedTable = document.getElementById("unaddedIpList").getElementsByTagName('tbody')[0];
var addBtn = document.getElementById("add");
var removeBtn = document.getElementById("remove");
var searchBox = document.getElementById("searchBox");
var ipPage = document.getElementById("ipPage");

addAll.addEventListener("click", toggle);
unaddAll.addEventListener("click", toggle);
addBtn.addEventListener("click", moveIps);
removeBtn.addEventListener("click", moveIps);
searchBox.addEventListener("keydown", fetchResults);
searchBox.addEventListener("keyup", clearWhenEmtpy);


async function deleteSoftware(softwareObj){
    dataToSend = {"uninstallString": softwareObj.uninstallString};
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

async function clearLocalStorage() {
    localStorage.clear();
}

function toggle(ev) {
    if(ev.target.id === "ua-all") {
        let checkboxes = document.getElementsByName("cb-unadded");
        for(let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = ev.target.checked;
        }
    } else {
        let checkboxes = document.getElementsByName("cb-added");
        for(let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = ev.target.checked;
        }
    }
}

function insertNewRecord(data) {
    if(data.isMonitored === 1) {
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
        ip.onclick = function() {
            localStorage.setItem("ip", data.ip);
        };
        cell2.appendChild(ip);
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.os;
        cell4 = newRow.insertCell(3);
        cell4.innerHTML = data.dateAdded;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = "<a href='../html/softwareList.html' class='delete'>Explore IP <i class='fa-solid fa-up-right-from-square'></i></a>";
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
        cell5 = newRow.insertCell(4);

    }
    
}

async function moveIps(ev) {
    if(ev.target.id === "add") {
        let checkboxes = document.getElementsByName("cb-unadded");
        let ipList = [];
        for(let i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked === true) {
                data = {};
                data.isMonitored = 1;
                data.ip = unaddedTable.rows[i].cells[1].innerHTML;
                data.os = unaddedTable.rows[i].cells[2].innerHTML;
                data.dateAdded = unaddedTable.rows[i].cells[3].innerHTML;
                ipList.push(data.ip);
                insertNewRecord(data);

                let deleteIndex = unaddedTable.rows[i].rowIndex;
                console.log(deleteIndex);
                unaddedTable.deleteRow(deleteIndex-1);

                i--;
            }
        }
        console.log(ipList);
        data = {
            ipList: ipList,
            isMonitored: 1
        }
        await fetch("http://localhost:3000/updateMonitoredStatus", {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken")
            },
            body: JSON.stringify(data)
        });

        let allcb = document.getElementById("ua-all");
        allcb.checked = false;
    } else {
        console.log("remove");
        let checkboxes = document.getElementsByName("cb-added");
        let ipList = [];
        for(let i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked === true) {
                data = {};
                data.isMonitored = 0;
                data.ip = addedTable.rows[i].cells[1].firstChild.textContent;
                data.os = addedTable.rows[i].cells[2].innerHTML;
                data.dateAdded = addedTable.rows[i].cells[3].innerHTML;
                ipList.push(data.ip);
                insertNewRecord(data);

                let deleteIndex = addedTable.rows[i].rowIndex;
                addedTable.deleteRow(deleteIndex-1);
                
                i--;
            }
        }
        console.log(ipList);
        data = {
            ipList: ipList,
            isMonitored: 0
        }
        await fetch("http://localhost:3000/updateMonitoredStatus", {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + localStorage.getItem("accessToken")
            },
            body: JSON.stringify(data)
        });
        let allcb = document.getElementById("a-all");
        allcb.checked = false;
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
        ip.onclick = function() {
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
        deleteButton.onclick = function() {
            // console.log("Logging",data);
            deleteSoftware(data);
        }
        cell5.appendChild(deleteButton);
}

function displayResults(results) {
    for(let i=0; i<results.length; i++) {
        displayResult(results[i]);
    }
}

function fetchResults(event) {
    if (event.key === "Enter") {
        searchList.innerHTML = "";
        searchResults.classList.remove("d-none");
        ipPage.classList.add("d-none");
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
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                let results = jsonData["res"];
                displayResults(results);
            });
    }
}

function clearWhenEmtpy(event) {
    if(searchBox.value === "") {
        searchResults.classList.add("d-none");
        ipPage.classList.remove("d-none");
        searchList.innerHTML = "";
    }
}
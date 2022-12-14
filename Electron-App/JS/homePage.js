
var addAll = document.getElementById("ua-all");
var unaddAll = document.getElementById("a-all");
var addedTable = document.getElementById("addedIpList").getElementsByTagName('tbody')[0];
var unaddedTable = document.getElementById("unaddedIpList").getElementsByTagName('tbody')[0];
var addBtn = document.getElementById("add");
var removeBtn = document.getElementById("remove");

addAll.addEventListener("click", toggle);
unaddAll.addEventListener("click", toggle);
addBtn.addEventListener("click", moveIps);
removeBtn.addEventListener("click", moveIps);

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
        let iplist = [];
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
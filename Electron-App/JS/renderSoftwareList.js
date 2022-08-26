var nm_softwarelist = document.getElementById("nm-softwareList").getElementsByTagName('tbody')[0];
var m_softwarelist = document.getElementById("m-softwareList").getElementsByTagName('tbody')[0];
const loader = document.getElementById("loadingDiv");

let ipHead = document.getElementById("ip-val");
let curIp = localStorage.getItem("ip");
ipHead.textContent = curIp;

ipSoftwareInfo = []

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

function getIpSoftwareInfo() {
    // 'http://10.2.73.1:3000/installedSoftware'
    loader.style.display="block";
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
        loader.style.display="none";
        ipSoftwareInfo = data["res"];
        console.log(ipSoftwareInfo);
    })
    .then(() => {
        renderIpSoftwareInfo();
    });
}

function renderIpSoftwareInfo() {
    for(let i = 0; i < ipSoftwareInfo.length; i++) {
        // console.log(ipSoftwareInfo[i]);
        ipSoftwareInfo[i].sid = i+1;
        insertNewRecord(ipSoftwareInfo[i]);
    }
}


function insertNewRecord(data) {
    // data.isMalicious = 1;
    // data.dateInstalled = "-";
    // data.size = 0;
    // data.sid = 1;
    if(data.isMalicious === 1) {
        let newRow = m_softwarelist.insertRow(m_softwarelist.length);
        cell1 = newRow.insertCell(0);
        cell1.innerHTML = data.sid;
        cell2 = newRow.insertCell(1);
        let ip = document.createElement('a');
        let link = document.createTextNode(data.softwareName);
        ip.href = "#";
        ip.appendChild(link);
        ip.onclick = function() {
            localStorage.setItem("sid", data.sid);
        };
        cell2.appendChild(ip);
        cell3 = newRow.insertCell(2);
        cell3.innerHTML = data.dateInstalled;
        cell4 = newRow.insertCell(3);
        if(data.size!=NaN || data.size!=null)
            cell4.innerHTML = data.size;
        else cell4.innerHTML = 25064;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = data.version;
        cell6 = newRow.insertCell(5);
        // add a button to delete the software
        let deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-danger btn-sm";
        deleteButton.innerHTML = '<i class="fa-solid fa-trash">';
        deleteButton.onclick = function() {
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
        ip.onclick = function() {
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
getIpSoftwareInfo();


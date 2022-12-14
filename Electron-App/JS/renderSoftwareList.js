var nm_softwarelist = document.getElementById("nm-softwareList").getElementsByTagName('tbody')[0];
var m_softwarelist = document.getElementById("m-softwareList").getElementsByTagName('tbody')[0];

let ipHead = document.getElementById("ip-val");
let curIp = localStorage.getItem("ip");
ipHead.textContent = curIp;

ipSoftwareInfo = []

function getIpSoftwareInfo() {
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
        // console.log(ipSoftwareInfo);
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
    // data.isMalicious = 0;
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
        cell4.innerHTML = data.size;
        cell5 = newRow.insertCell(4);
        cell5.innerHTML = data.version;
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
    }
    
}
getIpSoftwareInfo();


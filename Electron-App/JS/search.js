var searchResults = document.getElementById("searchResults");
var searchList = document.getElementById("ipSearchList").getElementsByTagName('tbody')[0];
var searchButton = document.getElementById("searchBox");
var searchBox = document.getElementById("to-search");


searchButton.addEventListener("click",fetchResults);
searchBox.addEventListener("keydown",fetchResults);
searchBox.addEventListener("keyup",clearWhenEmtpy);


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
    searchList.innerHTML = "";
}
}
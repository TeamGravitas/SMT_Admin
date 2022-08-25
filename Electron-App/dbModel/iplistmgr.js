var dbmgr = require("./dbmgr")
var db = dbmgr.db;

exports.createIpTable = () => {
    const query = "CREATE TABLE IF NOT EXISTS iplist (id INTEGER PRIMARY KEY AUTOINCREMENT,ip TEXT NOT NULL UNIQUE,isMonitored INTEGER NOT NULL,os TEXT,dateAdded TEXT NOT NULL);"
    return new Promise((rs, rj) => {
        db.run(query, (err) => {
            if (err) {
                console.log('Some Error Occured');
                rj(err);
            } else {
                console.log('Table Created');
                rs(true);
            }
        });
    })

};

exports.getIpList = () => {
    const query = "SELECT * FROM iplist;"
    return new Promise((rs, rj) => {
        db.all(query, [], (err, rows) => {
            if (err) {
                rj(err);
            }
            // rows.forEach((row) => {
            //     console.log(row);
            // });
            rs(rows);
        })
    });
}

exports.insertIp = (ipObj) => {
    const query = "INSERT INTO iplist(ip, isMonitored, os, dateAdded) VALUES(?, 0, ?, datetime('now'));"
    return new Promise((rs, rj) => {
        db.run(query, [ipObj.ip, ipObj.os], function (err) {
            if (err) {
                rj(err);
            }
            // get the last insert id
            // console.log(`A row has been inserted with rowid ${this.lastID}`);
            rs(this.lastID);
        })
    });
}

exports.deleteIp = (ip) => {
    const query = "DELETE FROM iplist WHERE ip = ?";
    console.log(ip);
    return new Promise((rs, rj) => {
        db.run(query, ip, function (err) {
            if (err) {
                rj(err);
            }
            // get the last insert id
            // console.log(`A row has been deleted with ip ${this.changes}`);
            rs(this.changes);
        })
    });
}

exports.updateMonitoredStatus = (ipList, val) => {
    const query = `UPDATE iplist SET isMonitored = ? WHERE ip in (${ ipList.map(() => "?").join(",") })`;
    // console.log(ipList, val);
    ipList.unshift(val);
    return new Promise((rs,rj) => { 
        db.run(query, ipList, function(err) {
            if (err) {
                rj(err);
            }
            // get the last insert id
            // console.log(`Number of rows updated ${this.changes}`);
            rs("Success");
        })
    });
}

// exports.createIpTable();
// exports.insertIp({ip: "1.1.1.1", os: "Windows"});
// exports.insertIp({ip: "2.2.2.2", os: "Linux"});
// exports.insertIp({ip: "3.3.3.3", os: "Windows"});
// exports.getIpList();
// deleteIp("3.3.3.3");

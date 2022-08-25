var dbmgr = require("./dbmgr")
var db = dbmgr.db;

exports.createUsersTable = () => {
    const query = "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT,username VARCHAR(50) NOT NULL UNIQUE,isSuperAdmin INTEGER NOT NULL,password VARCHAR(50) NOT NULL);"
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

exports.insertUP = (usernameObj) => {
    const query = "INSERT INTO users (username, password, isSuperAdmin) VALUES(?, ?, 1);"
    return new Promise((rs,rj) => { 
        db.run(query, [usernameObj.username, usernameObj.password], function(err) {
            if (err) {
                rj(err);
            }
            // get the last insert UP
            console.log(`A row has been inserted with usernameid ${this.lastID}`);
            rs(this.lastID);
        })
    });
}

exports.updatePassword = (usernameObj) => {
    const query = "UPDATE users SET password = ? WHERE username = ?;"
    return new Promise((rs,rj) => { 
        db.run(query, [usernameObj.password, usernameObj.username], function(err) {
            if (err) {
                rj(err);
            }
            // get the last insert UP
            console.log(`password updated for usernameid ${this.changes}`);
            rs(this.changes);
        })
    });
};

exports.countSuperAdmin = () => {
    const query = "SELECT COUNT(*) FROM users WHERE isSuperAdmin = 1;"
    return new Promise((rs, rj) => {
        db.get(query, (err, row) => {
            if (err) {
                rj(err);
            }
            console.log(row['COUNT(*)']);
            rs(row['COUNT(*)']);
        });
    }).catch(err => {
        console.log(err);
    }).finally(() => {
        console.log("Finally");
    });
};
var dbmgr = require("./dbmgr")
var db = dbmgr.db;

exports.createMaliciousSoftwareTable = () => {
    const query = "CREATE TABLE IF NOT EXISTS maliciousSoftwareList (sid INTEGER PRIMARY KEY AUTOINCREMENT, softwareName TEXT NOT NULL);";
    return new Promise((rs,rj) => {
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

exports.insertMaliciousSoftware = (softwareList) => {
    let placeholders = languages.map((language) => '(?)').join(',');
    const query = "INSERT INTO malicousSoftwareList(softwareName) values " + placeholders;
    return new Promise((rs,rj) => { 
        db.run(query, [softwareObj.softwareName, 0, softwareObj.version, softwareObj.dateInstalled, softwareObj.ip], function(err) {
            if (err) {
                rj(err);
            }
            // get the last insert id
            // console.log(`A row has been inserted with rowid ${this.lastID}`);
            rs(this.lastID);
        })
    });
}

exports.getMaliciousSoftwareList = () => {
    const query = "SELECT softwareName FROM maliciousSoftwareList ORDER BY softwareName ASC;";
    return new Promise((rs,rj) => {
        db.all(query, [ip], (err, rows) => {
        if (err) {
            rj(err);
        }
        // rows.forEach((row) => {
        //     console.log(row);
        // });
        rs(rows);   
    })});
}

const { exec } = require('child_process');
const { stdout } = require('process');

const execSync = require('child_process').execSync;
// var ip = localStorage.getItem("ip");

// module.exports = exports = { stdout: stdout };

exports.discoverIP = function (req, res) {
    // let ip = '192.168.198.127';
    let ip = '192.168.1.5';
    let string = "nmap -sn " + ip + "/24";
    return new Promise((resolve, reject) => {
        exec(string, (err, stdout, stderr) => {
            if (err) {
                // node couldn't execute the command
                console.log(err);
                reject(err);
            } else {
                // the *entire* stdout and stderr (buffered)
                console.log("before", stdout);
                if (stderr) {
                    reject(stderr);
                }

                let output = [];
                let lines = stdout.split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('Nmap scan report for')) {
                        let ip = lines[i].split(' ')[5]
                        ip = ip.substring(1, ip.length - 2);
                        let count = 0;
                        for (let j = 0; j < ip.length; j++) {
                            if (ip[j] == '.') {
                                count++;
                            }
                        }
                        if(count==3){
                            output.push({
                                ip: ip,
                                os: "win",
                                dateAdded: ""
                            });
                        }
                        
                        // output.push(lines[i])
                    }
                }
                // output = JSON.stringify(output);
                console.log("after", output);
                resolve(output);
            }
        })
    });
    // console.log("stdout:",stdout);
    // let output = []
    // let lines = stdout.split('\n');
    // for (let i = 0; i < lines.length; i++) {
    //     if (lines[i].includes('Nmap scan report for')) {
    //         let ip = lines[i].split(' ')[4]
    //         ip = ip.substring(0, ip.length - 1);
    //         if (ip.includes('.')) {
    //             output.push(ip);
    //         }
    //         // output.push(lines[i])
    //     }
    // }
    // console.log(stdout);
    // res.send(output);
}

// exports.discoverIP();
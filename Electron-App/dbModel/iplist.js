const { exec } = require('child_process').exec;
var ip;
var string = "nmap -sn" + ip + "/24"
const output = async(string, (error, stdout, stderr) => {
    if (error) {
        reject(console.log(`error: ${error.message}`));
    }
    if (stderr) {
        reject(console.log(`stderr: ${stderr}`));
    }
    let output=[]
    let lines = stdout.split('\n');
    for(let i=0;i<lines.length;i++)
    {
        if(lines[i].include('Nmap scan report for'))
        {
            let ip = lines[i].split(' ')[4]
            ip = ip.substring(0, ip.length - 1);
            if(ip.includes('.')){
                output.push(ip);
            }
            output.push(lines[i])
        }
    }
    return output
});

module.exports = exports = {output:output};
// read out_report from input.txt
var fs = require('fs');
out_report = fs.readFileSync('input.txt', 'utf8');

function getIPfromStdout(out_report){
    let ip_list = [];
    let lines = out_report.split('\n');
    for(let i = 0; i < lines.length; i++){
        if(lines[i].includes('Nmap scan report for')){
            let ip = lines[i].split(' ')[4];
            ip = ip.substring(0, ip.length - 1);
            if(ip.includes('.')){
                ip_list.push(ip);
            }
        }
    }
    console.log(ip_list);
    return ip_list;
}
getIPfromStdout(out_report);
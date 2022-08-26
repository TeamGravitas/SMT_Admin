const { app, BrowserWindow } = require('electron')
const express = require('express')
const ipop = require("./dbModel/iplistmgr");
const sftop = require("./dbModel/softwarelistmgr");
const upop = require("./dbModel/usersmgr");
const discover_ip = require("./dbModel/discoverIP");
const malop = require("./dbModel/maliciousSoftwareList")
const auth = require("./authServer");
const { authenticateToken, isAuthentic } = require('./dbModel/authenticateHelper');
const cors = require('cors');
const { json } = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const axios = require('axios').default;
var schedule = require('node-schedule');
const nodemailer = require('nodemailer');

/*************************** ********************/
const serve = express();
const port = 3000;

serve.use(express.json());
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
}

serve.use(cors(corsOptions));

async function createTables() {
  await upop.createUsersTable();
  await ipop.createIpTable();
  await sftop.createSoftwareTable();
  // await malop.createMaliciousSoftwareTable();
  // await malop.fillMaliciouTable();
}

// async function discoverIP() {
//   await discover_ip.discoverIP();
// }

/********************Routes *********************/

serve.get('/', authenticateToken, (req, res) => {
  ipop.getIpList().then((resp) => {
    // console.log(resp);
    res.send({ "res": resp });
  })
});

// serve.get('/getSoftware/:ip', authenticateToken, (req, res) => {
//   sftop.getSoftwareList(req.params["ip"]).then((resp) => {
//           // console.log(resp);
//           res.send({ "res": resp });
//       });
// });

serve.get('/getSoftware/:ip', authenticateToken, (req, res) => {

  axios.get(`http://${req.params["ip"]}:5000/installedSoftware`)
    .then((response) => {
      console.log(response.data);
      return [response.data, req.params["ip"]];
    })
    .then((data) => {
      ipSoftwareInfo = data[0]["res"];
      // console.log(ipSoftwareInfo);
      sftop.deleteAllSoftwaresForIp(data[1]);
      for (let i = 0; i < ipSoftwareInfo.length; i++) {
        ipSoftwareInfo[i].ip = data[1];
        sftop.insertSoftware(ipSoftwareInfo[i]);
      }
      // console.log(ipSoftwareInfo);
    })
    .catch(() => console.log("Cannot Fetch Latest Data"))
    .then(() => {
      malop.getMaliciousSoftwareList().then((maliciousSoftwareList) => {
        sftop.updateMalciousStatus(maliciousSoftwareList, 1).then((resp) => {
          if (resp === "Success") {
            sftop.getSoftwareList(req.params["ip"]).then((resp) => {
              // console.log(resp);
              res.send({ "res": resp });
            });
          }
        })
      });
    });
});

serve.get('/getIpWithSoftware/:softwareName', authenticateToken, (req, res) => {
  sftop.getIpWithSoftwareList(req.params["softwareName"]).then((resp) => {
    res.send({ "res": resp });
  })
});

serve.put('/updateMonitoredStatus', authenticateToken, (req, res) => {
  let data = req.body;
  // console.log(data);
  ipop.updateMonitoredStatus(data.ipList, data.isMonitored).then((resp) => {
    // console.log(resp);
    res.send({ "res": resp });
  })
})

serve.post('/users/login', auth.login);

serve.post('/users/register', auth.register);

serve.put('/users/changePassword', authenticateToken, auth.changePassword);

serve.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

//Add ip to database
serve.post('/addIp', authenticateToken, (req, res) => {
  // console.log(req);
  //parse ip from json request

  let ip = req.body.ip;
  let os = req.body.os || "win";
  console.log(ip, os);
  // res.send("Worked")
  ipop.insertIp({ ip: ip, os: os }).then((resp) => {
    console.log(resp);
    res.send({ "res": resp });
  }).catch((err) => {
    console.log(err);
    res.send({ "res": err });
  }).finally(() => {
    console.log("finally");
  })
})
serve.get('/discover_ip', authenticateToken, async (req, res) => {
  discover_ip.discoverIP().then((resp) => {
    console.log(resp);
    // res.send({ "res": resp });
    helper(resp)
      .then((resp) => {
        console.log("Resolved", resp);
        res.send({ "res": resp });
      }
      ).catch((err) => {
        console.log(err);
        res.send({ "err": err });
      });
  });
});

function helper(resp) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < resp.length; i++) {
      let ip = resp[i].ip;
      let os = resp[i].os || "win";
      console.log(ip, os);
      // res.send("Worked")
      ipop.insertIp({ ip: ip, os: os });
    }
    resolve("inserted");
  })


}
/************************Electron ******************/
const createWindow = async () => {
  const win = new BrowserWindow({
    // full screen default
    height: 800,
    width: 1200
  })
  await createTables();
  let isSuperAdminCreated = await upop.countSuperAdmin();
  console.log(isSuperAdminCreated);
  if (isSuperAdminCreated > 0) {
    win.loadFile('html/login.html')
  } else {
    win.loadFile('html/register.html')
  }
  // discoverIP();
}

app.whenReady().then(() => {
  createWindow()
})

exports.serve = serve;


// // //************************************Scheduler /************************************/
// // //Scheduler to schedule the task to run every day every hour
// // var j = schedule.scheduleJob('1 * * * *', schedulerForMail);

// //Scheduler helper function
// function schedulerForMail() {

//   // console.log('The answer to life, the universe, and everything!');
//   //Call the function to call all the ip's and get the latest software installed
//   ipop.getIpList().then((resp) => {
//     // console.log(resp);
//     for (let i = 0; i < resp.length; i++) {
//       if (resp[i].isMonitored == 0) {
//         continue
//       }
//       axios.get(`http://${resp[i].ip}:5000/installedSoftware`)
//         .then((response) => {
//           // console.log(response.data);
//           return [response.data, resp[i].ip];
//         }).then((data) => {
//           ipSoftwareInfo = data[0]["res"];
//           // console.log(ipSoftwareInfo);
//           sftop.deleteAllSoftwaresForIp(data[1]);
//           for (let i = 0; i < ipSoftwareInfo.length; i++) {
//             ipSoftwareInfo[i].ip = data[1];
//             sftop.insertSoftware(ipSoftwareInfo[i]);
//           }
//           // console.log(ipSoftwareInfo);
//         }).catch(() => console.log("Cannot Fetch Latest Data"))
//         .then(() => {
//           malop.getMaliciousSoftwareList().then((maliciousSoftwareList) => {
//             sftop.updateMalciousStatus(maliciousSoftwareList, 1).then((resp) => {
//               if (resp === "Success") {
//                 sftop.getSoftwareList(req.params["ip"]).then((resp) => {
//                   let mailOptions = {

//                     from: 'kingtemp204000@zohomail.in',
//                     to: 'abdurrahman@iitbhilai.ac.in',
//                     subject: `Malicious Software Detected in IP: ${req.params["ip"]}`,
//                     text: `Malicious Softwares are installed on the system:\n ${resp}`,
//                   };
//                   if (resp.length > 0) {
//                     transporter.sendMail(mailOptions, (error, info) => {
//                       if (error) console.log("Error in sending mail, you can log if you want");
//                       else console.log('Email sent: ' + info.response);
//                     });
//                   }

//                   // console.log(resp);
//                   res.send({ "res": resp });
//                 });
//               }
//             })
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         }).finally(() => {
//           console.log("finally");
//         });
//     }
//   });
// }


// //Just calling function one time, when the app is started
// schedulerForMail();
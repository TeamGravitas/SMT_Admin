const { app, BrowserWindow } = require('electron')
const express = require('express')
const ipop = require("./dbModel/iplistmgr");
const sftop = require("./dbModel/softwarelistmgr");
const upop = require("./dbModel/usersmgr");
const auth = require("./authServer");
const { authenticateToken, isAuthentic } = require('./dbModel/authenticateHelper');
const cors = require('cors');
const axios = require('axios').default;


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
}

/********************Routes *********************/

serve.get('/', authenticateToken, (req, res) => {
  ipop.getIpList().then((resp) => {
    // console.log(resp);
    res.send({ "res": resp });
  })
});

serve.get('/getSoftware/:ip', authenticateToken, (req, res) => {

  axios.get(`http://${req.params["ip"]}:5000/installedSoftware`)
    .then((response) => {
      // console.log(response.data);
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
    .catch(() =>console.log("Cannot Fetch Latest Data"))
    .then(() => {
      sftop.getSoftwareList(req.params["ip"]).then((resp) => {
        // console.log(resp);
        res.send({ "res": resp });
      })
    });
});

serve.put('/updateMonitoredStatus', authenticateToken, (req, res) => {
  let data = req.body;
  // console.log(data);
  ipop.updateMonitoredStatus(data.ipList, data.isMonitored). then((resp) => {
    // console.log(resp);
    res.send({"res": resp});
  })
})

serve.post('/users/login', auth.login);

serve.post('/users/register',auth.register);

serve.put('/users/changePassword', authenticateToken,  auth.changePassword);

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
  if(isSuperAdminCreated>0){
    win.loadFile('login.html')
  }else{
    win.loadFile('register.html')
  }
}

app.whenReady().then(() => {
  createWindow()
})





exports.serve = serve;
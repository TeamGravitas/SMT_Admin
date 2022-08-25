require('dotenv').config()

const jwt = require('jsonwebtoken');
const { authenticateToken, isAuthentic } = require('./dbModel/authenticateHelper');
const upop = require("./dbModel/usersmgr.js");


exports.login = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        res.json({ err: "Send Data, username password" });
        return;
    }
    // console.log(username, password);
    flag = await isAuthentic(username, password)
    if (flag) {
        let userData = { username: username, time: 2 }
        const accessToken = jwt.sign(userData, "adfsadyfusdfk23js@d#a")         // generateAccessToken(userData)
        res.json({ accessToken: accessToken })
    }
    else
        res.json({ err: "Authentication Failed" });
}


exports.register = async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let isSuper = req.body.isSuperAdmin;
    if (!username || !password) {
        res.json({ err: "Send Data, username password" });
        return;
    }
    // console.log(username, password,isSuper);
    let user = {
        username: username,
        password: password
    }
    await upop.insertUP(user);
    flag = await isAuthentic(username, password)
    if (flag) {
        let userData = { username: username, time: 2 }
        const accessToken = jwt.sign(userData, "adfsadyfusdfk23js@d#a")         // generateAccessToken(userData)
        res.json({ accessToken: accessToken })
    }
    else
        res.json({ err: "Authentication Failed" });
}

exports.changePassword = async (req, res) => {
    let password = req.body.new;
    if (!password) {
        res.json({ err: "Send Data, new password" });
        return;
    }

    // console.log(req.user);
    
    let user = {
        username: req.user,
        password: password
    }
    flag = await isAuthentic(req.user, req.body.old)
    if (flag) {
        await upop.updatePassword(user);
        let userData = { username: req.user, time: 2 }
        const accessToken = jwt.sign(userData, "adfsadyfusdfk23js@d#a")         // generateAccessToken(userData)
        res.json({ accessToken: accessToken })
    }
    else
        res.json({ err: "Authentication Failed" });
}

// {
//     upop.createUsersTable().then(() => {
//         temp = {
//             username: "admin",
//             password: "123"
//         }
//         upop.insertUP(temp);
//     });

// }
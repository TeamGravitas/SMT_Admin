const dbmgr=require("./dbmgr")
const db=dbmgr.db
const jwt=require('jsonwebtoken');

//Functions***************************************************
async function isAuthentic(usernameInput,passwordInput){
    let flag=await dbGetPromise(usernameInput,passwordInput).catch(err=>console.log(err));
    // console.log(flag);
    return flag==true;
}

function dbGetPromise(usernameInput,passwordInput){
    return new Promise((resolve,reject)=>{
        sql="SELECT password from users where username=?";
        db.get(sql,[usernameInput],(err,res)=>{
            if(err){reject("Err: ",err.message);
                return;
                }
            if(res==undefined||res.password==undefined)return reject(false);
            // console.log(res.password,passwordInput);
            // if()
            resolve(res.password==passwordInput);
            
        });
    });
}


function authenticateToken(req, res, next) {
    // console.log(req);
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(authHeader);
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, "adfsadyfusdfk23js@d#a", (err, user) => {
    //   console.log(err)
      if (err) return res.sendStatus(403)
    //   console.log("Username is: ",user.username)
      req.user = user.username;
    //   console.log(user);
        //If wish we can se whether  username is present in userSet, although if token is valid its fine
      next()
    })
}

module.exports = exports = {
    authenticateToken:authenticateToken,
    isAuthentic:isAuthentic

};
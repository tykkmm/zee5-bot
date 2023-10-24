const { findKey } = require("../../db/keyv.mongo");


const verifyApikey =async (req,res,next)=>{
    const headers =  req.headers;
    const key ='x-api-key';
    if(headers[key]){
        const req_key = headers[key];
        const kv = req_key.split("+");
        // console.log(kv)
        if(kv.length !==2){
          return  res.sendStatus(401);
        }
        const userId  = kv[0];
        const keyValue = kv.pop();
        const dbRes = await findKey(userId);
        if(!dbRes){
            return res.sendStatus(401);
        }
        if(dbRes.value === keyValue){
            req.body.user = userId;
            next();
        }else{

            return res.sendStatus(401);
        }
        // console.log(headers);
        // next();
    }else{
        return res.sendStatus(401);
    }
 };
 
 
 module.exports  = {
     verifyApikey
 };
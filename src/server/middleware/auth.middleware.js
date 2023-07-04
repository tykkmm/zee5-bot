const verify = async (req,res,next)=>{
    const headers = req.headers;
    const {key} = headers;
    if(key !==process.env.API_KEY){
        res.sendStatus(400);
    }else{

        next();
    }
}

module.exports = verify;
const mongoose = require('mongoose');
require('dotenv').config();
const dbList = {
    "url1":"mongodb://localhost:27017/udemy_keys",
    "url2":"mongodb://0.0.0.0:27017/udemy_keys",
    "url3":"mongodb://127.0.0.0:27017/udemy_keys",
    remote : `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@udbot.qxxaia0.mongodb.net/`
};
const connectDb = ()=>{

    const {url1,url2,url3,remote} = dbList;
    const currentUrl = remote;
    // const currentUrl = url2;
    mongoose.connect(currentUrl).then(()=>console.log(`connected to DB`)).catch(err => console.log(err));
};
module.exports = {connectDb};


// connectDb();

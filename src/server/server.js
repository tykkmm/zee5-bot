// require('dotenv').config();
const Express = require('express');
const cors = require('cors');

// const { connectDb } = require('./src/db/db');
const { verifyApikey } = require('./middleware/verify.api.key');
const { addCourseInfo } = require('../db/udemy.course.info');

const app = Express();

console.clear();

app.use(cors());
app.use(Express.json());
app.use(verifyApikey);

app.get('/',(req,res)=>{
    res.json({message : "home"});
});
//get total number of  data in DB
// app.get('/count',(req,res)=>{
//     res.json({message : "count"});
// });

// add enw data in db
app.post('/add',async (req,res)=>{
    const bodyData = req.body;
    try {
        const rs = await addCourseInfo(bodyData);
        if(rs.error){
            return res.sendStatus(400);
        }else{
            return res.json({message : 'done'})
        }
    } catch (error) {
        
        res.json({message : req.body.pssh});
    }
    
});

// delete a data by pssh
app.delete('/rm',(req,res)=>{

});


module.exports = {
    expressServer : app
}

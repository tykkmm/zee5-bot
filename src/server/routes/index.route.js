const router = require('express').Router();

const serverRoute = require('./server.route');
const userRoute = require('./user.route');

router.get('/',(req,res)=>{
    res.send('this is index route');
});
router.get('/ping',(req,res)=>{
    res.send({message : "ok"}).status(204);
});


router.use('/servers',serverRoute);
router.use('/users',userRoute);

module.exports = router;

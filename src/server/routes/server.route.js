const { getGuildRoles, getGuildChannels } = require('../controller/guild.controller');


const router = require('express').Router();

router.get('/',(req,res)=>{
    res.send('this is server home route');
});
router.get('/:server_id/roles',async (req,res)=>{
    const {server_id} = req.params;
    if(server_id){
        const roles =await getGuildRoles(server_id);
        if(roles){
            return res.json(roles);
        }else{
            return res.sendStatus(404);
        }
    }else{
        return res.sendStatus(404);
    }
    // const {guilds} = client;
    // res.send('this is server roles route');
});
router.get('/:server_id/channels',async (req,res)=>{
    const {server_id} = req.params;
    if(server_id){
        const channels =await getGuildChannels(server_id);
        if(channels){
            return res.json(channels);
        }else{
            return res.sendStatus(404);
        }
    }else{
        return res.sendStatus(404);
    }
});
router.get('/:server_id/role/:role_id',(req,res)=>{
    // console.log(req.params);

    const data = req.body;
    console.log(data);
    res.send('this is server roles route');
});


module.exports = router;

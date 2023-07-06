const { SlashCommandBuilder, Message, codeBlock } = require("discord.js");
const { genericEmbedMessage, restartRenderService } = require("../../helpers/utility");
const { admin_user } = require("../../configs/bot.config");


module.exports = {
    type: "legacy",
    info: {
        name: "r",
        allowed:[...admin_user ]
    },
    run: async function(msg, client)  {
        if(this.info.allowed){
            if(this.info.allowed.includes(msg.author.id)==false){
                msg.channel.send({content:'You are not allowed to use this command!'});
                return ;
            }
        }
   

        let apiStat = await restartRenderService();
        const em = genericEmbedMessage([
            { name: "\nOperatin Result", value: codeBlock(apiStat) },
        ], {
            inline: false,
            title: "Restart CDM API",
            description:`\u200b`
        });
        return msg.channel.send({ embeds: [em] });
    }
};

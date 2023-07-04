const { SlashCommandBuilder ,Message} = require("discord.js");
const { genericEmbedMessage } = require("../../helpers/utility");

module.exports = {
    type:'legacy',
    info:{
        name:'uptime'
    },
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Replies with bot uptime!'),
    run:async (msg,client)=>{
        let dif = Date.now()-msg.client.start_time;

        let stat = `${dif} sec`
        const em = genericEmbedMessage([{name:'uptime',value:stat}],{
            inline : false,
            title:"Uptime Status"
        });
        return msg.channel.send({embeds:[em]});
    },
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.followUp('Pong!');
	},
};
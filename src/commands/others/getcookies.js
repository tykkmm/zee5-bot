const { SlashCommandBuilder ,Message, EmbedBuilder, Colors} = require("discord.js");
const { genericEmbedMessage, getUdemyCookies } = require("../../helpers/utility");

module.exports = {
    type:'legacy',
    info:{
        name:'cookies'
    },
	data: '',
    run:async (msg,client)=>{
        const cookieLink = await getUdemyCookies();
        // const cookieLink = 'https://google.com';
		if(cookieLink){
			// console.log(msg.author)
			const em = new EmbedBuilder()
						.setTitle("Udemy Cookies")
						.setDescription(`[Grab You Udemy Cookies 🍪🍪🍪](${cookieLink})`)	
						.setTimestamp()
						.addFields([{
							name:`Requested By:`,
							value:`<@${msg.author.id}>`
						}])
						.setColor(Colors.Gold);

			return msg.channel.send({embeds:[em]});
		}else{
			return msg.channel.send(`I am a noob bot.`)
		}
    },
	async execute(interaction) {
		await interaction.deferReply();
		await interaction.followUp('cookieeeeee!');
	},
};
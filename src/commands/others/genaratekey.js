const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('getkey')
		.setDescription('generate udemy keys!')
        .addStringOption( (n)=>{
          return  n.setName('pssh').setDescription('content PSSH').setRequired(true);
        })
		.addStringOption(l =>{
			return l.setName('licence_url').setDescription('video licence url').setRequired(true);
		}),
	async execute(interaction ) {
        await interaction.deferReply();
		const pssh = interaction.options.getString('pssh');
		const lic_url = interaction.options.getString('licence_url');

        let result = [pssh,lic_url];
        // if(!count){
        //     result = interaction.client.logger;
        // }else{
        //     result = interaction.client.logger.slice(0,count);
        // }
        
		await interaction.followUp(`${JSON.stringify(result)}`);
		
	},
};
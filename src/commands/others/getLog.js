const { SlashCommandBuilder ,} = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('log')
		.setDescription('get Stored log!')
        .addIntegerOption( (n)=>{
          return  n.setName('count').setDescription('get last n logs.').setMinValue(0).setRequired(true);
        }),
	async execute(interaction ) {
        await interaction.deferReply();
		const count = interaction.options.getInteger('count');
        let result = [];
        if(!count){
            result = interaction.client.logger;
        }else{
            result = interaction.client.logger.slice(0,count);
        }
        
		await interaction.followUp(`${JSON.stringify(result)}`);
		
	},
};
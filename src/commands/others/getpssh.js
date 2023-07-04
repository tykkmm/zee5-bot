const { SlashCommandBuilder ,ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');
const {execSync} = require('child_process');
const path = require('path');



const getPssh=async (mpdurl)=>{
    if(!mpdurl.startsWith('https://www.udemy.com/')){
        return undefined;
    }
    try {
        const psshPy = path.resolve(__dirname,'./../../../mrd/py_file/pssh_udemy.py');
        const rawResult = execSync(`python3 ${psshPy} "mpdurl=${mpdurl}"`,{windowsHide:true});

        const result = rawResult.toString();

        return result;
        
    } catch (error) {
		// console.log(error.message)
        return undefined;
    }

}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cookies')
		.setDescription('get udemy cookies!'),
	async execute(interaction) {

		const modal = new ModalBuilder()
		.setCustomId('pssh_modal')
		.setTitle('Get PSSH Only');

		// Create the text input components
		const psshInput = new TextInputBuilder()
		.setMinLength(120)
		.setMaxLength(1000)
		.setStyle(TextInputStyle.Paragraph)
		.setCustomId('mpd_link_input')
		.setLabel('Enter mpd file link!')
		.setPlaceholder('Give me mpd link or i sleep.')
		.setRequired(true);
		
		const firstActionRow = new ActionRowBuilder().addComponents(psshInput);

		modal.addComponents(firstActionRow);
		
		await interaction.showModal(modal);
	},
	getPssh
};
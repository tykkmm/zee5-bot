const { SlashCommandBuilder, Message, codeBlock } = require("discord.js");
const { _restartCommands_ } = require("../command.handler");

module.exports = {
    info: {
        name: "reload",
    },
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("reload bot commands!"),
    async execute(interaction) {
        await interaction.deferReply();
   
       await _restartCommands_(process.discordClient);

        await interaction.followUp("reload done!");
    },
};

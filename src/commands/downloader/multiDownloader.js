const { SlashCommandBuilder } = require("discord.js");
const { view,modalId} = require("../../modals/rapidLink.modal");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("multi-download")
        .setDescription("Downloads multiple Links"),
    async execute(interaction) {
        const modal = view(modalId);
        await interaction.showModal(modal);
    },
};

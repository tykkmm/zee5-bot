const { SlashCommandBuilder, Message, codeBlock } = require("discord.js");
const { genericEmbedMessage } = require("../../helpers/utility");
const { default: axios } = require("axios");
const { countCourseData } = require("../../db/udemy.course.info");
const { drmkeyCount } = require("../../db/udemy.keys.model");


module.exports = {
    type: "legacy",
    info: {
        name: "info",
    },
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Replies info document count!"),
    run: async (msg, client) => {
        const iCnt =await countCourseData();
        const completedCount = await drmkeyCount();
        const em = genericEmbedMessage([
            { name: "Total key", value: codeBlock(completedCount) },
            { name: "Total PSSH", value: codeBlock(iCnt) }
        ], {
            inline: false,
            title: "key count",
            description:`\u200b`
        });
        return msg.channel.send({ embeds: [em] });
    },
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.followUp("Pong!");
    },
};


const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
// const { testCdm } = require("../../helpers/drm.helper");

const { admin_user } = require("../../configs/bot.config");
const { deleteKey} = require("../../db/keyv.mongo");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("delete-key")
        .setDescription("delete key & value!")
        .addStringOption((n) => {
            return n
                .setName("key")
                .setDescription("key")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _key = interaction.options.getString("key");
        // const _value = interaction.options.getString("value");
        //check if user is allwoed

        if(!admin_user.includes(interaction.user.id)){
            return (await interaction.followUp({content: `you are not allowed.`}));
        }
        // console.log(_cdm);
        try {
            
            let data = await deleteKey(_key);
            return (await interaction.followUp({content: `Data Deleted!`}));
        } catch (error) {
            
            return (await interaction.followUp({content: `couldn't delete`}));
        }
    },
};

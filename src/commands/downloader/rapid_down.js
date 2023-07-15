const __gator_key = 'gator';
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
// const { testCdm } = require("../../helpers/drm.helper");

const { admin_user } = require("../../configs/bot.config");
const { findKey} = require("../../db/keyv.mongo");
const { getRapidDownloadLink } = require("../../helpers/utility");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rapid-down")
        .setDescription("get download link!")
        .addStringOption((n) => {
            return n
                .setName("link")
                .setDescription("link to download!")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _targetLink = interaction.options.getString("link");
        //check if user is allwoed
        try {
            // console.log(data);
            const finalLink = await getRapidDownloadLink(_targetLink);
            if(!finalLink){
                throw new Error('something went wrong!');
            }
            const msgEmb = new EmbedBuilder()
                .setTitle(`Rapidgator Downloader:`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setFooter({ text: `requested by : ${interaction.user.id}` })
                .addFields([
                    {
                        name : '\u200b',
                        value : `[Download your file](${finalLink})`
                    },
                    {
                        name: `Requested By:`,
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    },
                ]);
                
            await interaction.followUp({ embeds: [msgEmb] });

        } catch (error) {
            
            const errEm = new EmbedBuilder()
                .setTimestamp()
                .setTitle("key value info:")
                .setDescription(`Reason : ${error?.message}`)
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [errEm] });
            return;
        }
        
        // const { status, wv ,error} = data;
    },
};

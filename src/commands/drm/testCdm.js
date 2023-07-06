
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const { testCdm } = require("../../helpers/drm.helper");
const { admin_user } = require("../../configs/bot.config");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("test a CDM")
        .addStringOption((n) => {
            return n
                .setName("cdm")
                .setDescription("cdm name")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _cdm = interaction.options.getString("cdm");
        //check if user is allwoed

        if(!admin_user.includes(interaction.user.id)){
            return (await interaction.followUp({content: `you are not allowed.`}));
        }
        // console.log(_cdm);
        let data = await testCdm(_cdm);
        const { status, wv ,error} = data;
        
        if (status == "error" || error) {
            const errEm = new EmbedBuilder()
                .setTimestamp()
                .setTitle("Test CDM")
                .setDescription(`Reason : ${data?.error}`)
                .addFields([
                    {
                        name: "CDM",
                        value: `${_cdm}`,
                    }
                ])
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [errEm] });
            return;
        } else {
            const keydata = typeof wv == "string" ? JSON.parse(wv) : wv;
            const { cdm, pssh, result, proxy, licence_url } = keydata;
            if (!result.length) {
                await interaction.followUp(`No key found!`);
                return;
            }
            const msgEmb = new EmbedBuilder()
                .setTitle(`Udemy DRM key`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setFooter({ text: `requested by : ${interaction.user.id}` })
                .addFields([
                    {
                        name: "CDM",
                        value: `${cdm.split("/").pop().replace(".wvd", "")}`,
                        inline: true,
                    },
                    {
                        name: "Proxy",
                        value: `${proxy}`,
                        inline: true,
                    },
                    {
                        name: "PSSH",
                        value: `${pssh}`,
                        inline: false,
                    },
                    {
                        name: "key",
                        value: `${result.map(v => codeBlock(v)).join("\n")}`,
                        inline: false,
                    },
                    {
                        name: `Requested By:`,
                        value: `<@${interaction.user.id}>`,
                        inline: true,
                    },
                ]);

            await interaction.followUp({ embeds: [msgEmb] });
        }
    },
};

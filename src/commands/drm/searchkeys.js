
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const { findKeyByPssh } = require("../../db/udemy.keys.model");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Search for keys!")
        .addStringOption((n) => {
            return n
                .setName("pssh")
                .setDescription("content PSSH")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _pssh = interaction.options.getString("pssh");

        let data = await findKeyByPssh(_pssh);
        // console.log(data)
        const result = data;
        if (!data) {
            const errEm = new EmbedBuilder()
                .setTimestamp()
                .setTitle("🔍Search  keys")
                .setDescription(`Nothing Found`)
                .addFields([
                    {
                        name: "PSSH",
                        value: `${_pssh}`,
                    },
                ])
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [errEm] });
            return;
        } else {
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
                        name: "PSSH",
                        value: `${_pssh}`,
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

const { default: axios } = require("axios");
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const { insertKey } = require("../../db/udemy.keys.model");

const renderkey = async (pssh, lic_url) => {
    // const postUrl = prov;
    const postUrl = `${process.env.api_url}/licence`;
    const lic_data = JSON.stringify({
        pssh: pssh,
        lic_url: lic_url,
    });
    try {
        const axr = await axios.post(postUrl, lic_data, {
            headers: {
                "X-API-Key": process.env.api_key,
                "Content-Type": "application/json",
            },
        });
        const data = axr.data;
        return data;
    } catch (error) {
        console.log(error);
        return { status: "error", error: error.message };
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("getkey")
        .setDescription("generate udemy keys!")
        .addStringOption((n) => {
            return n
                .setName("pssh")
                .setDescription("content PSSH")
                .setRequired(true);
        })
        .addStringOption((l) => {
            return l
                .setName("licence_url")
                .setDescription("video licence url")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _pssh = interaction.options.getString("pssh");
        const _lic_url = interaction.options.getString("licence_url");

        let data = await renderkey(_pssh, _lic_url);
        const { status, wv } = data;

        if (status == "error") {
            const errEm = new EmbedBuilder()
                .setTimestamp()
                .setTitle("Udemy DRM key")
                .setDescription(`Reason : ${data?.error}`)
                .addFields([
                    {
                        name: "PSSH",
                        value: `${_pssh}`,
                    },
                    {
                        name: "licence Url",
                        value: _lic_url,
                    },
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
			await insertKey(_pssh,result);
        }
    },
};

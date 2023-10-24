
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
// const { testCdm } = require("../../helpers/drm.helper");

const { admin_user } = require("../../configs/bot.config");
const { insertSingleKey ,findKey} = require("../../db/keyv.mongo");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-key")
        .setDescription("set key & value!")
        .addStringOption((n) => {
            return n
                .setName("key")
                .setDescription("key")
                .setRequired(true);
        })
        .addStringOption((n) => {
            return n
                .setName("value")
                .setDescription("value")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _key = interaction.options.getString("key");
        const _value = interaction.options.getString("value");
        //check if user is allwoed

        if(!admin_user.includes(interaction.user.id)){
            return (await interaction.followUp({content: `you are not allowed.`}));
        }
        // console.log(_cdm);
        try {
            let data = await insertSingleKey(_key,_value);
            
            const sourceStr = _value;
            const part1 = Math.ceil(sourceStr.length/4);
            const modifiedStr = ("*".repeat(sourceStr.length - part1)+sourceStr.slice(-part1));
            // console.log(data);
            // console.log(await findKey('ssid'));
            // const keydata = typeof wv == "string" ? JSON.parse(wv) : wv;
            // const { cdm, pssh, result, proxy, licence_url } = keydata;
            const msgEmb = new EmbedBuilder()
                .setTitle(`Set key to DB:`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setFooter({ text: `requested by : ${interaction.user.id}` })
                .addFields([
                    {
                        name: "key",
                        value: _key,
                        inline: false,
                    },
                    {
                        name: "value",
                        value: modifiedStr,
                        inline: false,
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
                .setTitle("Set key-value:")
                .setDescription(`Reason : ${error.message}`)
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [errEm] });
            return;
        }
        
        // const { status, wv ,error} = data;
    },
};

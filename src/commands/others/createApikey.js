const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
const crypto = require("crypto");

const { admin_user } = require("../../configs/bot.config");
const { insertSingleKey } = require("../../db/keyv.mongo");

const randomkey = (id) => {
    const rand = crypto.randomBytes(24).toString("hex");
    // const final = `${id}+${rand}`.trim();?
    return rand;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName("create-api-key")
        .setDescription("Create a new api key CDM")
        .addStringOption((n) => {
            return n
                .setName("user_key")
                .setDescription("unique user")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _user_id = interaction.options.getString("user_key");
        //check if user is allwoed

        if (!admin_user.includes(interaction.user.id)) {
            return await interaction.followUp({
                content: `you are not allowed.`,
            });
        }
        // console.log(_cdm);
        const __key__ = randomkey(_user_id);
        const dbResult = await insertSingleKey(_user_id,__key__);
        if(!dbResult){
            if (!__key__) {
                await interaction.followUp(`Could not save api key to database!`);
                return;
            }
        }
        const msgEmb = new EmbedBuilder()
            .setTitle(`Info Api key`)
            .setTimestamp()
            .setColor(Colors.Green)
            .setFooter({ text: `requested by : ${interaction.user.id}` })
            .addFields([
                
                {
                    name: _user_id,
                    value: __key__,
                    inline: false,
                },
                {
                    name: `Requested By:`,
                    value: `<@${interaction.user.id}>`,
                    inline: true,
                },
            ]);

        await interaction.followUp({ embeds: [msgEmb] });
    },
};

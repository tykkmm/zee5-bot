
const {
    SlashCommandBuilder,
    EmbedBuilder,
    codeBlock,
    Colors,
} = require("discord.js");
// const { testCdm } = require("../../helpers/drm.helper");

const { admin_user } = require("../../configs/bot.config");
const { findKey} = require("../../db/keyv.mongo");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("view-key")
        .setDescription("get key stats!")
        .addStringOption((n) => {
            return n
                .setName("key")
                .setDescription("key to look up!")
                .setRequired(true);
        }),
    async execute(interaction) {
        await interaction.deferReply();
        const _key = interaction.options.getString("key");
        //check if user is allwoed

        if(!admin_user.includes(interaction.user.id)){
            return (await interaction.followUp({content: `you are not allowed.`}));
        }
        // console.log(_cdm);
        try {
            const data = await findKey(_key);
            // console.log(data);
            const fields = [
                {
                    name: "key",
                    value: _key,
                    inline: false,
                }];
            if(data){
                const _createdAt = {name : "Last Updated:",value : data.updatedAt.toLocaleDateString()};
                const _value = {name : "Value:",value : data.value};

                fields.push(_value,_createdAt);
            }
            const msgEmb = new EmbedBuilder()
                .setTitle(`key-value info:`)
                .setTimestamp()
                .setColor(Colors.Green)
                .setFooter({ text: `requested by : ${interaction.user.id}` })
                .addFields([
                    ...fields,
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
                .setDescription(`Reason : ${error.message}`)
                .setColor(Colors.Red);
            await interaction.followUp({ embeds: [errEm] });
            return;
        }
        
        // const { status, wv ,error} = data;
    },
};

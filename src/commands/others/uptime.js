const { SlashCommandBuilder, Message, codeBlock } = require("discord.js");
const { genericEmbedMessage } = require("../../helpers/utility");
const { default: axios } = require("axios");

const getUptime = (timeInSeconds) => {
    let days = Math.floor(timeInSeconds / (24 * 3600));
    timeInSeconds %= 24 * 3600;
    let hours = Math.floor(timeInSeconds / 3600);
    timeInSeconds %= 3600;
    let minutes = Math.floor(timeInSeconds / 60);

    return `${days}D:${hours.toString().padStart(2, "0")}H:${minutes
        .toString()
        .padStart(2, "0")}M`;
};
const cmdApiUpTime = async () => {
    try {
        const res = await axios.get(`${process.env.API_URL}/ping`, {
            headers: {
                "X-API-Key": process.env.API_KEY,
            },
        });
        const { data } = res;
        if (data && data.sec) {
            return getUptime(Math.floor(Number(data.sec)));
        }
        return undefined;
    } catch (error) {
        console.log(error);
        return `${error?.message}`;
    }
};

module.exports = {
    type: "legacy",
    info: {
        name: "uptime",
    },
    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Replies with bot uptime!"),
    run: async (msg, client) => {
        let differnce = Math.floor(Date.now() - msg.client.start_time) / 1000;

        let botStat = getUptime(differnce);

        let apiStat = await cmdApiUpTime();

        const em = genericEmbedMessage([
            { name: "Discord Bot Uptime", value: codeBlock(botStat) },
            {name:"CDM API uptime",value : codeBlock(apiStat)}
        ], {
            inline: false,
            title: "Uptime Status",
            description:`\u200b`
        });
        return msg.channel.send({ embeds: [em] });
    },
    async execute(interaction) {
        await interaction.deferReply();
        await interaction.followUp("Pong!");
    },
};

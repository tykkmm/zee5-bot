const { client } = require("../../../bot")

const getGuildRoles = async (guildId)=>{
    const botClient = process.discordClient;
    if(!guildId){
        return false;
    }
    const singleGuild = botClient.guilds.cache.find(g=> g.id===guildId);
    if(!singleGuild){
        return false;
    }
    const rolesCache = singleGuild.roles.cache;
    return rolesCache;
};
const getGuildChannels = async (guildId)=>{
    // const botClient = client;
    const botClient = process.discordClient;
    if(!guildId){
        return false;
    }
    const singleGuild = botClient.guilds.cache.find(g=> g.id===guildId);
    if(!singleGuild){
        return false;
    }
    const channels = singleGuild.channels.cache;
    return channels;
};

module.exports = {
    getGuildRoles,
    getGuildChannels
}
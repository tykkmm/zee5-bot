const { Collection,REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path')
const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_ID= process.env.BOT_ID;
const serverId = process.env.SERVER_ID;

const readSubFolder = (obj) => {
    // console.log(obj)
    const pathName = path.join(__dirname, obj)
    const fileList = fs
        .readdirSync(pathName, {
            withFileTypes: true,
        })
        .filter((v) => v.isFile() && v.name.endsWith('.js'))
        .map((v) => path.join(pathName, v.name))
    return fileList
};

const readFolder = (folderPath)=>{
    // console.log(__dirname)
    const fileList = fs
        .readdirSync(__dirname, {
            withFileTypes: true,
        })
        .filter((v) => v.isDirectory())
        .map((v) => readSubFolder(v.name))
        .flat();
    return fileList;
}

const slashCommandHandler = () => {
    const commandCollection = new Collection();
    const legacyCommands = new Collection();
    // readFolder('others')
    const fileList = readFolder();
    for (let i = 0; i < fileList.length; i++) {
        const command = require(fileList[i]);
        if(command?.type){
            legacyCommands.set(command.info.name,command);
        }
        else{
                commandCollection.set(command.data.name, command)
            }
        
    }
    return ({
        "newcommand":commandCollection,
        "legacy":legacyCommands
    });
};

const restCommandHandler = async ()=>{
    const commands = [];
    const commandFiles = readFolder();
    for (const file of commandFiles) {
        // console.log(`file =`,file);
        const command = require(file);
        if(command?.type==undefined){
            commands.push(command.data.toJSON());
        }
    }
    const rest = new REST().setToken(BOT_TOKEN);
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationGuildCommands(BOT_ID, serverId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

module.exports = {
    slashCommandHandler,
    restCommandHandler
}

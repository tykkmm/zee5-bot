require('dotenv').config();
console.clear();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Guild, codeBlock } = require('discord.js');
const { _restartCommands_} = require('./src/commands/command.handler');
const { prefix } = require('./src/configs/bot.config');
const { connectDb } = require('./src/db/db.connect');
const { restartRenderService, multiLinkDownloader } = require('./src/helpers/utility');
const {expressServer} = require('./src/server/server');
//modals
const {response : rapidLinkResponse , modalId : rapidModalId} = require('./src/modals/rapidLink.modal');
const __PORT__ = process.env.PORT ||  3089;

// const {getPssh} = require('./src/bot/commands/others/getpssh');
// const { writeLogs } = require('./src/helpers/utility');

// const logFilePath = path.resolve("./src/bot/logs/"+Date.now()+".txt");

const BOT_TOKEN = process.env.BOT_TOKEN

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
    ],
});

process.discordClient = client;
client.logger = new Array();

 _restartCommands_(client);

connectDb();
// restCommandHandler();

// only listen for legacy chat input command

client.on(Events.MessageCreate,async msg=>{

	if(msg.author.bot) return;
	if(!msg.content.startsWith(prefix)) return;
	const slice_pos = (msg.content.indexOf(' ') < 0  ) && msg.content.length;
	const cmd = msg.content.slice(prefix.length,slice_pos);
	let res = client.legacy.get(cmd);
	if(res){
		console.log(`command is ->${cmd}`);
		await res.run(msg,client);
	}
});


client.on(Events.InteractionCreate, async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	// console.log('=>',command);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

});


// only listen for modal submit event
client.on(Events.InteractionCreate,async interaction => {
	if (!interaction.isModalSubmit()) return;


	// console.log(`an interaction output`);
	if(interaction.customId ===  rapidModalId){
		 rapidLinkResponse(interaction);
	}
	else if (interaction.customId === 'pssh_modal') {

		await interaction.deferReply();
		const inputLink = interaction.fields.fields.first().value;
		client.logger.push({
			id: interaction.user.id,
			input : [inputLink],
			time:Date.now()
		});
		try {
			// interaction.followUp({ content: escl+__pssh__+escl });
			const __pssh__ = await getPssh(inputLink);
			interaction.followUp({ content: codeBlock(__pssh__) });

		} catch (error) {
			interaction.followUp({content :`failed to get PSSH!`});
		}
		
	}else if(interaction.customId==='genkey_modal'){

		// {
		// 	'mpd_input' => {
		// 	  value: 'asdfasdDiscord ModalsDiscord Modals',
		// 	  type: 4,
		// 	  customId: 'mpd_input',
		// 	  components: undefined
		// 	},
		// 	'token_input' => {
		// 	  value: 'Discord ModalsDiscord Modals',
		// 	  type: 4,
		// 	  customId: 'token_input',
		// 	  components: undefined
		// 	}
		//   }

		await interaction.deferReply();
		const {fields:{fields}} = interaction;


		// console.log(fields.fin)
		// console.log(Array.from(fields))
		const psshInput =  fields.find( ( v ) => v.customId === 'pssh_input').value;
		const token = fields.find( (v) => v.customId === 'token_input').value;
		client.logger.push({
			id: interaction.user.id,
			input : [psshInput,token],
			time:Date.now()
		});
		if(psshInput && token){
			const __result =await callKeyGenerator(psshInput,token);

			// console.log(__result)
			const {ok,result,error}  = __result;
			if(ok && error?.length === 0 && Array.isArray(result)){
				if(result.length){
					const keyStr = result.join('\n');
					await interaction.followUp({content:codeBlock(keyStr)});
				}else{
					await interaction.followUp({content : codeBlock(`log : cdm =${__result?.cdm} \n Error = ${__result?.error}
					\n pssh=${__result?.pssh.replace(".wvd","")}
					\n licence url = ${__result?.licence_url}
					\n poxy=${__result?.proxy}
					`)});
				}
			}
		}else{
			await interaction.followUp({content:codeBlock('wrong input!')})
		}
	}

});


// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
	console.log(`Last Run : ${new Date().toLocaleTimeString()}`);
	client.start_time = Date.now();
	console.log(`List of the servers : `, c.guilds.cache.map( v => v.name));

    console.log(`Ready to go! Logged in as ${c.user.tag}`);
});


//scheduled job
//restart render service after every 3 hour
setInterval(async ()=>{
	await restartRenderService();
} , 8*60*60*1000);

//start bot
client.login(7355006985:AAEY8ijg4CP-8GgcliRGJja87Tby78QT7To);
//start server
expressServer.listen(__PORT__,()=>{
	console.log(`server running at : http://localhost:${__PORT__}`);
});


module.exports = {
	client : client,
}
// module.exports.client = client;
// module.exports.reloadCommands = setCommands;
// Log in to Discord with your client's token

// startServer();

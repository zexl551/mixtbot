const { Client , MessageEmbed, Message } = require('discord.js');

let client = new Client();

const config = require('./config.json');

let sendPreset = require('./modules/PresetMessages.js');

let Mutes = require('./modules/Mutes.js');

let jsoning = require('jsoning');

let cron = require('node-cron');

let allWordsDB = new jsoning('./db/totalWords.json');

let allMessagesDB = new jsoning('./db/allMessages.json');



let voiceTimes = new jsoning('./db/voiceTimes.json');

let voiceStamps = new jsoning('./db/voicestamp.json');

let expJar = new jsoning('./db/levels.json');

let tmutes = new jsoning('./db/tmutes.json');

let vmutes = new jsoning('./db/vmutes.json');

let cooldowns = new jsoning('./db/cooldowns.json');

let latestMessage = new jsoning('./db/latestMessage.json');

let whitelist = new jsoning('./db/whitelist.json');



sendPreset = new sendPreset();



client.login(config.token);



client.once('ready' , async () => {
    console.log('Ready ' + client.user.username);

	cron.schedule('0 7 * * *', async () => {
		let messageTimestamps = latestMessage.all();
		
		for(let userId in messageTimestamps){ 
			let timestamp = Number(keyPairs[userId].split('|')[0]);
			let quantity = Number(keyPairs[userId].split('|')[1]);

			if(await whitelist.get(userId) != false){
				continue;
			}

			if(timestamp < Date.now() - (1000*60*60*24*30) && quantity < 100){
				try {
					client.guilds.cache.get(config.mainGuild).members.fetch(userId).then(async (member) => {
						if(member && member.kickable){
							await member.kick('inactivitate 30 zile');
						} else {
							latestMessage.delete(userId);
						}
					})
				} catch(err){
					console.log(err);
				}
			}

		}
	});

	cron.schedule('0 0 1 * *', () => {
		latestMessage.clear();
	});
})



client.on('message' , async (message) => {

	const command = message.content.split(' ')[0].replace(config.prefix, '');

    const args = message.content.slice(command.length + 1 ).split(' ');

	let experience = await expJar.get(message.author.id);

	let muteTime = await tmutes.get(message.author.id);

	let inactivityKick = await latestMessage.get(message.author.id);

	if(!inactivityKick && message.guild.id == config.mainGuild){
		latestMessage.set(message.author.id, Date.now() + '|1');
	} else {
		latestMessage.set(message.author.id, `${Date.now()}|${Number(inactivityKick.split('|')[1]) + 1}`)
	}



	if(!await expJar.get(message.author.id)) expJar.set(message.author.id , 0);

	if(!await allMessagesDB.get(message.author.id)) allMessagesDB.set(message.author.id , 0);

	if(!await allWordsDB.get(message.author.id)) allWordsDB.set(message.author.id , 0);



	let execute;

	let now = new Date().getTime();



	if(muteTime > now){

		sendPreset.Muted(message, muteTime );

		return message.delete();

	}



    if(message.author.bot)

        return;



	if(!message.content.startsWith(config.prefix)){

		let words = message.content.split(' ');

		let xp = Math.floor(Math.random() * config.textExperienceRange[1]) + config.textExperienceRange[0];

		expJar.math(message.author.id , "add" , xp)

		allWordsDB.math(message.author.id , "add" , words.length);

		allMessagesDB.math(message.author.id, "add" , 1);

		return;

	}

	let members = await message.guild.members.fetch();

	let cds_state = await cooldowns.get(`state`); 

	let cds_time = await cooldowns.get(`time`); 

	let cds_left = await cooldowns.get(message.author.id); 



	let date_now = new Date();

	

	if(cds_left > date_now.getTime() && cds_state){

		let time_left = cds_left - date_now.getTime();



		message.reply(` trebuie sa mai astepti inca \`${parseInt(time_left/1000)%60} secunde\` pana cand poti folosi alte comenzi.`);



		return;

	}

	

	if(cds_left < date_now.getTime() && cds_state){

		await cooldowns.set(message.author.id, (date_now.getTime()) + cds_time);

	}



	try {

		execute = require(`./commands/${command}.js`)

	}

	catch (err) {

		return message.channel.send(new MessageEmbed().setTitle(`Comandă nu a fost găsită!`).setDescription(`Mergi la \`${config.prefix}ajutor\` pentru a afla care comenzi sunt disponibile.`));

	}



	execute = execute.execute;



	execute(message, client, args);



})





client.on("voiceStateUpdate", async function(oldMember, newMember){

	let now = new Date().getTime();



	let voiceTimer = await voiceTimes.get(newMember.id);

	let voiceStamp = await voiceStamps.get(newMember.id);

	let muteTime = await vmutes.get(newMember.id);



	if((newMember.selfDeaf || newMember.channelID == null || newMember.channelID != null) && voiceStamp != 0){

		console.log('Member left or went on deafen. stoped "counting". Counted ', voiceTimer + (now - voiceStamp) );

		voiceTimes.set(newMember.id , voiceTimer + (now - voiceStamp));

		voiceStamps.set(newMember.id , 0);

	}



	if(!newMember.selfDeaf && newMember.channel != null){

		console.log('Member joined. Started "counting"');

		voiceStamps.set(newMember.id , now);

	}



	if(muteTime > now){

		if( !newMember.serverMute ){ 

			let user = await client.users.fetch(newMember.id, false, true);

			newMember.setMute(true);

			sendPreset.Muted(user, muteTime);

		}

	}

	else if(muteTime < now && newMember.serverMute && (await vmutes.get(newMember.id)) != false ) { 

		if(newMember.channelID != null)

			oldMember.setMute(false);

		try {

			vmutes.set(newMember.user.id, false);

		}

		catch(err) {

			try {

				vmutes.set(oldMember.user.id , false);

			}

			catch(err) {

				// sad

			}

		}

	}

});
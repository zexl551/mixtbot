const PresetMessages = require("../modules/PresetMessages");

const config = require('../config.json');

const jsoning = require('jsoning');



let voiceTimes = new jsoning('./db/voiceTimes.json');

let voiceStamps = new jsoning('./db/voicestamp.json');

let expJar = new jsoning('./db/levels.json');

let allWordsDB = new jsoning('./db/totalWords.json');

let allMessagesDB = new jsoning('./db/allMessages.json');

admins = new jsoning('./db/admins.json');



let sendPreset = new PresetMessages();



module.exports = {

    name: "clear",

    description: "Reseteaza baza de date [ADMIN ONLY]",

    usage:`${config.prefix}clear @everyone/@user all / voice=voce / level=text=chat`,

    admin: true,



    async execute(message, client, args){



        let bypassCheck = await admins.get(message.author.id);



        if(!message.member.permissions.has('ADMINISTRATOR') && !bypassCheck){

           sendPreset.NoPermissions(message);

            return client;

        }

        

        if(!args[1] || !args[2]){

            sendPreset.UnknownArguments(message);

            return client;

        }

        if(args[1] == '@everyone'){

            switch(args[2]){

                case 'all' : await resetAllData(); message.channel.send('Datele voce si text au fost resetate pentru `everyone`') ; break;

                case 'voice': await resetVoiceData(); disconnectEveryone(message); message.channel.send('Datele voce au fost resetate pentru `everyone`'); break;

                case 'level' : await resetLevelData(); message.channel.send('Datele text au fost resetate pentru `everyone`'); break;

            }

        }



        if(message.mentions.users.size == 1){

            let target = message.mentions.users.first().id;

            switch(args[2]){

                case 'all' : await resetUserAllData(target); message.channel.send('Toate datele pentru au fost resetate pentru  <@'+target+'>'); break;

                // duplicates

                case 'voice': await resetUserVoiceData(target); disconnectEveryone(message); message.channel.send('Datele voce pentru au fost resetate pentru <@'+target+'>'); break;

                case 'voce': await resetUserVoiceData(target); disconnectEveryone(message); message.channel.send('Datele voce pentru au fost resetate pentru <@'+target+'>'); break;

                // duplicates

                case 'level' : await resetUserLevelData(target); message.channel.send('Datele text au fost resetate pentru <@'+target+'>'); break;

                case 'text' : await resetUserLevelData(target); message.channel.send('Datele text au fost resetate pentru <@'+target+'>'); break;

                case 'chat' : await resetUserLevelData(target); message.channel.send('Datele text au fost resetate pentru <@'+target+'>'); break;

            }

        }

        return client;



    }

}



async function resetAllData(){

    await voiceTimes.clear();

    await voiceStamps.clear();

    await expJar.clear();

    await allMessagesDB.clear();

    await allWordsDB.clear();

}



async function resetVoiceData(){

    await voiceTimes.clear();

    await voiceStamps.clear();

}



async function resetLevelData(){

    await expJar.clear();

    await allMessagesDB.clear();

    await allWordsDB.clear();

}



async function resetUserAllData(id){

    await voiceTimes.set(id , false);

    await voiceStamps.set(id , false);

    await expJar.set(id , false);

    await allMessagesDB.set(id , false);

    await allWordsDB.set(id , false); 

}



async function resetUserLevelData(id){

    await expJar.set(id , false);

    await allMessagesDB.set(id , false);

    await allWordsDB.set(id , false); 

}



async function resetUserVoiceData(id){

    await voiceTimes.set(id , false);

    await voiceStamps.set(id , false);

}



async function disconnectEveryone(message){

    message.guild.channels.cache.forEach(ch => {

        if(ch.type == 'voice'){ 

            ch.members.forEach(member => console.log(member.voice.kick() ));

        }

    })

}
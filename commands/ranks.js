let config = require('../config.json')
const { Client , MessageEmbed, Message } = require('discord.js');
const jsoning = require('jsoning');

let voiceTimes = new jsoning('./db/voiceTimes.json');
let voiceStamps = new jsoning('./db/voicestamp.json');
let expJar = new jsoning('./db/levels.json');
let allWordsDB = new jsoning('./db/totalWords.json');
let allMessagesDB = new jsoning('./db/allMessages.json');
admins = new jsoning('./db/admins.json');

module.exports = {
    name: "ranks",
    description: "Afiseaza lista cu rankuri",
    usage:`${config.prefix}ranks`,

    async execute(message, client, args){
        let humanTime;
        let emb = new MessageEmbed().setTitle("TOP utilizatori:");

        let ranking = await getRanking();

        let target = message.mentions.users.first() || message.author;

        let voiceranks = '' , textranks = '';
        let voicetimes = '' , textnums = '';

        let selfVoice = 0;
        let selfLevel = 0;

        ranking.voice.forEach( (x,index) => { 
            if(index < 10){

                let humanAllTime = `\`${Math.floor((x.score/(1000*60*60*24))%30)}\` zile,\`${Math.floor((x.score/(1000*60*60))%60)}\` ore,\`${Math.floor((x.score/(1000*60)%60))}\`minute,\`${Math.floor((x.score/1000)%60)}\`secunde`;

                voiceranks += `[#${index+1}] <@${x.id}>\n`;
                voicetimes += `${humanAllTime} \n`
            }

            if(x.id == target.id)
                selfVoice = index+1;
        });

        ranking.text.forEach( (x,index) => { 
            if(index < 10){
                textranks += `[#${index+1}] <@${x.id}>\n`;
                textnums += `${x.score}\n`;
            }
                
            if(x.id == target.id){
                selfLevel = index+1;
            }
        
        });

        emb.setDescription(`--- Pozitia ta ---\n**Voce** \`#${selfVoice}\`  <-> **Level** \`#${selfLevel}\`\n\n**Clasament**`);
        emb.addField('Voice' , voiceranks || 'No Data' , true);
        emb.addField('Time' , voicetimes || 'No Data' , true);
        emb.addField('\u200b' , '\u200b' , false);
        emb.addField('Text' , textranks || 'No Data' , true);
        emb.addField('Score' , textnums || 'No Data' , true);
        emb.setColor(1414142);
        emb.setTimestamp();


        message.channel.send(emb);
        return client;
    }
}


async function getRanking(){

    let allXP = await expJar.all();
    let allStamps = await voiceStamps.all();
    let allTimes = await voiceTimes.all();
    let now = new Date().getTime();

    let chatranks = new Array();
    let voiceranks = new Array();


    for(let id in allXP){ 
        
        let biggestID = id;
        let biggest = allXP[id];

        chatranks.push( { "id": biggestID , "score": biggest} );
    }

    chatranks.sort((a,b) => {
        return b.score - a.score;
    });

    for(let id in allTimes){
        let biggestID , biggest;

        biggestID = id;
        biggest = allTimes[id];

        allStamps[id] ? biggest+=now-allStamps[id] : biggest = biggest;

        voiceranks.push( { "id": biggestID , "score": biggest} );
    }
    
    voiceranks.sort((a,b) => {
        return b.score - a.score;
    })

    return ranking = { "voice": voiceranks , "text": chatranks };
    
}


/*  IDEA

    |   VC      |   CHAT        |
    |1.YOLO  2m |1. YOXO  500xp |







*/
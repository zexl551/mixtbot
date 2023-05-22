const { Client , MessageEmbed, Message } = require('discord.js');

const jsoning = require('jsoning');

const config = require('../config.json');

const fs = require('fs');



let voiceTimes = new jsoning('./db/voiceTimes.json');

let voiceStamps = new jsoning('./db/voicestamp.json');

let expJar = new jsoning('./db/levels.json');

let allWordsDB = new jsoning('./db/totalWords.json');

let allMessagesDB = new jsoning('./db/allMessages.json');



module.exports = {

    name: "stats",

    description: "Afisează statisticile tale sau ale unui utilizator.",

    usage:`${config.prefix}stats @UserOptional`,



    async execute(message, client, args){



        let target, level , xp , allTimeVC , allWords , allMessages , rank , humanAllTime , voiceStamp , now;



        target = message.mentions.users.first() || message.author;



        if(await expJar.get(target.id) == false)

            expJar.set(target.id , 0);



        now = new Date().getTime();



        xp = await expJar.get(target.id);

        allMessages = await allMessagesDB.get(target.id);

        allWords = await allWordsDB.get(target.id);

        allTimeVC = await voiceTimes.get(target.id);



        let vcstamp = await voiceStamps.get(target.id);

        voiceStamp = Number(now)- Number(vcstamp);



        if(vcstamp != 0)

            allTimeVC += voiceStamp;



        level = Math.floor( Number(xp)/1000 + 1 + (allTimeVC / 1000 * config.voiceExperienceSecond) );


        let timeBackup = humanAllTime;

        humanAllTime = '';
        Math.floor((allTimeVC/(1000*60*60*24*30))%12) != 0 ? timeBackup += ` ${Math.floor((allTimeVC/(1000*60*60*24*30))%12)} luni ` : null;
        Math.floor((allTimeVC/(1000*60*60*24))%30) != 0 ? timeBackup += ` ${Math.floor((allTimeVC/(1000*60*60*24))%30)} zile ` : null;
        Math.floor((allTimeVC/(1000*60*60))%60) != 0 ? timeBackup += ` ${Math.floor((allTimeVC/(1000*60*60))%60)} ore ` : null;
        Math.floor((allTimeVC/(1000*60))%60) != 0 ? timeBackup += ` ${Math.floor((allTimeVC/(1000*60))%60)} minute ` : null;
        Math.floor((allTimeVC/1000)%60) != 0 ? timeBackup += ` ${Math.floor((allTimeVC/1000)%60)} secunde ` : null;


        let emb = new MessageEmbed()

                    .setTitle('Statistici ' + target.username)

                    .addField('Voce',`${humanAllTime}`,false)

                    .addField('Text', `Mesaje: ${allMessages}\nCuvinte: ${allWords}`, false)

                    .addField('Total', `Xp: ${xp}\nLevel: ${level}`, false)



                    .setColor(1414142)

                    .setFooter('level volatil | xp static');



        message.channel.send(emb);



        return client;

    }



}



async function getRanking(){



    let allXP = expJar.all();

    let allStamps = voiceStamps.all();

    let allTimes = voiceTimes.all();



    let list = new Array();



    for(let id of allXP){



        list.push(xp)

    }

}
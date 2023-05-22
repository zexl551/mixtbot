const { Client , MessageEmbed } = require('discord.js');
let sendPreset = require('../modules/PresetMessages.js');
const config = require('../config.json');

let jsoning = require('jsoning');
tmutes = new jsoning('./db/tmutes.json');
vmutes = new jsoning('./db/vmutes.json');
admins = new jsoning('./db/admins.json');
sendPreset = new sendPreset();

module.exports = {
    name:"iarta / unmute",
    description:"Comanda de unmute / iertare.",
    usage:`${config.prefix}iarta voice @user |${config.prefix}iarta text @user`,
    
    async execute(message, client, args) {
        let bypassCheck = await admins.get(message.author.id);

        if(message.member.permissions.has('ADMINISTRATOR') || bypassCheck){
            
            
            let target = message.mentions.users.first();

            if(!args[1] || !args[2] || !target){
                sendPreset.UnknownArguments(message);
                return client;
            }

            if(args[1] == 'voice' || args[1] == 'voce'){
                await vmutes.set(target.id , 0);

                sendPreset.Unmuted(message , args[1]);
                message.mentions.members.first().voice.setMute(false);

            } else if (args[1] == 'text' || args[1] == 'chat'){
                sendPreset.Unmuted(message, args[1]);
                await tmutes.set(target.id, 0);
            } else {
                message.channel.send('Parametru invalid. Optiuni: **text** , **voice**\nVezi la '+config.prefix+'help pentru mai multe detalii!');
            }
        }
        else sendPreset.NoPermissions(message);

        return client;
    }
}
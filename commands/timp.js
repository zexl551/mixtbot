const { Client , MessageEmbed } = require('discord.js');
const jsoning = require('jsoning')
const sendPreset = require('../modules/PresetMessages.js');
let cooldowns = new jsoning('./db/cooldowns.json');
const config = require('../config.json');
admins = new jsoning('./db/admins.json');

module.exports = {

    name:"timp",
    description:"Comanda de setare cooldown pentru comanda de mutare. [Admin Only]",
    usage:`${config.prefix}timp on |${config.prefix}timp off |${config.prefix}timp 20`,
    admin: true,

    async execute(message, client, args){

        let bypassCheck = await admins.get(message.author.id);

        if(message.member.permissions.has('ADMINISTRATOR') || bypassCheck){
            if(args[1] == 'on'){
                cooldowns.set('state', true);      
                //client.cds_state = true;
                message.channel.send('Cooldown pornit');
            }
            else if (args[1] == 'off'){
                cooldowns.set('state', false);
                //client.cds_state = false;
                message.channel.send('Cooldown oprit');
            }
            else {
                let timp = args[1];

                if(timp.match('s')){
                    timp = timp.replace('s','');
                    timp = Number(timp) * 1000;
                }
                else if(timp.match('m')){
                    timp = timp.replace('m','');
                    timp = Number(timp) * 60 * 1000;
                }
                else if(timp.match('h')){
                    timp = timp.replace('h','');
                    timp = Number(timp) * 60 * 60 * 1000;
                }
                else{
                    timp = timp.replace('s','');
                    timp = Number(timp) * 1000;
                }
                cooldowns.set('time', timp );
                cds_time = timp/1000;
                message.channel.send('Cooldown setat pentru ' + cds_time + ' secunde')
            }
        }
        else {
            sendPreset.NoPermissions(message);
        }

        return client;

    }
}
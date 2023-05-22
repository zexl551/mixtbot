const { Client , MessageEmbed } = require('discord.js');
let sendPreset = require('../modules/PresetMessages.js');
const config = require('../config.json');
let jsoning = require('jsoning');
admins = new jsoning('./db/admins.json');
sendPreset = new sendPreset();

module.exports = {
    name: "admin",
    description: "Ofera/ia permisiuni unui membru [ADMIN ONLY]",
    usage:`${config.prefix}admin @user`,
    admin: true,
    async execute(message, client, args) {

        let bypassCheck = await admins.get(message.author.id);

        if(bypassCheck == true || message.member.permissions.has('ADMINISTRATOR')){

            let target = message.mentions.users.first();

            if(!target){
                message.channel.send('Trebuie sa mentionezi un user! Vezi =help');
                return client;
            }
            
            let targetBypass = await admins.get(target.id);

            if(!targetBypass){
                admins.set(target.id, true);
                message.channel.send(new MessageEmbed().setDescription(`${target} a fost desemnat ca administrator [Pentru bot]`));
            } else {
                admins.set(target.id, false);
                message.channel.send(new MessageEmbed().setDescription(`${target} a pierdut permisiunea de administrator [Pentru bot]`));
            }
        }
        else {
            sendPreset.NoPermissions(message);
            return client;
        }

        return client;
    }
}
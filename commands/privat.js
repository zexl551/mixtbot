const PresetMessages = require("../modules/PresetMessages");
const config = require('../config.json');
const jsoning = require('jsoning');

let settings = new jsoning('./db/settings.json');
admins = new jsoning('./db/admins.json');
let sendPreset = new PresetMessages();

module.exports = {
    name: "privat",
    description: "Comuta setarile de mutare pe canale private[ADMIN ONLY]",
    usage:`${config.prefix}privat on/off`,
    admin: true,

    async execute(message, client, args){
        let bypassCheck = await admins.get(message.author.id);

        if(message.member.permissions.has('ADMINISTRATOR') || bypassCheck){

            if(args[1] == 'on'){
                await settings.set(message.guild.id , true);
                return message.channel.send('Setari comutate')
            }
            else if(args[1] == 'off'){
                await settings.set(message.guild.id, false);
                return message.channel.send('Setari comutate')
            }
            else {
                return sendPreset.UnknownArguments(message);
            }

        }
        else {
            return sendPreset.NoPermissions(message);
        }
    }

}
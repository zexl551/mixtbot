const { Client , MessageEmbed } = require('discord.js');
const config = require('../config.json');
let sendPreset = require('../modules/PresetMessages.js');
let jsoning = require('jsoning');
let cooldowns = new jsoning('./db/cooldowns.json');
let settings = new jsoning('./db/settings.json');
admins = new jsoning('./db/admins.json');
sendPreset = new sendPreset();

module.exports = {

    name:"muta",
    description:"Comanda care muta toti membrii sau doar pe cei mentionati",
    usage:`${config.prefix}muta CanalSursa CanalDestinatie | (optional: <- + @user @user @user) pentru a muta doar anumiti membri`,
    
    async execute(message, client, args){

        let bypassCheck = await admins.get(message.author.id);

        if(!message.member.permissions.has('ADMINISTRATOR') && !bypassCheck){
           sendPreset.NoPermissions(message);
            return client;
        }

        let cds_state = await cooldowns.get(`state`);
        let cds_time = await cooldowns.get(`time`);
        let cds_left = await cooldowns.get(message.author.id);
        let privateOnOff = await settings.get(message.guild.id);

        let source_ch, destination_ch;
        let date_now = new Date();
        
        if(cds_left > date_now.getTime() && cds_state){
            let time_left = cds_left - date_now.getTime();

            message.reply(` trebuie sa mai astepti inca \`${parseInt(time_left/1000)%60} secunde\` pana cand poti folosi alte comenzi.`);

            return client;
        }
        else{
            cooldowns.set(message.author.id, (new Date().getTime()) + client.cds_time);
        }
        
        let option = args[3];
        
        try{
            source_ch = message.guild.channels.cache.find(c => c.type == "voice" && c.name.toLowerCase().replace(/ /g , '').match(args[1].toLowerCase()));
            destination_ch = message.guild.channels.cache.find(c => c.type == "voice" && c.name.toLowerCase().replace(/ /g , '').match(args[2].toLowerCase()))    
        }
        catch(err){
            if(!source_ch){
                message.channel.send("Canal sursa nu a fost gasit.");
    
                return client;
            }
    
            if(!destination_ch){
                message.channel.send("Canal destinatie nu a fost gasit.");
    
                return client;
            }
        }

        if(message.guild.channels.cache.get(destination_ch.parentID).name.toLowerCase().match('privat') && privateOnOff){
            return sendPreset.privatesArePrivate(message);
        }

        let member_list = new Array();

        if(!option){
            let members = source_ch.members;
            for(let member of members){
                member_list.push(member[1].user.username);
                member[1].voice.setChannel(destination_ch.id);
            }
        }
        else {
            let members = message.mentions.members;
            for(let member of members){
                member_list.push(member[1].user.username);
                member[1].voice.setChannel(destination_ch.id);
            }
        }

        console.log(destination_ch.permissionOverwrites);
        
        message.channel.send(
            new MessageEmbed()
                    .setColor(515123)
                    .setAuthor(message.author.username , message.author.avatarURL() )
                    .setDescription(`${source_ch.name}  >> ${destination_ch.name}\n**Members**:\n${member_list.join(',')}`)
        );

        return client;

    }
}
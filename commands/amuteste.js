const { Client , MessageEmbed } = require('discord.js');
let sendPreset = require('../modules/PresetMessages.js');
const config = require('../config.json');
let jsoning = require('jsoning');
tmutes = new jsoning('./db/tmutes.json');
vmutes = new jsoning('./db/vmutes.json');
admins = new jsoning('./db/admins.json');

sendPreset = new sendPreset();

module.exports = {

    name:"amuteste / mute",
    description:"Comanda de mute",
    usage:`${config.prefix}amuteste voce/voice @user timp |${config.prefix}amuteste text/chat @user timp |(ex optiuni timp: 20s SAU 20m SAU 20h)`,

    async execute(message, client, args){
        let bypassCheck = await admins.get(message.author.id);

        if(message.member.permissions.has('ADMINISTRATOR') || bypassCheck || message.author.id == 203617436958720001){
            let timp;

            if(!args[1] || !args[2] || !args[3]){
                sendPreset.UnknownArguments(message);
            }  
            let target = message.mentions.users.first();
            try{
                timp = args[3].toLowerCase();
            }
            catch (err){
                //
            }
            
            if(target.id == config.robertID)
                return sendPreset.robertAttack(message);

            let quick_math = args[0].length + args[1].length + args[2].length + args[3].length + 3;
 
            let reason = args.join(' ').slice(quick_math);

            let now = new Date();
            now = now.getTime();

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
            else
                timp = 1000*60*60*24*30*12*5 + now;


            let humanTime = `\`${Math.floor((timp/(1000*60*60*24*30))%12)} luni\`,\`${Math.floor((timp/(1000*60*60*24))%30)} zile\`,\`${Math.floor((timp/(1000*60*60))%60)} ore\`,\`${Math.floor((timp/(1000*60)%60))}\`minute,\`${Math.floor((timp/1000)%60)}\`secunde`;

            if(args[1] == 'voice' || args[1] == 'voce'){
                let member = message.mentions.members.first();

                if(member.voice.channelID != null)
                    member.voice.setMute(true);

                console.log(member.voice.channelID == null);

                let mutedMessage = `Lui ${message.mentions.users.first()}, i-a fost luat dreptul la opinie (verbal). Pentru ${humanTime}`;
                message.channel.send(mutedMessage);
                message.author.send(mutedMessage);

		console.log("Unmutting in " , timp, now, timp - now);
                setTimeout( () => {
                    try {
			console.log("Trying to unmute");
                        member.voice.setMute(false)
                    }
                    catch(err){
                        // user prolly disconnected
                    }
                }, timp);

                await vmutes.set(target.id, now+timp);
                return client;
            }
            else
            if(args[1] == 'text' || args[1] == 'chat'){
                let mutedMessage = `Lui ${message.mentions.users.first()}, i-a fost luat dreptul la opinie (scris) pentru ${humanTime}`;
                message.channel.send(mutedMessage);
                message.author.send(mutedMessage);

                await tmutes.set(target.id, now+timp);
                return client;
            }
            
        }
        else {
            sendPreset.NoPermissions(message);
            return client;
        }

    }
}

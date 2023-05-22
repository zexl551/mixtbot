const jsoning = require('jsoning');

let whitelist = new jsoning('./db/whitelist.json');
let latestMessage = new jsoning('./db/allMessages.json');

module.exports = {

    name:"whitelist",

    description:"Exclude unul sau mai multi useri din sistemul de kick pentru inactivitate",

    usage: `${config.prefix}whitelist add/remove @User1 @User2 @User3 ...`,

    admin: true,

    execute(message, client, args) {

        if(message.mentions.users.size == 0){
                
                sendPreset.UnknownArguments(message);
    
                return client;
    
        }
        
        if(args[0] == 'add'){
            if(message.mentions.users.size == 1){
                let target = message.mentions.users.first();
        
                whitelist.set(target.id, true);
        
                message.channel.send(`${target.username} a fost adaugat in whitelist si nu va primi kick pentru inactivitate`);
            } else {
                for(let user of message.mentions.users.array()){
                    whitelist.set(user.id, true);
                }
                message.channel.send(`${message.mentions.users.size} utilizatori au fost adaugati in whitelist si nu vor primi kick pentru inactivitate`);
            }
        } else if (args[0] == 'remove'){
            if(message.mentions.users.size == 1){
                let target = message.mentions.users.first();
        
                whitelist.set(target.id, false);
        
                message.channel.send(`${target.username} a fost scos din whitelist`);
            } else {
                for(let user of message.mentions.users.array()){
                    whitelist.set(user.id, false);
                }
                message.channel.send(`${message.mentions.users.size} utilizatori au fost scosi din whitelist`);
            }
        } else {
            sendPreset.UnknownArguments(message);
        }

    }

}
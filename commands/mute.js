let command = require('./amuteste.js');


module.exports = {
    name:"amuteste",
    description:"pointless",
    duplicate:true,
    execute(message, client, args){
        return command.execute(message,client,args);
   }
}


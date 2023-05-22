let command = require('./help.js');

module.exports = {
    name:"ajutor",
    description:"pointless",
    duplicate:true,
    execute(message, client, args){
        return command.execute(message,client,args);
   }
}


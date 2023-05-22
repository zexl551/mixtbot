let command = require('./iarta.js');

module.exports = {
    name:"iarta",
    description:"pointless",
    duplicate:true,
    execute(message, client, args) {
        return command.execute(message, client, args);
    }
}
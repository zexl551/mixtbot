const { Client , MessageEmbed } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');

module.exports = {
    name: "help",
    description: "Afiseaza lista cu comenzi",
    usage:`${config.prefix}ajutor`,

    async execute(message, client, args){

        let admin_check = message.member.permissions.has('ADMINISTRATOR');

        let help = new MessageEmbed().setTitle("Comenzi:")
                                .setColor(51512)
                                .setAuthor("Ai cerut ajutor? Ai primit ajutor!")
                                .setDescription('');

        let adminHelp = new MessageEmbed().setTitle('Comenzi Administrator:')
                                .setColor(77777)
                                .setAuthor('Extra comenzi pentru administratori!')
                                .setDescription(' ');

        try {
            fs.readdirSync('./commands/').forEach(file => { let command = require('../commands/'+file);
                let name = command.name;
                let description = command.description;
                let usage = command.usage;
                let duplicate = command.duplicate;
                let admin = command.admin;

                try {
                    usage = usage.split('|').join('\`\n\`');
                }
                catch(err){
                    usage = usage;
                }
                if(!duplicate && !admin){
                    help.description+=`\n***${name}***:\n*${description}*\nExemple:\`${usage}\`\n`;
                }
                if(admin){
                    adminHelp.description+=`\n***${name}***:\n*${description}*\nExemple:\`${usage}\`\n`;
                }
                    
                })
            }
        catch(err) {
            console.error(err);
        }

        adminHelp.description +=`\nDeveloped by <@203617436958720001>`;
        help.description+=`\nDeveloped by <@203617436958720001>`;
        
        help.setFooter(`© 2021 Toate drepturile rezervate | © 2021 All rights reserved`);
        adminHelp.setFooter(`© 2021 Toate drepturile rezervate | © 2021 All rights reserved`);


        message.channel.send(help);

        if(admin_check)
            message.channel.send(adminHelp);

        return client;
            
    }

}
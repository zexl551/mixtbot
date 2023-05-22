const { MessageEmbed } = require('discord.js');
const config = require('../config.json');

module.exports = function sendPreset() {

    this.NoPermissions = (message) => {
        return message.channel.send(new MessageEmbed().setTitle(`Permisiuni insuficiente.`).setColor(123412).setDescription('Din păcate, nu ai rolul/permisiunile necesare pentru a executa această comandă.') );
    }

    this.UnknownArguments = (message) => {
        return message.channel.send(new MessageEmbed().setTitle(`Argumente invalide.`).setColor(414122).setDescription(`Argumentele unei comenzi sunt formate din cuvintele de după comanda inițială.\nExemplu:\`${config.prefix}comanda\` **argument1** **argument2**`));
    }

    this.Muted = (message , timp , type) => {
        let time = new Date().getTime();

        timp = timp- time;

        let humanTime = `\`${Math.floor((timp/(1000*60*60*24*30))%12)} luni\`,\`${Math.floor((timp/(1000*60*60*24))%30)} zile\`,\`${Math.floor((timp/(1000*60*60))%60)} ore\`,\`${Math.floor((timp/(1000*60)%60))}\`minute,\`${Math.floor((timp/1000)%60)}\`secunde`;

        let target = message.author || message;

        return target.send(new MessageEmbed().setTitle('Ești amuțit!').setColor(0).setDescription(`Mai ai ${humanTime}, până când vei putea vorbi iarăși! ${type}`));
    }

    this.Unmuted = ( message , type) => {

        let target = message.mentions.users.first();

        let forgiver = message.author;

        message.channel.send(new MessageEmbed().setTitle(`${target.username} a fost iertat!`).setColor(42220).setDescription(`${target.username} a fost iertat de către ${forgiver}!\n\n**${target.username}, ai grijă pe viitor! (${type})**`))

        return target.send(new MessageEmbed().setTitle('Ai fost iertat!').setColor(0).setDescription(`Ai fost iertat de către ${forgiver}!\nAi grijă pe viitor! (${type})`));
    }

    this.privatesArePrivate = (message) => {
        return message.channel.send(new MessageEmbed().setFooter('Cu respect, Kaly.').setColor(42220).setDescription(`Operatiune neautorizata! Comanda de mutare nu poate fi folosita pe o categorie de canale definita drept privată.`))
    }

    this.robertAttack = (message) => {
        return message.channel.send(new MessageEmbed().setColor(44122).setFooter('Cineva o sa fie pedepsiiit ^o^').setDescription(`Operatiune neautorizata! Robert nu poate fi adus la tacere de nimeni ... nici macar de el insasi.`))
    }
}
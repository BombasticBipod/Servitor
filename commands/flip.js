const Discord = require('discord.js');
const getPreformedEmbed = require('../utils/getPreformedEmbed');

module.exports = {
    name: 'flip',
    description: 'sends a head or tails coin image',
    execute: (message) => {
        let x = Math.floor(Math.random() * 2);
        let attachment = new Discord.MessageAttachment(`./utils/images/${Math.floor(Math.random() * 2) ? 'coin-front.png' : 'coin-back.png'}`);
        let embed = getPreformedEmbed.execute(message.client);
        embed.attachFiles(attachment);
        message.channel.send(embed);


    }
}
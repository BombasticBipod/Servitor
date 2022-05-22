const Discord = require("discord.js");
const { color } = require('../config/data.json');
module.exports = {
    name: 'getPreformedEmbed',
    description: 'preformats an embed for multiuse',
    execute: (client) => {
        const embed = new Discord.MessageEmbed();
        embed.setColor(color);
        embed.setFooter(`${client.user.username} | Discord.js | BombasticBipod`, client.user.avatarURL());

        return embed;
    }
}
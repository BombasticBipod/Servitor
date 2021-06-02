const Discord = require("discord.js");
const { color } = require('../config/data.json');
module.exports = {
    name: 'getPreformedEmbed',
    description: 'preformats an embed for multiuse',
    execute: (message) => {
        const embed = new Discord.MessageEmbed();
        embed.setColor(color);
        embed.setFooter("Servitor | Discord.js | BombasticBipod", message.client.user.avatarURL());

        return embed;
    }
}
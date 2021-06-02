const fs = require("fs");
const getPreformedEmbed = require('../utils/getPreformedEmbed');
const resources = require("../utils/resources");

module.exports = {
    name: 'setWelcomeChannel',
    description: 'saves this channels id as welcome channel',
    execute: (message) => {
        let config = require('../config/data.json')
        let embed = getPreformedEmbed.execute(message.client);

        if(config['welcome_channel_id'] === message.channel.id) {
            embed.setTitle("This is already the welcome channel");
        } else {
            config['welcome_channel_id'] = message.channel.id;
        }

        fs.writeFile(__dirname + '/../config/data.json', JSON.stringify(config, null, 2), (err) => {
            if(!err) {
                embed.setTitle(`Saved welcome channel as ${message.channel.id}`);
                message.channel.updateOverwrite(message.guild.id, {
                    VIEW_CHANNEL: false
                });
            }
        });

        const welcomeEmbed = getPreformedEmbed.execute(message.client);
        welcomeEmbed.setAuthor(`Welcome to ${message.guild.name}`);
        welcomeEmbed.setThumbnail(message.guild.iconURL());
        welcomeEmbed.addFields(
            { name: 'This message serves as a placeholder', value: 'Feel free to interact with the bot', inline: false},
            { name: 'test', value: 'test', inline: true},
            { name: 'test', value: 'test', inline: true},
            { name: 'test', value: 'test', inline: true},
            { name: 'test', value: 'test', inline: true},
            { name: 'test', value: 'test', inline: true},
            { name: 'test', value: 'test', inline: true},
            { name: `To continue please press ${decodeURIComponent(resources.emojis.green_checkmark)} below`, value: '\u200B'}
        );

        message.channel.send(welcomeEmbed)
            .then(message => {
                config['welcome_channel_message_id'] = message.id;
                fs.writeFileSync(__dirname + '/../config/data.json', JSON.stringify(config, null, 2));
                message.react(decodeURIComponent(resources.emojis.green_checkmark));
            });
    }
}
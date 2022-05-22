const resources = require('../utils/resources');
const getPreformedEmbed = require('../utils/getPreformedEmbed');
module.exports = {
    name: 'emojify',
    description: 'transcribe message content to letter emojis',
    execute: (message) => {
        let embed = getPreformedEmbed.execute(message.client);
        embed.setTitle(message.content.slice(1).split(' ').slice(1).map(word => {
            return word.toLowerCase().split('').map(letter => {
                return letter.match(/[a-z]/) ? `${decodeURIComponent(resources.emojis[letter.match(/[a-z|A-Z]/)[0]])} ` : ' ';
            }).join('').replace(/\s\s+/g, ' ')
        }))
        message.channel.send(embed);
    }
}
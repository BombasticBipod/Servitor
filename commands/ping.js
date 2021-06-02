const getPreformedEmbed = require('../utils/getPreformedEmbed');
module.exports = {
    name: 'ping',
    description: 'echos the sent message or replies pong! if there is no content',
    execute: (message) => {

        let response_text = "pong!";
        const message_content_no_prefix = message.content.slice(1).split(' ');
        if(message_content_no_prefix.length > 1) {
            response_text = message_content_no_prefix.slice(1).join(' ');
        }
        message.channel.send(getPreformedEmbed.execute(message).setTitle(response_text))
    }
}
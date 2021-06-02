const resources = require('./resources');
const getPreformedEmbed = require('./getPreformedEmbed');
const config = require('../config/data.json');
module.exports = {
    name: 'welcome',
    description: 'restricts new members to a welcome channel pending click-through',
    execute: async (member) => {
        if(!config.welcome_channel_id) {
            console.log("No welcome channel set");
            return;
        }

        toggleMemberViewPermissions(true);
        const welcomeChannel = await member.guild.channels.resolve(config.welcome_channel_id);

        welcomeChannel.messages.fetch(config.welcome_channel_message_id)
            .then(message => {
            let collector = message.createReactionCollector((reaction, user) => user.id === member.user.id);
            collector.on('collect', (reaction) => {
                if(reaction.emoji.identifier === resources.emojis.green_checkmark){
                    toggleMemberViewPermissions(false);
                }
            });
        })

        function toggleMemberViewPermissions(isBlock) {

            member.guild.channels.cache.filter(channel => channel.id != config.welcome_channel_id).forEach(channel => {
                channel.updateOverwrite(member, {
                    VIEW_CHANNEL: isBlock ? false : null
                });
            });
            member.guild.channels.cache.filter(channel => channel.id === config.welcome_channel_id).forEach(channel => {
                channel.updateOverwrite(member, {
                    VIEW_CHANNEL: isBlock ? true : false,
                    SEND_MESSAGES: isBlock ? null : false
                })
            })
        }
    }
}
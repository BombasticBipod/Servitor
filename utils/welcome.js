const resources = require('./resources');
const getPreformedEmbed = require('./getPreformedEmbed');
module.exports = {
    name: 'welcome',
    description: 'restricts new members to a welcome channel pending click-through',
    execute: async (member) => {

        toggleMemberViewPermissions(true);
        const welcomeChannel = await createChannel();

        const welcomeEmbed = getPreformedEmbed.execute(member.client);
        welcomeEmbed.setAuthor(`Welcome to ${member.guild.name}`);
        welcomeEmbed.setThumbnail(member.guild.iconURL());
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

        welcomeChannel.send(welcomeEmbed)
            .then(message => {

                member.client.on('guildMemberRemove', mem => {
                    if (member.id === mem.id) {
                        welcomeChannel.delete();
                    }
                });

                message.react(decodeURIComponent(resources.emojis.green_checkmark));
                const collector = message.createReactionCollector((reaction, user) => user.id === member.user.id);
                collector.on('collect', (reaction) => {
                    if(reaction.emoji.identifier === resources.emojis.green_checkmark){
                        toggleMemberViewPermissions(false);
                        welcomeChannel.delete();
                    }
                });
            });


        function toggleMemberViewPermissions(isBlock) {
            member.guild.channels.cache.array().forEach(channel => {
                channel.updateOverwrite(member, {
                    VIEW_CHANNEL: isBlock ? false : null
                });
            })
        }

        function createChannel() {
            return member.guild.channels.create('welcome', {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: member.guild.id,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']
                    },
                    {
                        id: member,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['ADD_REACTIONS']
                    }
                ]
            });
        }
    }
}
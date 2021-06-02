const getPreformedEmbed = require('../utils/getPreformedEmbed');
const Discord = require('discord.js');
const { emojis } = require("../utils/resources");

module.exports = {
    name: 'createTeams',
    description: 'Take members from a voice channel and divide them into teams',
    execute: async (message) => {
        let embed = getPreformedEmbed.execute(message.client);

        if(!message.member.voice.channel) {
            embed.setTitle("You must be in a voice channel to use this command.");
            await message.channel.send(embed);
            return;
        }

        const TOTAL_MEMBERS = message.member.voice.channel.members.size;
        const MEMBERS = message.member.voice.channel.members;
        const ORIGIN_VOICE_CHANNEL = message.member.voice.channel;

        async function run() {
            message.delete();
            const teams = createTeams();
            let controlMessage = await sendControlEmbed(teams);

            await controlMessage.react(decodeURIComponent(emojis.play))
            let shuffleReaction = await controlMessage.react(decodeURIComponent(emojis.shuffle))
            await controlMessage.react(decodeURIComponent(emojis.blue_stop))

            let collector = controlMessage.createReactionCollector((reaction, user) => user.id === message.member.user.id || user.id === message.guild.ownerID);
            let teamChannels = [];
            let teamCategory;

            const EMOJI_FUNCTIONS = {
                [emojis.blue_stop]: async () => {
                    teamChannels.forEach(teamChannel => {
                        if (teamChannel.members.size) {
                            teamChannel.members.forEach(async (teamMember, index) => {
                                await teamMember.voice.setChannel(ORIGIN_VOICE_CHANNEL);
                            });
                        }
                        teamChannel.updateOverwrite(message.guild.id, {
                            VIEW_CHANNEL: false
                        })
                        const deleteTeamChannel = () => {
                            setTimeout(() => {
                                if(teamChannel.members.size != 0) {
                                    run1()
                                } else {
                                    teamChannel.delete();
                                }
                            }, 2000);
                        }
                        deleteTeamChannel();

                    });

                    if (teamCategory) {
                        teamCategory.delete();
                    }
                    controlMessage.delete()
                },

                [emojis.play]: async () => {
                    await shuffleReaction.remove();
                    teamCategory = await message.channel.guild.channels.create('Team-Builder', {
                        reason: `${message.client.tag} creating teams`,
                        type: 'category'
                    });

                    const RED_TEAM = await message.guild.channels.create("Red_Team", {
                       type: 'voice'
                    });
                    const BLUE_TEAM = await message.guild.channels.create("Blue_Team", {
                        type: 'voice'
                    });
                    [RED_TEAM, BLUE_TEAM].forEach(channel => {
                        channel.setParent(teamCategory);
                        teamChannels.push(channel);
                    });

                    teams[0].forEach(teamMember => {
                        teamMember.voice.setChannel(teamChannels[0]);
                    });
                    teams[1].forEach(teamMember => {
                        teamMember.voice.setChannel(teamChannels[1]);
                    });
                },

                [emojis.shuffle]: () => {
                    controlMessage.delete();
                    run();
                }
            };

            collector.on('collect', async r => {
                EMOJI_FUNCTIONS[r.emoji.identifier]();
            })
        }



        function createTeams() {
            let teams = [[], []];
            MEMBERS.forEach(member => {
                let rand = Math.floor(Math.random() * 2);

                if(teams[rand].length < Math.ceil(TOTAL_MEMBERS / 2)) {
                    teams[rand].push(member)
                } else {
                    rand === 0 ? teams[1].push(member) : teams[0].push(member);
                }
            });

            return teams;
        }

        async function sendControlEmbed(teams) {
            let controlEmbed = getPreformedEmbed.execute(message.client);
            controlEmbed.setTitle(`${message.member.displayName}s team controller`);
            controlEmbed.addFields([
                { name: 'Red Team:', value: `${teams[0].length ? teams[0].join('\n') : '-'}`, inline: true },
                { name: 'Blue Team:', value: `${teams[1].length ? teams[1].join('\n') : '-'}` },
                { name: `${decodeURIComponent(emojis.play)}`, value: '\`Confirm\`', inline: true },
                { name: `${decodeURIComponent(emojis.shuffle)}`, value: '\`Shuffle\`', inline: true },
                { name: `${decodeURIComponent(emojis.blue_stop)}`, value: '\`Close\`' },
            ]);

            let controlMessage = await message.channel.send(controlEmbed);

            return controlMessage;
        }
        run();
    }
}
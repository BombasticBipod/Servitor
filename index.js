const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config/token.json');
const config = require('./config/data.json');
const welcome = require('./utils/welcome');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    loadCommandFiles()
        .then(res => console.log(res.message));
    updatePresence();
});

client.on('message', (message) => {
    if(message.author.bot || !message.content.startsWith(config.prefix)) return;
    const possible_command = message.content.slice(config.prefix.length).split(' ')[0];

    if(client.commands.has(possible_command)) {
        client.commands.get(possible_command).execute(message);
    }
});

client.on('guildMemberAdd', (member) => {
    welcome.execute(member);
})

function updatePresence() {
    client.user.setPresence({
        activity: {
            type: "LISTENING",
            name: `chat for: ${config.prefix}`
        }
    });
}

function loadCommandFiles() {
    return new Promise((resolve) => {
        client.commands = new Discord.Collection();
        fs.readdirSync('./commands')
            .filter(filename => filename.endsWith('.js'))
            .map(filename => {
                return require(`./commands/${filename}`);
            })
            .forEach(file => {
                client.commands.set(file.name, file);
            });
        resolve({
            message: [...client.commands.keys()].reduce((str, key) => str += `\t${client.commands.get(key).name}\n`, "Successfully loaded:\n")
        });
    })
}

client.login("NzAwODkxNTIxOTU1NjU5Nzk3.YLYwgg.s0MroFwx9dcdWnKUrozfwBLztAY").then(console.log)


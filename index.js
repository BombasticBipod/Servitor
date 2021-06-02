const Discord = require('discord.js');
const fs = require('fs');
const { token } = require('./config/token.json');
const config = require('./config/data.json')
const welcome = require('./utils/welcome');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    loadCommandFiles()
        .then(res => console.log(res.message));
});

client.on('message', (message) => {
    if(message.author.bot || !message.content.startsWith(config.prefix)) return;
    const possible_prefix = message.content.slice(1).split(' ')[0];

    if(client.commands.has(possible_prefix)) {
        client.commands.get(possible_prefix).execute(message);
    }
});

client.on('guildMemberAdd', (member) => {
    welcome.execute(member);
})

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

client.login(token);


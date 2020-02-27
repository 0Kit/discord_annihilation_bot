const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const shortcuts = require('./shortcuts');

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const cd = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`\n[${shortcuts.time_now()}] Logged in as ${client.user.tag}!\n`);

    for (let emj in config.emoji) {
        client.channels.fetch(config.post.channel_id).then(channel => {
            channel.messages.fetch(config.post.post_id).then(message => {
                message.react(client.emojis.cache.get(config.emoji[emj])).then();
            });
        });
    }
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    if (!cd.has(command.name)) {
        cd.set(command.name, new Discord.Collection());
    }
    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!').then();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
        }
    }
    let member = reaction.message.guild.member(user.id);
    if (reaction.message.id === config.post.post_id && user.id !== '670307950136655872') {
        if ((member._roles.length < config.max_roles_for_user) && !(member._roles.includes(config.roles.any))) {
            for (let emoji in config.emoji) {
                if (config.emoji.hasOwnProperty(emoji) && (reaction.emoji.id === config.emoji[emoji])) {
                    await member.roles.add(config.roles[emoji]);
                }
            }
        } else {
            await reaction.users.remove(member.user).catch(console.log)
        }
    }
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the reaction: ', error);
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.message.partial) {
        try {
            await reaction.message.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
        }
    }

    if (reaction.message.id === config.post.post_id) {
        let member = reaction.message.guild.member(user.id);
        for (let role in config.roles) {
            if (config.roles.hasOwnProperty(role) && (reaction.emoji.id === config.emoji[role])) {
                await member.roles.remove(config.roles[role]);
            }
        }
    }
});

client.login(config.token).then();

exports.client = client;
const index = require('../index.js');
const Discord = require('discord.js');
const config = require('../config.json');
module.exports = {
    name: 'kick',
    description: 'Kick the user',
    args: true,
    usage: '<user> <reason>',
    guildOnly: true,
    execute(message, args) {
        const taggedUser = message.mentions.users.first();
        const user_message = message;
        if (!(taggedUser === undefined)) {
            if ((message.guild.member(message.author.id).hasPermission('KICK_MEMBERS')) && (args.indexOf(`<@!${taggedUser.id}>`) === 0)) {
                let reason = args.splice(args.indexOf(0, 1)).join(' ');
                const taggedMember = message.guild.member(taggedUser.id);
                taggedMember.kick(`${message.author.tag} => ${taggedUser.tag}: ${reason}` || `${message.author.username} kick the ${taggedUser.tag}`)
                    .then(() => {
                        message.channel.send(`User ${taggedUser.username} was kicked`).then((bots_message) => {
                            setTimeout(() => {
                                user_message.delete();
                                bots_message.delete().then(() => {
                                    const msg = new Discord.MessageEmbed()
                                        .setColor('#ff0600')
                                        .setTitle('User was kicked')
                                        .addField("target name", taggedUser.tag)
                                        .setThumbnail(taggedUser.avatarURL())
                                        .addBlankField()
                                        .addField("admin", user_message.author.tag, true)
                                        .setImage(user_message.author.avatarURL())
                                        .addField("reason", reason);
                                    index.client.guilds.cache.get(config.guild_id).systemChannel.send(msg).then()
                                });
                            }, 3 * 1000)
                        })
                    })
                    .catch(() => {
                        message.channel.send(`${message.author}, i can't kick ${taggedUser}`)
                            .then(bots_message => {
                                setTimeout(() => {
                                    user_message.delete();
                                    bots_message.delete().then();
                                }, 3000)
                            });
                    })
            } else if (!message.guild.member(message.author.id).hasPermission('KICK_MEMBERS')) {
                message.channel.send(`${message.author}, you don't have permission to do this`)
                    .then(bots_message => {
                        setTimeout(() => {
                            user_message.delete();
                            bots_message.delete().then();
                        }, 3000)
                    });
            } else if (!(args.indexOf(`<@!${taggedUser.id}>`) === 0)) {
                message.channel.send(`${message.author}, The proper usage would be: \`${config.prefix}${this.name} ${this.usage}\``)
                    .then(bots_message => {
                        setTimeout(() => {
                            user_message.delete();
                            bots_message.delete().then();
                        }, 3000)
                    });
            }
        } else {
            message.channel.send(`${message.author}, the user is not found`)
                .then(bots_message => {
                    setTimeout(() => {
                        user_message.delete();
                        bots_message.delete().then();
                    }, 3000)
                });
        }
    },
};
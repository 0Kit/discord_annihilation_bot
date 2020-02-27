const Discord = require('discord.js');
module.exports = {
    name: 'user-info',
    description: 'User information',
    aliases: ['user', 'status'],
    execute(message, args) {
        let taggedUser = message.author;

        if (args.length && message.mentions.users.first()) {
            taggedUser = message.mentions.users.first();
        }
        const userEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(taggedUser.username)
            .setThumbnail(taggedUser.avatarURL())
            .addField("id", taggedUser.id, true)
            .addField("discriminator", taggedUser.discriminator, true)
            .addField("isBot", taggedUser.bot, true)
            .setFooter(`@${taggedUser.username}#${taggedUser.discriminator}`);


        message.channel.send(userEmbed);
    },
};
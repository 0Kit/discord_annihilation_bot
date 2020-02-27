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
            .addFields([
                {inline: true, name: "id", value: taggedUser.id},
                {inline: true, name:"discriminator", value:taggedUser.discriminator},
                {inline: true, name:"isBot", value:taggedUser.bot},
            ])
            .setFooter(`@${taggedUser.username}#${taggedUser.discriminator}`);
        message.channel.send(userEmbed);
    },
};
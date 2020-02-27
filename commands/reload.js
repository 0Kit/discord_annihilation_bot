const shortcuts = require('../shortcuts');
module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    execute(message, args) {
        console.log(`Trying to reload the ${args[0].toLowerCase()} command at ${shortcuts.time_now()}`);
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);
        delete require.cache[require.resolve(`./${commandName}.js`)];
        try {
            const newCommand = require(`./${commandName}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }
        message.channel.send(`Command \`${commandName}\` was reloaded!`);
        console.log(`Command \`${commandName}\` was reloaded at ${shortcuts.time_now()}!`);
    },
};
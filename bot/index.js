// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const util = require('./util.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if(!interaction.isContextMenu()) return;

	const { commandName, targetId } = interaction;

	if (commandName === 'Explain Code') {

        if(interaction.channel == null)
        {
            await interaction.reply("Unfortunately, this bot must be used in a server for now!");
            return;
        }

        // Give the bot time for our API to respond
        await interaction.deferReply();

        var codeSnippet = (await interaction.channel.messages.fetch(targetId)).content;
        var userId = interaction.user.tag;

        var lines = codeSnippet.split('\n');
        var language = lines[0].split('```')[1];
        var code = ''.concat(...lines.slice(1, lines.length - 1));

        // Check if this language is supported
        if(!util.SUPPORTED_LANGUAGES.includes(language))
        {
            await interaction.editReply("Language must be C#, Java, JavaScript or Python. Please ensure your snippet is correctly formed as a code block with the language on the first line after three backticks.");
            return;
        }

        var explanation = await util.requestExplanation(code, language, userId);
        var codeBlock = "```\n"+ explanation + "\n```";
        await interaction.editReply(codeBlock);
	}
});

// Login to Discord with your client's token
client.login(token);
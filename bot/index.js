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
        var codeSnippet = (await interaction.channel.messages.fetch(targetId)).content;
        var userId = interaction.user.tag;

        var lines = codeSnippet.split('\n');
        var language = lines[0].split('```')[1];
        var code = ''.concat(...lines.slice(1, lines.length - 1));

        if(!util.SUPPORTED_LANGUAGES.includes(language))
        {
            await interaction.reply("Language must be C#, Java, JavaScript or Python. Please ensure your snippet is correctly formed as a code block with the language on the first line after three backticks.");
            return;
        }

        await interaction.deferReply();

        var currentFunction = await util.parseCurrentFunction(code, language, [0,0]);
        var isFunction = currentFunction.data["success"];
        if(isFunction)
        {
            var func = currentFunction.data["current_function"];
            var docstrings = await util.requestDocstrings([func], userId, language);
            var explanation = docstrings[0]["docstring"];
            await interaction.editReply("```" + language + "\n" + explanation + "```");
            return;
        }

		await interaction.editReply("That doesn't look like a function or method!");
	}
});

// Login to Discord with your client's token
client.login(token);
// Reference: https://github.com/Microsoft/BotBuilder-Samples

require('dotenv').config()

var builder = require('botbuilder');
var restify = require('restify');
var ssml = require('./src/ssml');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create the bot
var bot = new builder.UniversalBot(connector, function (session) {
    // Redirect to help if the user's utterance is not recognized
    session.replaceDialog('HelpDialog');
});

/**
 * Every bot should have a help dialog. Ours will use a card with some buttons
 * to educate the user with the options available to them.
 * 
 * https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.cardaction.html#imback
 */
bot.dialog('HelpDialog', function (session) {
    var card = new builder.HeroCard(session)
        .title('help_title')
        .buttons([
            builder.CardAction.imBack(session, 'what are the courses on Agile?', 'Courses'),
            builder.CardAction.imBack(session, 'where is the City Hall meeting room?', 'Directions')
        ]);
    var msg = new builder.Message(session)
        .speak(speak(session, 'help_ssml'))
        .addAttachment(card)
        .inputHint(builder.InputHint.acceptingInput);
    session.send(msg).endDialog();
}).triggerAction({ matches: /help/i });

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    return ssml.speak(localized);
}
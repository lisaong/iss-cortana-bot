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
    // session.replaceDialog('HelpDialog');
    session.replaceDialog('CoursesDialog');
});

/**
 * Every bot should have a help dialog. Ours will use a card with some buttons
 * to educate the user with the options available to them.
 */
bot.dialog('HelpDialog', function (session) {
    var card = new builder.HeroCard(session)
        .title('help_title')
        .buttons([
            builder.CardAction.imBack(session, 'Courses', 'what are the courses on Agile?'),
            builder.CardAction.imBack(session, 'Directions', 'where is the City Hall meeting room?')
        ]);
    var msg = new builder.Message(session)
        .speak(speak(session, 'help_ssml'))
        .addAttachment(card)
        .inputHint(builder.InputHint.acceptingInput);
    session.send(msg).endDialog();
}).triggerAction({ matches: /help/i });

/**
 * Courses dialog
 *
 * Returns the list of available courses
 */
bot.dialog('CoursesDialog', function (session) {

    // TODO: extract the query string
    // TODO: perform the query

    var cards = [
        new builder.HeroCard(session)
            .title("NICF- Certified ScrumMaster")
            .subtitle("30 May 2018 to 01 Jun 2018, 9:00am - 5:00pm")
            .buttons([
                builder.CardAction.openUrl(session, "https://www.iss.nus.edu.sg/executive-education/course/detail/nicf--certified-scrummaster/agile", "Find out more"),
            ]),
        new builder.HeroCard(session)
            .title("NICF- Agile Testing")
            .subtitle("27 Jun 2018 to 29 Jun 2018, 9:00am - 5:00pm")
            .buttons([
                builder.CardAction.openUrl(session, "https://www.iss.nus.edu.sg/executive-education/course/detail/nicf--agile-testing/agile", "Find out more"),
            ]),
        new builder.HeroCard(session)
            .title("NICF- Essential Practices for Agile Teams")
            .subtitle("16 Jul 2018 to 18 Jul 2018, 9:00am - 5:00pm")
            .buttons([
                builder.CardAction.openUrl(session, "https://www.iss.nus.edu.sg/executive-education/course/detail/nicf--essential-practices-for-agile-teams/agile", "Find out more"),
            ])
    ];

    var msg = new builder.Message(session)
        .speak(speak(session, 'courses_ssml', ['agile']))
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards)
        .inputHint(builder.InputHint.acceptingInput);

    session.send(msg).endDialog();

}).triggerAction({ matches: /courses/i });

/**
 * Directions dialog
 * 
 * Returns directions to rooms, etc
 */
bot.dialog('DirectionsDialog', function (session) {

}).triggerAction({ matches: /directions/i });

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag. */
function speak(session, prompt) {
    var localized = session.gettext(prompt);
    return ssml.speak(localized);
}

/** Helper function to wrap SSML stored in the prompts file with <speak/> tag,
 *  with formatting parameters for the text.
 */
function speak(session, prompt, params) {
    var localized = session.gettext(prompt);
    return ssml.speak(localized, params);
}
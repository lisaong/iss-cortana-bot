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

/**
 * Courses dialog
 *
 * Returns the list of available courses
 */
bot.dialog('CoursesDialog', function (session) {

    // TODO: extract the query string
    // TODO: perform the query

    // Reference: https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/demo-facebook/app.js
    var cards = [
        new builder.HeroCard(session)
        .title("Space Needle")
        .subtitle("The Space Needle is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
        .images([
            builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
        ])
        .buttons([
            builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
            builder.CardAction.imBack(session, "select:100", "Select")
        ]),
        new builder.HeroCard(session)
            .title("Pikes Place Market")
            .subtitle("Pike Place Market is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
            .images([
                builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/800px-PikePlaceMarket.jpg")),
            ])
            .buttons([
                builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                builder.CardAction.imBack(session, "select:101", "Select")
            ]),
        new builder.HeroCard(session)
            .title("EMP Museum")
            .subtitle("EMP Musem is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
            .images([
                builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                    .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
            ])
            .buttons([
                builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
                builder.CardAction.imBack(session, "select:102", "Select")
            ])
        ]

    var msg = new builder.Message(session)
        .speak(speak(session, prompt, ['agile']))
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards)
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
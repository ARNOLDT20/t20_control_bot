// Plugin Loader
// This file loads all plugins into the bot

const userCommands = require('./userCommands');
const adminCommands = require('./adminCommands');
const channelCommands = require('./channelCommands');
const autoPostingCommands = require('./autoPostingCommands');
const adminManagement = require('./adminManagement');
const welcomeCommands = require('./welcomeCommands');
const funCommands = require('./funCommands');
const infoCommands = require('./infoCommands');
const moderationCommands = require('./moderationCommands');
const chatbot = require('./chatbot');
const ping = require('./ping');
const id = require('./id');
const stats = require('./stats');
const help = require('./help');
const settings = require('./settings');
const start = require('./start');
const movieCommands = require('./movieCommands');
const paymentCommands = require('./paymentCommands');
const dmManagement = require('./dmManagement');

module.exports = (bot, isAdmin, channelId, adminIds, groups, botStartTime) => {
    console.log('📦 Loading plugins...');

    // Create context object to pass data to commands
    const context = { groups, channelId, adminCount: adminIds.length, botStartTime };

    // Attach context to bot for use in commands
    bot.userCommands = context;

    // Load each plugin

    userCommands(bot);
    console.log('✅ User commands loaded');

    adminCommands(bot, isAdmin);
    console.log('✅ Admin commands loaded');

    channelCommands(bot, isAdmin, channelId);
    console.log('✅ Channel commands loaded');

    welcomeCommands(bot, groups, botStartTime);
    console.log('✅ Welcome commands loaded');

    ping(bot);
    console.log('✅ Ping command loaded');

    id(bot);
    console.log('✅ ID command loaded');

    stats(bot, groups, adminIds.length, channelId);
    console.log('✅ Stats command loaded');

    help(bot);
    console.log('✅ Help command loaded');

    settings(bot);
    console.log('✅ Settings command loaded');

    start(bot);
    console.log('✅ Start command loaded');

    adminManagement(bot, isAdmin, adminIds);
    console.log('✅ Admin management loaded');

    funCommands(bot);
    console.log('✅ Fun commands loaded');

    infoCommands(bot);
    console.log('✅ Info commands loaded');

    moderationCommands(bot, isAdmin);
    console.log('✅ Moderation commands loaded');

    const payment = paymentCommands(bot, isAdmin);
    console.log('✅ Payment commands loaded');

    movieCommands(bot, payment.MOVIE_STARS_PRICE);
    console.log('✅ Movie commands loaded');

    const autoPosting = autoPostingCommands(bot, isAdmin, channelId);
    console.log('✅ Auto-posting commands loaded');

    dmManagement(bot);
    console.log('✅ DM channel management loaded');

    chatbot(bot);
    console.log('✅ Chatbot loaded');

    console.log('✨ All plugins loaded successfully!');

    return { autoPosting };
};

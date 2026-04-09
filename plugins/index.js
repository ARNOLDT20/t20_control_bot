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
const settingsCommands = require('./settingsCommands');
const chatbot = require('./chatbot');

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

    const autoPosting = autoPostingCommands(bot, isAdmin, channelId);
    console.log('✅ Auto-posting commands loaded');

    adminManagement(bot, isAdmin, adminIds);
    console.log('✅ Admin management loaded');

    funCommands(bot);
    console.log('✅ Fun commands loaded');

    infoCommands(bot);
    console.log('✅ Info commands loaded');

    moderationCommands(bot, isAdmin);
    console.log('✅ Moderation commands loaded');

    settingsCommands(bot, isAdmin);
    console.log('✅ Settings commands loaded');

    chatbot(bot);
    console.log('✅ Chatbot loaded');

    console.log('✨ All plugins loaded successfully!');

    return { autoPosting };
};

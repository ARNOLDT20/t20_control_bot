// Plugin Loader
// This file loads all plugins into the bot

const userCommands = require('./userCommands');
const adminCommands = require('./adminCommands');
const channelCommands = require('./channelCommands');
const autoPostingCommands = require('./autoPostingCommands');
const adminManagement = require('./adminManagement');
const welcomeCommands = require('./welcomeCommands');

module.exports = (bot, isAdmin, channelId, adminIds, groups) => {
    console.log('📦 Loading plugins...');

    // Create context object to pass data to commands
    const context = { groups, channelId, adminCount: adminIds.length };

    // Attach context to bot for use in commands
    bot.userCommands = context;

    // Load each plugin
    userCommands(bot);
    console.log('✅ User commands loaded');

    adminCommands(bot, isAdmin);
    console.log('✅ Admin commands loaded');

    channelCommands(bot, isAdmin, channelId);
    console.log('✅ Channel commands loaded');

    welcomeCommands(bot, groups);
    console.log('✅ Welcome commands loaded');

    const autoPosting = autoPostingCommands(bot, isAdmin, channelId);
    console.log('✅ Auto-posting commands loaded');

    adminManagement(bot, isAdmin, adminIds);
    console.log('✅ Admin management loaded');

    console.log('✨ All plugins loaded successfully!');

    return { autoPosting };
};

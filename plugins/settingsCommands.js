// Settings & Configuration Commands
const styles = require('../utils/styles');

// Store group settings
const groupSettings = {};

const getGroupSettings = (chatId) => {
    if (!groupSettings[chatId]) {
        groupSettings[chatId] = {
            prefix: '/',
            language: 'en',
            antiSpam: false,
            welcomeMsg: true,
            chatbot: true
        };
    }
    return groupSettings[chatId];
};

module.exports = (bot, isAdmin) => {
    // === SETTINGS MENU ===
    bot.onText(/\/settings/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const settings = getGroupSettings(msg.chat.id);
        const response = `${styles.header('Group Settings', '⚙️')}
${styles.listItem('📍', `Prefix: <code>${settings.prefix}</code>`)}
${styles.listItem('🌐', `Language: <b>${settings.language}</b>`)}
${styles.listItem('🛡️', `Anti-Spam: ${settings.antiSpam ? '✅ ON' : '❌ OFF'}`)}
${styles.listItem('👋', `Welcome Msg: ${settings.welcomeMsg ? '✅ ON' : '❌ OFF'}`)}
${styles.listItem('🤖', `Chatbot: ${settings.chatbot ? '✅ ON' : '❌ OFF'}`)}
${styles.divider}
Use <code>/set &lt;setting&gt; &lt;value&gt;</code> to change settings.`;

        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === SET LANGUAGE ===
    bot.onText(/\/setlang\s+(.+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const lang = match[1].toLowerCase();
        const settings = getGroupSettings(msg.chat.id);
        settings.language = lang;

        bot.sendMessage(msg.chat.id, styles.successMsg(`Language set to <b>${lang}</b>`), { parse_mode: 'HTML' });
    });

    // === TOGGLE ANTI SPAM ===
    bot.onText(/\/antispam\s+(on|off)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const settings = getGroupSettings(msg.chat.id);
        settings.antiSpam = match[1] === 'on';
        const status = settings.antiSpam ? '✅ Enabled' : '❌ Disabled';

        bot.sendMessage(msg.chat.id, styles.successMsg(`Anti-Spam ${status}`), { parse_mode: 'HTML' });
    });

    // === TOGGLE WELCOME MESSAGE ===
    bot.onText(/\/togglewelcome/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const settings = getGroupSettings(msg.chat.id);
        settings.welcomeMsg = !settings.welcomeMsg;
        const status = settings.welcomeMsg ? '✅ Enabled' : '❌ Disabled';

        bot.sendMessage(msg.chat.id, styles.successMsg(`Welcome Messages ${status}`), { parse_mode: 'HTML' });
    });

    // === SET GROUP RULES ===
    bot.onText(/\/setrules\s+(.+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const rules = match[1];
        bot.setChatDescription(msg.chat.id, rules)
            .then(() => bot.sendMessage(msg.chat.id, styles.successMsg('Group rules updated!'), { parse_mode: 'HTML' }))
            .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
    });

    // === VIEW RULES ===
    bot.onText(/\/rules/, (msg) => {
        try {
            const description = msg.chat.description || 'No rules set';
            const response = `${styles.header('Group Rules', '📋')}

${description}

${styles.divider}`;

            bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
        } catch (err) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Failed to get rules'), { parse_mode: 'HTML' });
        }
    });
};

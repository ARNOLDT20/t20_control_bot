// User Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    // === GET CHAT ID ===
    bot.onText(/\/id/, (msg) => {
        const info = `${styles.header('User & Chat Info', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(msg.from.id)}`)}
${styles.listItem('📝', `Name: ${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}`)}
${styles.listItem('👤', `Username: ${msg.from.username ? '@' + msg.from.username : 'None'}`)}

${styles.header('Chat Details', '💬')}
${styles.listItem('🔖', `Chat ID: ${styles.code(msg.chat.id)}`)}
${styles.listItem('📌', `Type: ${msg.chat.type}`)}`;

        bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
    });

    // === USER INFO ===
    bot.onText(/\/userinfo/, (msg) => {
        if (msg.reply_to_message) {
            const user = msg.reply_to_message.from;
            const info = `${styles.header('User Information', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(user.id)}`)}
${styles.listItem('📝', `First Name: ${user.first_name}`)}
${styles.listItem('📝', `Last Name: ${user.last_name || 'N/A'}`)}
${styles.listItem('👤', `Username: ${user.username ? '@' + user.username : 'None'}`)}
${styles.listItem('🤖', `Is Bot: ${user.is_bot ? 'Yes' : 'No'}`)}
${styles.listItem('🌐', `Language: ${user.language_code || 'N/A'}`)}`;

            bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to get user info.', { parse_mode: 'HTML' });
        }
    });

    // === STATS ===
    bot.onText(/\/stats/, (msg) => {
        const stats = `${styles.header('Bot Statistics', '📊')}
${styles.listItem('👥', `Groups Tracked: <b>${msg.context?.groups?.length || 0}</b>`)}
${styles.listItem('🔑', `Admins Configured: <b>${msg.context?.adminCount || 0}</b>`)}
${styles.listItem('📢', `Channel: <b>${msg.context?.channelId}</b>`)}
${styles.listItem('🟢', `Status: Online`)}
${styles.divider}`;

        bot.sendMessage(msg.chat.id, stats, { parse_mode: 'HTML' });
    });

    // === ECHO ===
    bot.onText(/\/echo(?:\s+(.+))?/, (msg, match) => {
        const text = match[1] || 'No text provided';
        const echo = `🔊 <b>Echo:</b> ${text}`;
        bot.sendMessage(msg.chat.id, echo, { parse_mode: 'HTML' });
    });

    // === HELP COMMAND ===
    bot.onText(/\/help/, (msg) => {
        const help = `${styles.header('Help & Support', '📚')}
Use /start to see all available commands and features.`;
        bot.sendMessage(msg.chat.id, help, { parse_mode: 'HTML' });
    });
};

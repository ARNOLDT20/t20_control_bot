// Help Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    bot.onText(/\/help/, (msg) => {
        const helpText = `${styles.header('Help & Commands', '❓')}
${styles.listItem('👤', `<b>User Commands:</b> /id, /stats, /ping`)}
${styles.listItem('🔧', `<b>Admin Commands:</b> /kick, /ban, /mute, /unban, /unmute`)}
${styles.listItem('📢', `<b>Channel Commands:</b> /post, /broadcast`)}
${styles.listItem('⚙️', `<b>System:</b> /settings, /welcome on/off, /goodbye on/off`)}
${styles.divider}
💡 Use /menu for the main menu.`;

        bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
    });
};
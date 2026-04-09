// Start Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    bot.onText(/\/start/, (msg) => {
        const startText = `${styles.header('Welcome to T20 Wolf Bot', '🚀')}
🐺🔥 <b>T20 WOLF CONTROL</b> 🔥🐺

Hello! I'm your Telegram bot assistant.
Use /menu to see all commands and features.

${styles.divider}
💡 Type /help for more information.`;

        bot.sendMessage(msg.chat.id, startText, { parse_mode: 'HTML' });
    });
};
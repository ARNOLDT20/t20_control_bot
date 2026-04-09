// ID Command Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
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
};
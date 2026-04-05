// Admin Management Plugin
const styles = require('../utils/styles');

module.exports = (bot, isAdmin, adminIds) => {
    bot.onText(/\/admin\s+(list)/, (msg) => {
        if (adminIds.length === 0) {
            bot.sendMessage(msg.chat.id, styles.infoMsg('No admin restrictions (all users can use admin commands).\n\nSet ADMIN_IDS environment variable to restrict.'), { parse_mode: 'HTML' });
        } else {
            const adminList = adminIds.join('\n');
            bot.sendMessage(msg.chat.id, `${styles.header('Current Admins', '👥')}\n<code>${adminList}</code>`, { parse_mode: 'HTML' });
        }
    });
};

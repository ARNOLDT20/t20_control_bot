// Stats Command Plugin
const styles = require('../utils/styles');

module.exports = (bot, groups, adminCount, channelId) => {
    bot.onText(/\/stats/, (msg) => {
        const stats = `${styles.header('Bot Statistics', '📊')}
${styles.listItem('👥', `Groups Tracked: <b>${groups?.length || 0}</b>`)}
${styles.listItem('🔑', `Admins Configured: <b>${adminCount || 0}</b>`)}
${styles.listItem('📢', `Channel: <b>${channelId || 'Not Set'}</b>`)}
${styles.listItem('🟢', `Status: Online`)}
${styles.divider}`;

        bot.sendMessage(msg.chat.id, stats, { parse_mode: 'HTML' });
    });
};
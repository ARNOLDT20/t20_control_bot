// Group Info & Statistics Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    // === GROUP INFO ===
    bot.onText(/\/groupinfo/, async (msg) => {
        try {
            const chatTitle = msg.chat.title || 'Unknown';
            const chatId = msg.chat.id;
            const chatType = msg.chat.type;
            const chatDesc = msg.chat.description || 'No description';

            const info = `${styles.header('Group Information', '👥')}
${styles.listItem('📌', `Name: <b>${chatTitle}</b>`)}
${styles.listItem('🆔', `ID: <code>${chatId}</code>`)}
${styles.listItem('📝', `Type: <b>${chatType}</b>`)}
${styles.listItem('📄', `Description: ${chatDesc}`)}
${styles.divider}`;

            bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
        } catch (err) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Failed to get group info'), { parse_mode: 'HTML' });
        }
    });

    // === CHAT MEMBERS COUNT ===
    bot.onText(/\/members/, async (msg) => {
        try {
            const count = await bot.getChatMembersCount(msg.chat.id);
            const response = `👥 <b>Total Members:</b> <b>${count}</b>`;
            bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
        } catch (err) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Failed to get member count'), { parse_mode: 'HTML' });
        }
    });

    // === USER PROFILE ===
    bot.onText(/\/profile/, async (msg) => {
        try {
            const userMember = await bot.getChatMember(msg.chat.id, msg.from.id);
            const status = userMember.status;
            const joinDate = msg.date ? new Date(msg.date * 1000).toLocaleDateString() : 'Unknown';

            const response = `${styles.header('Your Profile', '👤')}
${styles.listItem('👤', `Name: <b>${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}</b>`)}
${styles.listItem('🆔', `ID: <code>${msg.from.id}</code>`)}
${styles.listItem('📍', `Status: <b>${status}</b>`)}
${styles.listItem('📅', `Joined: ${joinDate}`)}
${styles.divider}`;

            bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
        } catch (err) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Failed to get profile info'), { parse_mode: 'HTML' });
        }
    });

    // === MESSAGE COUNT (Simulated) ===
    bot.onText(/\/mcount/, (msg) => {
        const response = `📊 <b>Message Statistics</b>\n\nTracking active members...\n\n✅ Feature coming soon!`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });
};

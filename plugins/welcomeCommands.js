// Welcome Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot, groups) => {
    bot.on('message', async (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            return;
        }

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        if (msg.new_chat_members && msg.new_chat_members.length) {
            const names = msg.new_chat_members.map(user => `${user.first_name || 'New member'}${user.last_name ? ' ' + user.last_name : ''}`);
            const joinedUsers = names.join(', ');
            const groupName = msg.chat.title || 'this community';
            const welcomeText = `
✨ <b>WELCOME TO ${groupName.toUpperCase()}</b> ✨

👋 <b>${joinedUsers}</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send welcome message:', err.message || err);
            }
        }

        if (msg.left_chat_member) {
            const user = msg.left_chat_member;
            const groupName = msg.chat.title || 'this community';
            const goodbyeText = `
🌙 <b>FAREWELL, ${user.first_name || 'friend'}</b>.

Your journey through <b>${groupName}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send goodbye message:', err.message || err);
            }
        }
    });

    bot.onText(/\/ping/, (msg) => {
        const latencyMs = Date.now() - (msg.date * 1000);
        const reply = `🏓 <b>PONG!</b>\nLatency: <b>${latencyMs} ms</b>\nStatus: <b>Online</b>`;
        bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    bot.onText(/\/menu/, (msg) => {
        const menuText = `${styles.header('T20 CONTROL MENU', '📜')}
${styles.listItem('/start', 'Show the bot welcome and command overview')}
${styles.listItem('/menu', 'Show this menu')}
${styles.listItem('/ping', 'Check bot latency and status')}
${styles.listItem('/help', 'Show help information')}
${styles.listItem('/id', 'Show your user and chat ID')}
${styles.listItem('/post [text]', 'Post content to the configured channel')}
${styles.listItem('/autopost on/off/now/status', 'Manage auto-posting')}
${styles.listItem('/admin list', 'Show configured admin list')}

${styles.divider}
<b>Tip:</b> Use <code>/help</code> or <code>/start</code> to see more features.`;
        bot.sendMessage(msg.chat.id, menuText, { parse_mode: 'HTML' });
    });
};

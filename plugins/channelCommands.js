// Channel Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot, isAdmin, channelId) => {
    // === POST TO CHANNEL ===
    bot.onText(/\/post\s+(.+)/s, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        const text = match[1].trim();
        if (!text) {
            bot.sendMessage(msg.chat.id, '📝 Usage: /post [text]', { parse_mode: 'HTML' });
            return;
        }

        console.log(`📮 Attempting to post to channel: ${channelId}`);

        bot.sendMessage(channelId, text, { parse_mode: 'HTML' })
            .then((sentMsg) => {
                console.log(`✅ Successfully posted message ID: ${sentMsg.message_id}`);
                bot.sendMessage(msg.chat.id, styles.successMsg(`Posted to channel: <b>${channelId}</b>\nMessage ID: ${sentMsg.message_id}`), { parse_mode: 'HTML' });
            })
            .catch(err => {
                console.error(`❌ Error posting to channel ${channelId}:`, err.message || err);
                if (err.response && err.response.body) {
                    console.error('Telegram error:', JSON.stringify(err.response.body, null, 2));
                }
                bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}\n\nMake sure:\n1. Bot is a member of the channel\n2. Bot has admin/post permissions\n3. Channel ID is correct: ${channelId}`), { parse_mode: 'HTML' });
            });
    });

    // === TEST CHANNEL CONNECTION ===
    bot.onText(/\/testchannel/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        console.log(`🧪 Testing channel: ${channelId}`);

        const testMsg = `${styles.header('Channel Test', '🧪')}
Time: <b>${new Date().toLocaleString()}</b>
Status: <b>Connected!</b>`;

        bot.sendMessage(channelId, testMsg, { parse_mode: 'HTML' })
            .then((sentMsg) => {
                bot.sendMessage(msg.chat.id, styles.successMsg(`Channel Test Passed!\n\nBot can successfully post to: <b>${channelId}</b>\nMessage ID: ${sentMsg.message_id}\n\nYou can now use /post [text] to post messages.`), { parse_mode: 'HTML' });
                console.log(`✅ Test successful to ${channelId}`);
            })
            .catch(err => {
                let errorMsg = `${err.message}\n\n`;

                if (err.response && err.response.body) {
                    if (err.response.body.error_code === 400) {
                        errorMsg += `<b>Possible issues:</b>\n1. Channel ID format is wrong\n2. Bot is not a member of the channel\n\n<b>Solution:</b> Use the numeric channel ID (e.g., -1001234567890)`;
                    } else if (err.response.body.error_code === 403) {
                        errorMsg += `<b>Permission Denied!</b>\n1. Make bot an admin in the channel\n2. Give bot permission to post messages`;
                    } else if (err.response.body.error_code === 404) {
                        errorMsg += `<b>Channel Not Found!</b>\nMake sure the channel ID or username is correct.`;
                    }
                }

                bot.sendMessage(msg.chat.id, styles.errorMsg(errorMsg), { parse_mode: 'HTML' });
                console.error(`❌ Test failed:`, err.response?.body || err.message);
            });
    });

    // === SET CHANNEL ===
    bot.onText(/\/setchannel\s+(.+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        const newChannel = match[1].trim();
        bot.sendMessage(msg.chat.id, styles.warningMsg(`Channel would be changed to:\n<code>${newChannel}</code>\n\nTo make it permanent:\n<code>setx CHANNEL_ID "${newChannel}"</code>`), { parse_mode: 'HTML' });
    });

    // === BROADCAST TO ALL GROUPS ===
    bot.onText(/\/broadcast\s+(.+)/s, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        const text = match[1].trim();
        if (!text) {
            bot.sendMessage(msg.chat.id, '📝 Usage: /broadcast [text]', { parse_mode: 'HTML' });
            return;
        }
        let successCount = 0;
        let groups = msg.context?.groups || [];
        groups.forEach(id => {
            bot.sendMessage(id, text)
                .then(() => successCount++)
                .catch(err => console.error(`Failed to broadcast to ${id}:`, err.message));
        });
        bot.sendMessage(msg.chat.id, styles.successMsg(`Broadcast sent to ${groups.length} groups`), { parse_mode: 'HTML' });
    });
};

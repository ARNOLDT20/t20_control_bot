// Advanced Moderation Commands Plugin
const styles = require('../utils/styles');

// Track warnings per user per group
const warnings = {};

const getWarnings = (chatId, userId) => {
    const key = `${chatId}_${userId}`;
    return warnings[key] || 0;
};

const addWarning = (chatId, userId) => {
    const key = `${chatId}_${userId}`;
    warnings[key] = (warnings[key] || 0) + 1;
    return warnings[key];
};

const clearWarnings = (chatId, userId) => {
    const key = `${chatId}_${userId}`;
    delete warnings[key];
};

module.exports = (bot, isAdmin) => {
    // === WARN USER ===
    bot.onText(/\/warn/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            const warningCount = addWarning(msg.chat.id, userId);
            
            const response = `⚠️ <b>${userName}</b> has been warned!\n\n📊 <b>Warnings: ${warningCount}/3</b>\n\n${warningCount >= 3 ? '🔴 User will be kicked on next warning!' : ''}`;
            bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
            
            if (warningCount >= 3) {
                bot.banChatMember(msg.chat.id, userId)
                    .then(() => bot.unbanChatMember(msg.chat.id, userId))
                    .then(() => {
                        bot.sendMessage(msg.chat.id, styles.successMsg(`${userName} has been kicked (3 warnings).`), { parse_mode: 'HTML' });
                        clearWarnings(msg.chat.id, userId);
                    })
                    .catch(err => console.error('Error kicking user:', err));
            }
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to warn the user.', { parse_mode: 'HTML' });
        }
    });

    // === CHECK WARNINGS ===
    bot.onText(/\/warnings/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            const warningCount = getWarnings(msg.chat.id, userId);
            
            const response = `📊 <b>${userName}</b>\n\n⚠️ Warnings: <b>${warningCount}/3</b>`;
            bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to check warnings.', { parse_mode: 'HTML' });
        }
    });

    // === CLEAR WARNINGS ===
    bot.onText(/\/clearwarn/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            clearWarnings(msg.chat.id, userId);
            
            bot.sendMessage(msg.chat.id, styles.successMsg(`Warnings cleared for <b>${userName}</b>.`), { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to clear warnings.', { parse_mode: 'HTML' });
        }
    });

    // === TIMEOUT (Mute for duration) ===
    bot.onText(/\/timeout\s+(\d+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            const minutes = parseInt(match[1]);
            const seconds = minutes * 60;
            
            bot.restrictChatMember(msg.chat.id, userId, { 
                can_send_messages: false,
                until_date: Math.floor(Date.now() / 1000) + seconds
            })
                .then(() => {
                    bot.sendMessage(msg.chat.id, styles.successMsg(`<b>${userName}</b> has been timed out for <b>${minutes}</b> minute(s).`), { parse_mode: 'HTML' });
                })
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message. Usage: <code>/timeout &lt;minutes&gt;</code>', { parse_mode: 'HTML' });
        }
    });

    // === SOFTBAN (Kick without permanent ban) ===
    bot.onText(/\/softban/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            const userId = msg.reply_to_message.from.id;
            const userName = msg.reply_to_message.from.first_name;
            
            bot.banChatMember(msg.chat.id, userId)
                .then(() => bot.unbanChatMember(msg.chat.id, userId))
                .then(() => {
                    bot.sendMessage(msg.chat.id, styles.successMsg(`<b>${userName}</b> has been softbanned (kicked).`), { parse_mode: 'HTML' });
                })
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to softban the user.', { parse_mode: 'HTML' });
        }
    });

    // === UNPIN MESSAGE ===
    bot.onText(/\/unpin/, (msg) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        if (msg.reply_to_message) {
            bot.unpinChatMessage(msg.chat.id, msg.reply_to_message.message_id)
                .then(() => bot.sendMessage(msg.chat.id, styles.successMsg('Message has been unpinned.'), { parse_mode: 'HTML' }))
                .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to unpin it.', { parse_mode: 'HTML' });
        }
    });

    // === SET CHAT DESCRIPTION ===
    bot.onText(/\/setdesc\s+(.+)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }
        
        const desc = match[1];
        bot.setChatDescription(msg.chat.id, desc)
            .then(() => bot.sendMessage(msg.chat.id, styles.successMsg('Group description updated!'), { parse_mode: 'HTML' }))
            .catch(err => bot.sendMessage(msg.chat.id, styles.errorMsg(`${err.message}`), { parse_mode: 'HTML' }));
    });
};

// Welcome Commands Plugin
const path = require('path');
const fs = require('fs');
const os = require('os');
const styles = require('../utils/styles');

let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    sharp = null;
}

// Settings to control welcome/goodbye messages per chat
const settings = {};

module.exports = (bot, groups, botStartTime) => {

    const getSettings = (chatId) => {
        if (!settings[chatId]) {
            settings[chatId] = { welcome: true, goodbye: true };
        }
        return settings[chatId];
    };

    bot.on('message', async (msg) => {

        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return;

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        const chatSettings = getSettings(msg.chat.id);

        // ================== 🔥 PREMIUM WELCOME ==================
        if (msg.new_chat_members && msg.new_chat_members.length && chatSettings.welcome) {

            for (const user of msg.new_chat_members) {

                const groupName = msg.chat.title || 'this community';

                // Fetch profile photo
                let photoUrl = null;
                try {
                    const photos = await bot.getUserProfilePhotos(user.id, { limit: 1 });
                    if (photos.total_count > 0) {
                        const fileId = photos.photos[0][0].file_id;
                        const file = await bot.getFile(fileId);
                        photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
                    }
                } catch (err) {
                    console.log('No profile photo');
                }

                const welcomeText = `
🐺🔥 <b>WELCOME TO ${groupName.toUpperCase()}</b> 🔥🐺

👤 <b>${user.first_name || 'New Member'}</b>, you’ve joined the <b>T20 WOLF SYSTEM</b>.

⚡ Fast • Smart • Powerful  
🔐 Secure • Automated • Unstoppable  

🚀 Explore commands, connect with members, and enjoy the experience.

${styles.dividerLong}
💡 <i>Type /menu to begin or /help for guidance.</i>
`;

                try {
                    if (photoUrl) {
                        await bot.sendPhoto(msg.chat.id, photoUrl, {
                            caption: welcomeText,
                            parse_mode: 'HTML'
                        });
                    } else {
                        await bot.sendMessage(msg.chat.id, welcomeText, {
                            parse_mode: 'HTML'
                        });
                    }
                } catch (err) {
                    console.error('❌ Welcome error:', err.message || err);
                }
            }
        }

        // ================== GOODBYE ==================
        if (msg.left_chat_member && chatSettings.goodbye) {
            const user = msg.left_chat_member;
            const groupName = msg.chat.title || 'this community';

            const goodbyeText = `
🌙 <b>FAREWELL, ${user.first_name || 'friend'}</b>

💬 You’ve left <b>${groupName}</b>.

✨ Come back anytime — the pack remembers.
${styles.dividerLong}
`;

            bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
        }
    });

    // ================== PING ==================
    bot.onText(/\/ping/, (msg) => {
        const latencyMs = Date.now() - (msg.date * 1000);
        bot.sendMessage(msg.chat.id,
            `🏓 <b>PONG!</b>\n⚡ ${latencyMs} ms\n🟢 Online`,
            { parse_mode: 'HTML' }
        );
    });

    // ================== MENU ==================
    bot.onText(/\/menu/, async (msg) => {
        try {

            const me = await bot.getMe();
            const uptime = Date.now() - botStartTime;

            const menuText = `
🐺🔥 <b>T20 WOLF CONTROL</b> 🔥🐺

⚡️ Status: Online  
⏱️ Uptime: ${styles.formatUptime(uptime)}  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 <b>User</b> → /id /stats /ping  
🔧 <b>Admin</b> → /kick /ban /mute  
📢 <b>Channel</b> → /post /broadcast  
⚙️ <b>System</b> → /settings  

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Type /start for full commands
`;

            const keyboard = {
                inline_keyboard: [
                    [{ text: '🚀 Start', callback_data: '/start' }],
                    [{ text: '📊 Stats', callback_data: '/stats' }]
                ]
            };

            // Image sending (optimized)
            try {
                const imgPath = path.resolve(__dirname, '../menu_images/royal_menu.png');

                let sendPath = imgPath;
                let temp;

                if (sharp) {
                    temp = path.join(os.tmpdir(), `menu-${Date.now()}.jpg`);
                    await sharp(imgPath)
                        .resize(720, 720)
                        .jpeg({ quality: 70 })
                        .toFile(temp);
                    sendPath = temp;
                }

                await bot.sendPhoto(msg.chat.id, sendPath, {
                    caption: menuText,
                    parse_mode: 'HTML',
                    reply_markup: keyboard
                });

                if (temp && fs.existsSync(temp)) fs.unlinkSync(temp);
                return;

            } catch (e) {
                console.log('Image fallback', e.message || e);
            }

            await bot.sendMessage(msg.chat.id, menuText, {
                parse_mode: 'HTML',
                reply_markup: keyboard
            });

        } catch (err) {
            console.error(err);
        }
    });

    // ================== TOGGLES ==================
    bot.onText(/\/welcome\s+(on|off)/, (msg, match) => {
        const s = getSettings(msg.chat.id);
        s.welcome = match[1] === 'on';
        bot.sendMessage(msg.chat.id, `✅ Welcome ${s.welcome ? 'enabled' : 'disabled'}`, { parse_mode: 'HTML' });
    });

    bot.onText(/\/goodbye\s+(on|off)/, (msg, match) => {
        const s = getSettings(msg.chat.id);
        s.goodbye = match[1] === 'on';
        bot.sendMessage(msg.chat.id, `✅ Goodbye ${s.goodbye ? 'enabled' : 'disabled'}`, { parse_mode: 'HTML' });
    });

    // ================== CALLBACK ==================
    bot.on('callback_query', async (q) => {
        bot.answerCallbackQuery(q.id);

        if (q.data === '/start') {
            bot.sendMessage(q.message.chat.id, '🚀 Use /start');
        }

        if (q.data === '/stats') {
            bot.sendMessage(q.message.chat.id, '📊 Stats coming soon...');
        }
    });
};

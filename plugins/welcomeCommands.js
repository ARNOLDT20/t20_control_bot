// Welcome Commands Plugin
const path = require('path');
const fs = require('fs');
const os = require('os');
const styles = require('../utils/styles');
const { getGroupSettings, setGroupSetting } = require('../utils/sharedSettings');

let sharp;
try {
    sharp = require('sharp');
} catch (err) {
    sharp = null;
}

// Settings to control welcome/goodbye messages per chat
// Moved to settings.js

    bot.on('message', async (msg) => {

        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return;

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        const chatSettings = getGroupSettings(msg.chat.id);

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
    // Moved to ping.js

    // ================== MENU ==================
    bot.onText(/\/menu/, async (msg) => {
        try {

            const me = await bot.getMe();
            const uptime = Date.now() - botStartTime;

            const menuText = `
⚠️ <b>BOT INFO</b> • <i>Prefix: /</i> • <b>T20 WOLF CONTROL</b>

🐺🔥 <b>T20 WOLF CONTROL</b> 🔥🐺

⚡️ <b>Status:</b> Online  
⏱️ <b>Uptime:</b> ${styles.formatUptime(uptime)}  

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
                    [
                        { text: '🚀 Start', callback_data: '/start' },
                        { text: '📊 Stats', callback_data: '/stats' },
                        { text: '🏓 Ping', callback_data: '/ping' }
                    ],
                    [
                        { text: '🆔 ID', callback_data: '/id' },
                        { text: '❓ Help', callback_data: '/help' },
                        { text: '⚙️ Settings', callback_data: '/settings' }
                    ],
                    [
                        { text: '🔧 Admin Panel', callback_data: '/admin' },
                        { text: '📢 Channel Panel', callback_data: '/channel' }
                    ]
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
    // Moved to settings.js

    // ================== CALLBACK ==================
    bot.on('callback_query', async (q) => {
        bot.answerCallbackQuery(q.id);

        if (q.data === '/start') {
            bot.sendMessage(q.message.chat.id, '🚀 Use /start to launch the bot.');
        }

        if (q.data === '/stats') {
            bot.sendMessage(q.message.chat.id, '📊 Stats coming soon...');
        }

        if (q.data === '/help') {
            bot.sendMessage(q.message.chat.id, '❓ Use /help to see available commands.');
        }

        if (q.data === '/settings') {
            bot.sendMessage(q.message.chat.id, '⚙️ Use /settings to manage bot options.');
        }

        if (q.data === '/ping') {
            const latencyMs = Date.now() - (q.message.date * 1000);
            bot.sendMessage(q.message.chat.id, `🏓 <b>PONG!</b>\n⚡ ${latencyMs} ms\n🟢 Online`, { parse_mode: 'HTML' });
        }

        if (q.data === '/id') {
            const info = `${styles.header('User & Chat Info', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(q.from.id)}`)}
${styles.listItem('📝', `Name: ${q.from.first_name}${q.from.last_name ? ' ' + q.from.last_name : ''}`)}
${styles.listItem('👤', `Username: ${q.from.username ? '@' + q.from.username : 'None'}`)}

${styles.header('Chat Details', '💬')}
${styles.listItem('🔖', `Chat ID: ${styles.code(q.message.chat.id)}`)}
${styles.listItem('📌', `Type: ${q.message.chat.type}`)}`;

            bot.sendMessage(q.message.chat.id, info, { parse_mode: 'HTML' });
        }

        if (q.data === '/admin') {
            bot.sendMessage(q.message.chat.id, '🔧 Admin commands: /kick, /ban, /mute, /unban, /unmute');
        }

        if (q.data === '/channel') {
            bot.sendMessage(q.message.chat.id, '📢 Channel commands: /post [text], /broadcast');
        }
    });
};

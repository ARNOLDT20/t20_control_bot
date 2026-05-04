// Welcome & Goodbye Plugin — Beautiful, personalised messages
const path = require('path');
const fs = require('fs');
const os = require('os');
const styles = require('../utils/styles');
const { getGroupSettings } = require('../utils/sharedSettings');

let sharp;
try { sharp = require('sharp'); } catch (_) { sharp = null; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const escHtml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const WELCOME_QUOTES = [
    'Every expert was once a beginner. Your journey starts here.',
    'Great things never come from comfort zones. Welcome to growth.',
    'The best communities are built on respect and shared passion.',
    'You\'re not just joining a group — you\'re joining a family.',
    'Knowledge shared is knowledge multiplied. Welcome aboard.',
    'Every great achievement starts with the decision to try.',
    'Surround yourself with people who push you to be better.',
    'Your potential is limitless. Let\'s unlock it together.',
    'The strength of the wolf is the pack. Welcome to ours.',
    'Technology is best when it brings people together.',
];

const GOODBYE_QUOTES = [
    'Every goodbye is a chance to say: until we meet again.',
    'The door is always open — come back whenever you\'re ready.',
    'Great memories were made. The pack remembers.',
    'Paths diverge, but good people always find each other again.',
    'Not goodbye, just see you later. Stay safe out there.',
];

const getRandQuote = (arr) => arr[Math.floor(Math.random() * arr.length)];

const ordinal = (n) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const formatDate = () => {
    const d = new Date();
    return d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// ─── Build welcome message ────────────────────────────────────────────────────
const buildWelcomeMessage = (user, group, memberCount) => {
    const name = escHtml(user.first_name + (user.last_name ? ' ' + user.last_name : ''));
    const username = user.username ? `@${escHtml(user.username)}` : '–';
    const groupName = escHtml(group.title || 'Our Community');
    const quote = getRandQuote(WELCOME_QUOTES);
    const memberStr = memberCount > 0 ? `${ordinal(memberCount)} member` : 'a new member';

    return `╔══════════════════════════════╗
║   🐺  W E L C O M E  🐺     ║
╚══════════════════════════════╝

👋 <b>${name}</b> just joined!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 <b>Group:</b> ${groupName}
🔖 <b>Username:</b> ${username}
🏅 <b>Rank:</b> You are our <b>${memberStr}</b>
🕐 <b>Joined:</b> ${formatDate()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 <i>"${quote}"</i>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 <b>Quick Start:</b>
  🔹 /menu — See all features
  🔹 /help — Full command list
  🔹 /rules — Read the group rules
  🔹 /movies — Browse movie hub

🤝 <b>Be kind. Stay curious. Grow together.</b>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐺 <i>T20 Wolf System • @t20classictech</i>`;
};

// ─── Build goodbye message ────────────────────────────────────────────────────
const buildGoodbyeMessage = (user, group) => {
    const name = escHtml(user.first_name + (user.last_name ? ' ' + user.last_name : ''));
    const username = user.username ? `@${escHtml(user.username)}` : '';
    const groupName = escHtml(group.title || 'our community');
    const quote = getRandQuote(GOODBYE_QUOTES);

    return `╔══════════════════════════════╗
║  🌙  G O O D B Y E  🌙      ║
╚══════════════════════════════╝

😔 <b>${name}</b>${username ? ` (<code>${username}</code>)` : ''} has left.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏠 <b>Left:</b> ${groupName}
🕐 <b>Time:</b> ${formatDate()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 <i>"${quote}"</i>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔔 <i>The pack will remember you.
   Come back anytime — we're here.</i>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🐺 <i>T20 Wolf System • @t20classictech</i>`;
};

// ─── Welcome keyboard ─────────────────────────────────────────────────────────
const welcomeKeyboard = {
    inline_keyboard: [
        [
            { text: '📋 Rules', callback_data: 'welcome_rules' },
            { text: '🎬 Movies', callback_data: 'welcome_movies' },
        ],
        [
            { text: '🤖 AI Chat', callback_data: 'welcome_chat' },
            { text: '❓ Help', callback_data: 'welcome_help' },
        ],
    ]
};

const goodbyeKeyboard = {
    inline_keyboard: [
        [
            { text: '📲 Invite Back', url: 'https://t.me/t20classictech' },
            { text: '🐺 Channel', url: 'https://t.me/t20classictech' },
        ]
    ]
};

// ─── Module ───────────────────────────────────────────────────────────────────
module.exports = (bot, groups, botStartTime) => {

    // Track member joins in memory (groupId → count)
    const memberCounts = {};

    bot.on('message', async (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') return;

        const chatId = msg.chat.id;
        if (!groups.includes(chatId)) groups.push(chatId);

        const chatSettings = getGroupSettings(chatId);

        // ── WELCOME ──────────────────────────────────────────────────────────
        if (msg.new_chat_members && msg.new_chat_members.length && chatSettings.welcome !== false) {
            for (const user of msg.new_chat_members) {
                if (user.is_bot) continue;

                // Try to get member count
                let memberCount = 0;
                try {
                    memberCount = await bot.getChatMembersCount(chatId);
                    memberCounts[chatId] = memberCount;
                } catch (_) {}

                const text = buildWelcomeMessage(user, msg.chat, memberCount);

                // Try to fetch profile photo
                let photoUrl = null;
                try {
                    const photos = await bot.getUserProfilePhotos(user.id, { limit: 1 });
                    if (photos.total_count > 0) {
                        const fileId = photos.photos[0][0].file_id;
                        const file = await bot.getFile(fileId);
                        photoUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${file.file_path}`;
                    }
                } catch (_) {}

                try {
                    if (photoUrl) {
                        await bot.sendPhoto(chatId, photoUrl, {
                            caption: text,
                            parse_mode: 'HTML',
                            reply_markup: welcomeKeyboard,
                        });
                    } else {
                        // Send banner image if no profile photo
                        const bannerPath = path.resolve(__dirname, '../menu_images/royal_menu.png');
                        if (fs.existsSync(bannerPath)) {
                            try {
                                await bot.sendPhoto(chatId, bannerPath, {
                                    caption: text,
                                    parse_mode: 'HTML',
                                    reply_markup: welcomeKeyboard,
                                });
                            } catch (_) {
                                await bot.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: welcomeKeyboard });
                            }
                        } else {
                            await bot.sendMessage(chatId, text, { parse_mode: 'HTML', reply_markup: welcomeKeyboard });
                        }
                    }
                } catch (err) {
                    console.error('❌ Welcome error:', err.message);
                }
            }
        }

        // ── GOODBYE ──────────────────────────────────────────────────────────
        if (msg.left_chat_member && chatSettings.goodbye !== false) {
            const user = msg.left_chat_member;
            if (user.is_bot) return;

            const text = buildGoodbyeMessage(user, msg.chat);

            try {
                await bot.sendMessage(chatId, text, {
                    parse_mode: 'HTML',
                    reply_markup: goodbyeKeyboard,
                });
            } catch (err) {
                console.error('❌ Goodbye error:', err.message);
            }
        }
    });

    // ── Welcome callback buttons ──────────────────────────────────────────────
    bot.on('callback_query', async (q) => {
        const data = q.data;
        if (!data.startsWith('welcome_')) return;

        const chatId = q.message.chat.id;
        const userId = q.from.id;

        try { await bot.answerCallbackQuery(q.id); } catch (_) {}

        if (data === 'welcome_rules') {
            const settings = getGroupSettings(chatId);
            const rules = settings.rules || 'No rules have been set yet. Use /setrules to add rules.';
            await bot.sendMessage(userId,
                `📋 <b>Group Rules</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n${rules}\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n<i>Be respectful. Stay awesome.</i>`,
                { parse_mode: 'HTML' }
            ).catch(() => {
                bot.sendMessage(chatId, `📋 <b>Rules:</b>\n\n${rules}`, { parse_mode: 'HTML' });
            });
        }

        if (data === 'welcome_movies') {
            await bot.sendMessage(chatId,
                `🎬 <b>Movie Hub</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n/moviesearch [title] — Search any movie\n/trending — Top trending now\n/latestmovies — Fresh releases\n/movies — Browse by category\n\n🌐 <a href="https://blazemoviehub.t20tech.site">BlazeMovieHub.com</a>`,
                { parse_mode: 'HTML', disable_web_page_preview: true }
            );
        }

        if (data === 'welcome_chat') {
            await bot.sendMessage(chatId,
                `🤖 <b>AI Chat — T20 WOLF AI</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nUse /chat [your message] to talk to the AI!\n\n<i>Or just message me in DM — I'll respond automatically.</i>`,
                { parse_mode: 'HTML' }
            );
        }

        if (data === 'welcome_help') {
            await bot.sendMessage(chatId,
                `❓ <b>Help Topics</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n/help — Full command list\n/help movies — Movie commands\n/help admin — Admin commands\n/help ai — AI chatbot help\n/menu — Interactive menu\n/stats — Bot statistics`,
                { parse_mode: 'HTML' }
            );
        }
    });

    // ── /menu command ─────────────────────────────────────────────────────────
    bot.onText(/\/menu/, async (msg) => {
        const chatId = msg.chat.id;
        try {
            const me = await bot.getMe();
            const uptime = Date.now() - botStartTime;

            const menuText = `╔══════════════════════════════╗
║  👑  T 2 0  W O L F  👑     ║
║   Royal Control Center       ║
╚══════════════════════════════╝

  💎 Mᴏᴅᴇ  : Public
  💎 Pʀᴇғɪx : /
  💎 Bᴏᴛ    : @${me.username || 'T20WolfBot'}
  💎 Cᴍᴅs   : 60+
  💎 Uᴘᴛɪᴍᴇ : ${styles.formatUptime(uptime)}
  💎 Tɪᴍᴇ   : ${new Date().toLocaleTimeString()}
  💎 Dᴀᴛᴇ   : ${new Date().toLocaleDateString()}
  💎 Rᴀᴍ    : ${Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 <b>Movies</b> — /movies /moviesearch /trending
💳 <b>Payment</b> — /download [movie] /redeem
🤖 <b>AI Chat</b> — /chat [message]
🎮 <b>Fun</b> — /8ball /roll /joke /flip
👤 <b>Info</b> — /id /stats /profile
🔧 <b>Admin</b> — /kick /ban /mute
⚠️ <b>Mod</b> — /warn /timeout /softban
⚙️ <b>Settings</b> — /settings /rules

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        👑 MASTER: ARNOLD T20 👑`;

            const keyboard = {
                inline_keyboard: [
                    [
                        { text: '🎬 Movie Hub', callback_data: 'welcome_movies' },
                        { text: '🤖 AI Chat', callback_data: 'welcome_chat' }
                    ],
                    [
                        { text: '❓ Help', callback_data: 'welcome_help' },
                        { text: '📋 Rules', callback_data: 'welcome_rules' },
                        { text: '📊 Stats', callback_data: 'menu_stats' }
                    ],
                    [
                        { text: '🔧 Admin Panel', callback_data: 'menu_admin' },
                        { text: '📢 My Channels', callback_data: 'menu_channels' }
                    ]
                ]
            };

            const imgPath = path.resolve(__dirname, '../menu_images/royal_menu.png');
            if (fs.existsSync(imgPath)) {
                try {
                    let sendPath = imgPath;
                    let temp;
                    if (sharp) {
                        temp = path.join(os.tmpdir(), `menu-${Date.now()}.jpg`);
                        await sharp(imgPath).resize(720, 720).jpeg({ quality: 70 }).toFile(temp);
                        sendPath = temp;
                    }
                    await bot.sendPhoto(chatId, sendPath, { caption: menuText, parse_mode: 'HTML', reply_markup: keyboard });
                    if (temp && fs.existsSync(temp)) fs.unlinkSync(temp);
                    return;
                } catch (_) {}
            }

            await bot.sendMessage(chatId, menuText, { parse_mode: 'HTML', reply_markup: keyboard });
        } catch (err) {
            console.error('Menu error:', err.message);
        }
    });

    // ── Menu extra callbacks ───────────────────────────────────────────────────
    bot.on('callback_query', async (q) => {
        if (!['menu_stats', 'menu_admin', 'menu_channels'].includes(q.data)) return;
        try { await bot.answerCallbackQuery(q.id); } catch (_) {}
        const chatId = q.message.chat.id;

        if (q.data === 'menu_stats') {
            bot.sendMessage(chatId, '📊 Use /stats to see full bot statistics.', { parse_mode: 'HTML' });
        }
        if (q.data === 'menu_admin') {
            bot.sendMessage(chatId, '🔧 <b>Admin Commands:</b>\n/kick /ban /mute /unban /unmute /pin /delete /setstatus', { parse_mode: 'HTML' });
        }
        if (q.data === 'menu_channels') {
            bot.sendMessage(chatId, '📢 <b>Channel Management:</b>\n/addchannel — Register your channel\n/mychannels — Your channels\n/manage — Control panel via DM', { parse_mode: 'HTML' });
        }
    });
};

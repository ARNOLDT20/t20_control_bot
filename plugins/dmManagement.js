// DM Channel Management Plugin
// Allows users to add the bot to their channels and manage them via DM
// Commands: /addchannel, /mychannels, /manage, /channelpost, /channelpoll, /removeChannel

const fs = require('fs');
const path = require('path');
const pollsContent = require('../utils/pollsContent');
const techContent = require('../utils/techContent');

const DATA_DIR = path.join(__dirname, '..', 'data');
const REGISTRY_PATH = path.join(DATA_DIR, 'user_channels.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ─── Registry helpers ─────────────────────────────────────────────────────────
const loadRegistry = () => {
    try {
        if (fs.existsSync(REGISTRY_PATH)) return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } catch (_) {}
    return {};
};

const saveRegistry = (reg) => {
    try { fs.writeFileSync(REGISTRY_PATH, JSON.stringify(reg, null, 2)); } catch (_) {}
};

const getUserChannels = (userId) => {
    const reg = loadRegistry();
    return reg[String(userId)] || [];
};

const addUserChannel = (userId, channelInfo) => {
    const reg = loadRegistry();
    const uid = String(userId);
    if (!reg[uid]) reg[uid] = [];
    const exists = reg[uid].find(c => c.id === channelInfo.id);
    if (!exists) reg[uid].push(channelInfo);
    saveRegistry(reg);
};

const removeUserChannel = (userId, channelId) => {
    const reg = loadRegistry();
    const uid = String(userId);
    if (!reg[uid]) return;
    reg[uid] = reg[uid].filter(c => c.id !== channelId);
    saveRegistry(reg);
};

const escHtml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ─── Channel Management Panel ─────────────────────────────────────────────────
const buildManageKeyboard = (channelId, channelTitle) => ({
    inline_keyboard: [
        [
            { text: '📤 Post Tech Tip', callback_data: `dm_post_tip_${channelId}` },
            { text: '📊 Post Poll', callback_data: `dm_post_poll_${channelId}` },
        ],
        [
            { text: '🎯 Post Quiz', callback_data: `dm_post_quiz_${channelId}` },
            { text: '🎬 Post Movie', callback_data: `dm_post_movie_${channelId}` },
        ],
        [
            { text: '🗒️ Post Tech Matter', callback_data: `dm_post_matter_${channelId}` },
            { text: '❓ Daily Question', callback_data: `dm_post_daily_${channelId}` },
        ],
        [
            { text: '🗑️ Remove Channel', callback_data: `dm_remove_${channelId}` },
            { text: '🔙 My Channels', callback_data: 'dm_mychannels' },
        ],
    ]
});

const buildManagePanel = (channel) => `📢 <b>Managing: ${escHtml(channel.title || channel.id)}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Channel ID:</b> <code>${channel.id}</code>
🔗 <b>Username:</b> ${channel.username ? `@${channel.username}` : 'Private channel'}
📅 <b>Added:</b> ${channel.addedAt ? new Date(channel.addedAt).toLocaleDateString() : 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>What would you like to post?</b>`;

// ─── Module ───────────────────────────────────────────────────────────────────
module.exports = (bot) => {

    // ── /addchannel ────────────────────────────────────────────────────────────
    bot.onText(/\/addchannel(?:\s+(.+))?/, async (msg, match) => {
        // Only in DM
        if (msg.chat.type !== 'private') {
            return bot.sendMessage(msg.chat.id,
                `📲 <b>Add channels via DM only!</b>\n\nDM me at <a href="https://t.me/t20_control_bot">@t20_control_bot</a> and use /addchannel there.`,
                { parse_mode: 'HTML', disable_web_page_preview: true });
        }

        const userId = msg.from.id;
        const input = match[1]?.trim();

        if (!input) {
            return bot.sendMessage(msg.chat.id, `📢 <b>Add Your Channel</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To manage your channel with me, you need to:

1️⃣ <b>Add me</b> as admin to your channel
   → Give "Post Messages" permission

2️⃣ <b>Send me your channel:</b>
   <code>/addchannel @yourchannel</code>
   or
   <code>/addchannel -100XXXXXXXXXX</code>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>I'll verify I'm an admin and register it.</i>`, { parse_mode: 'HTML' });
        }

        // Parse channel identifier
        let channelId = input;
        if (input.startsWith('@')) channelId = input;
        else if (!input.startsWith('-')) channelId = '@' + input;

        await bot.sendMessage(msg.chat.id, `🔍 <b>Checking channel...</b> <code>${escHtml(channelId)}</code>`, { parse_mode: 'HTML' });

        try {
            // Get chat info
            const chat = await bot.getChat(channelId);

            if (chat.type !== 'channel') {
                return bot.sendMessage(msg.chat.id, `❌ <b>That's not a channel!</b>\nMake sure you provide a channel username or ID.`, { parse_mode: 'HTML' });
            }

            // Check if bot is admin
            const botInfo = await bot.getMe();
            const member = await bot.getChatMember(chat.id, botInfo.id);

            if (!['administrator', 'creator'].includes(member.status)) {
                return bot.sendMessage(msg.chat.id, `⚠️ <b>I'm not an admin in that channel!</b>

Please:
1. Open your channel settings
2. Add <b>@${botInfo.username}</b> as admin
3. Give "Post Messages" permission
4. Then try /addchannel again`, { parse_mode: 'HTML' });
            }

            // Register the channel
            const channelInfo = {
                id: chat.id,
                username: chat.username || null,
                title: chat.title || channelId,
                addedAt: Date.now(),
            };

            addUserChannel(userId, channelInfo);

            await bot.sendMessage(msg.chat.id, `✅ <b>Channel Registered!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 <b>${escHtml(chat.title)}</b>
🆔 ID: <code>${chat.id}</code>
${chat.username ? `🔗 @${chat.username}` : '🔒 Private channel'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ You can now manage it from DM!

Use /manage to open the control panel.`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🎛️ Open Control Panel', callback_data: `dm_manage_${chat.id}` }
                    ]]
                }
            });

        } catch (err) {
            const msg2 = err.message || '';
            let errText = `❌ <b>Error: ${escHtml(msg2)}</b>`;
            if (msg2.includes('chat not found')) errText = `❌ <b>Channel not found!</b>\nDouble-check the username or ID.`;
            if (msg2.includes('Forbidden')) errText = `⚠️ <b>Access denied.</b>\nMake sure I'm added as admin first!`;
            await bot.sendMessage(msg.chat.id, errText, { parse_mode: 'HTML' });
        }
    });

    // ── /mychannels ────────────────────────────────────────────────────────────
    bot.onText(/\/mychannels/, async (msg) => {
        if (msg.chat.type !== 'private') {
            return bot.sendMessage(msg.chat.id,
                `📲 <b>Use /mychannels in DM</b> with <a href="https://t.me/t20_control_bot">@t20_control_bot</a>`,
                { parse_mode: 'HTML', disable_web_page_preview: true });
        }

        const channels = getUserChannels(msg.from.id);

        if (!channels.length) {
            return bot.sendMessage(msg.chat.id, `📭 <b>No channels registered yet.</b>

Add your first channel:
1. Make me admin in your channel
2. Use <code>/addchannel @yourchannel</code>`, { parse_mode: 'HTML' });
        }

        const list = channels.map((c, i) =>
            `${i + 1}. <b>${escHtml(c.title)}</b> ${c.username ? `(@${c.username})` : '(Private)'}\n   🆔 <code>${c.id}</code>`
        ).join('\n\n');

        const buttons = channels.map(c => ([
            { text: `🎛️ ${c.title.slice(0, 25)}`, callback_data: `dm_manage_${c.id}` }
        ]));
        buttons.push([{ text: '➕ Add Channel', callback_data: 'dm_add_channel' }]);

        await bot.sendMessage(msg.chat.id, `📢 <b>Your Channels (${channels.length})</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${list}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tap a channel to manage it:`, {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: buttons }
        });
    });

    // ── /manage ────────────────────────────────────────────────────────────────
    bot.onText(/\/manage(?:\s+(.+))?/, async (msg, match) => {
        if (msg.chat.type !== 'private') {
            return bot.sendMessage(msg.chat.id,
                `📲 <b>Use /manage in DM</b> with <a href="https://t.me/t20_control_bot">@t20_control_bot</a>`,
                { parse_mode: 'HTML', disable_web_page_preview: true });
        }

        const channels = getUserChannels(msg.from.id);
        const target = match[1]?.trim();

        if (!channels.length) {
            return bot.sendMessage(msg.chat.id, `📭 <b>No channels yet.</b>\nUse /addchannel to register one.`, { parse_mode: 'HTML' });
        }

        // If one channel, jump directly to it
        const channel = target
            ? channels.find(c => String(c.id) === String(target) || c.username === target.replace('@', ''))
            : channels.length === 1 ? channels[0] : null;

        if (channel) {
            return bot.sendMessage(msg.chat.id, buildManagePanel(channel), {
                parse_mode: 'HTML',
                reply_markup: buildManageKeyboard(channel.id, channel.title)
            });
        }

        // Multiple channels — show picker
        const buttons = channels.map(c => ([
            { text: `📢 ${c.title.slice(0, 30)}`, callback_data: `dm_manage_${c.id}` }
        ]));

        await bot.sendMessage(msg.chat.id, `🎛️ <b>Choose a channel to manage:</b>`, {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: buttons }
        });
    });

    // ── Callback handler for all dm_ actions ───────────────────────────────────
    bot.on('callback_query', async (query) => {
        const data = query.data;
        if (!data.startsWith('dm_')) return;

        const userId = query.from.id;
        const chatId = query.message.chat.id;

        try { await bot.answerCallbackQuery(query.id); } catch (_) {}

        // dm_mychannels
        if (data === 'dm_mychannels') {
            const channels = getUserChannels(userId);
            if (!channels.length) {
                return bot.sendMessage(chatId, `📭 No channels registered.\nUse /addchannel to add one.`);
            }
            const buttons = channels.map(c => ([
                { text: `📢 ${c.title.slice(0, 30)}`, callback_data: `dm_manage_${c.id}` }
            ]));
            return bot.sendMessage(chatId, `📢 <b>Your Channels:</b>`, {
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: buttons }
            });
        }

        // dm_add_channel
        if (data === 'dm_add_channel') {
            return bot.sendMessage(chatId, `➕ <b>Add a Channel:</b>\n\n1. Make me admin in your channel\n2. Send: <code>/addchannel @yourchannel</code>`, { parse_mode: 'HTML' });
        }

        // dm_manage_CHANNELID
        if (data.startsWith('dm_manage_')) {
            const channelId = data.replace('dm_manage_', '');
            const channels = getUserChannels(userId);
            const channel = channels.find(c => String(c.id) === channelId);

            if (!channel) {
                return bot.sendMessage(chatId, `❌ Channel not found in your list.\nUse /mychannels to see your channels.`);
            }

            try { await bot.deleteMessage(chatId, query.message.message_id); } catch (_) {}

            return bot.sendMessage(chatId, buildManagePanel(channel), {
                parse_mode: 'HTML',
                reply_markup: buildManageKeyboard(channel.id, channel.title)
            });
        }

        // dm_remove_CHANNELID
        if (data.startsWith('dm_remove_')) {
            const channelId = data.replace('dm_remove_', '');
            const channels = getUserChannels(userId);
            const channel = channels.find(c => String(c.id) === channelId);
            const name = channel ? channel.title : channelId;

            removeUserChannel(userId, channelId);

            try { await bot.deleteMessage(chatId, query.message.message_id); } catch (_) {}

            return bot.sendMessage(chatId, `✅ <b>${escHtml(name)}</b> removed from your channels.\n\nUse /addchannel to add it back anytime.`, {
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [[{ text: '📋 My Channels', callback_data: 'dm_mychannels' }]] }
            });
        }

        // ── Content posting actions ─────────────────────────────────────────────
        const postMatch = data.match(/^dm_post_(\w+)_(-?\d+)$/);
        if (postMatch) {
            const [, type, channelId] = postMatch;
            const channels = getUserChannels(userId);
            const channel = channels.find(c => String(c.id) === channelId);

            if (!channel) {
                return bot.sendMessage(chatId, `❌ You don't manage channel <code>${channelId}</code>`, { parse_mode: 'HTML' });
            }

            await bot.sendMessage(chatId, `📤 <b>Posting to ${escHtml(channel.title)}...</b>`, { parse_mode: 'HTML' });

            try {
                if (type === 'tip') {
                    // Post a random tech tip
                    const tip = pollsContent.getRandom(techContent.techTips);
                    await bot.sendMessage(channelId, `${tip.content}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📲 Powered by <a href="https://t.me/t20_control_bot">@t20_control_bot</a>`, { parse_mode: 'HTML' });

                } else if (type === 'poll') {
                    const poll = pollsContent.getRandom(pollsContent.techOpinionPolls.concat(pollsContent.funCommunityPolls));
                    const opts = { type: 'regular', is_anonymous: false };
                    await bot.sendPoll(channelId, poll.question, poll.options, opts);

                } else if (type === 'quiz') {
                    const quiz = pollsContent.getRandom(pollsContent.techQuizPolls);
                    const opts = {
                        type: 'quiz',
                        correct_option_id: quiz.correct_option_id,
                        explanation: quiz.explanation,
                        is_anonymous: false,
                    };
                    await bot.sendPoll(channelId, quiz.question, quiz.options, opts);

                } else if (type === 'movie') {
                    await bot.sendMessage(channelId, `🎬 <b>Movie Hub</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🍿 Search movies: /moviesearch\n🔥 Trending: /trending\n🌐 <a href="https://blazemoviehub.t20tech.site">BlazeMovieHub</a>`, {
                        parse_mode: 'HTML'
                    });

                } else if (type === 'matter') {
                    const matter = pollsContent.getRandom(techContent.techMatters);
                    await bot.sendMessage(channelId, `${matter.content}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📲 Powered by <a href="https://t.me/t20_control_bot">@t20_control_bot</a>`, { parse_mode: 'HTML' });

                } else if (type === 'daily') {
                    const q = pollsContent.getRandom(pollsContent.dailyQuestions);
                    await bot.sendPoll(channelId, q.question, q.options, { type: 'regular', is_anonymous: false });
                }

                await bot.sendMessage(chatId, `✅ <b>Posted successfully!</b>\n\nPost sent to <b>${escHtml(channel.title)}</b>.`, {
                    parse_mode: 'HTML',
                    reply_markup: buildManageKeyboard(channel.id, channel.title)
                });

            } catch (err) {
                const errText = err.message.includes('not enough rights')
                    ? `❌ <b>Permission denied!</b>\nMake sure I have "Post Messages" rights in the channel.`
                    : `❌ <b>Post failed:</b> ${escHtml(err.message)}`;
                await bot.sendMessage(chatId, errText, { parse_mode: 'HTML' });
            }
        }
    });

    // ── /channelpost — custom text post to registered channel ─────────────────
    bot.onText(/\/channelpost(?:\s+(.+))?/s, async (msg, match) => {
        if (msg.chat.type !== 'private') return;

        const userId = msg.from.id;
        const channels = getUserChannels(userId);

        if (!channels.length) {
            return bot.sendMessage(msg.chat.id, `❌ No registered channels.\nUse /addchannel first.`, { parse_mode: 'HTML' });
        }

        const text = match[1]?.trim();
        if (!text) {
            return bot.sendMessage(msg.chat.id, `📝 <b>Usage:</b>\n<code>/channelpost Your message here</code>\n\nThis posts your text to your first registered channel.`, { parse_mode: 'HTML' });
        }

        const channel = channels[0];
        try {
            await bot.sendMessage(channel.id, text, { parse_mode: 'HTML' });
            await bot.sendMessage(msg.chat.id, `✅ <b>Posted to ${escHtml(channel.title)}!</b>`, { parse_mode: 'HTML' });
        } catch (err) {
            await bot.sendMessage(msg.chat.id, `❌ Failed: ${escHtml(err.message)}`, { parse_mode: 'HTML' });
        }
    });

    // ── /channelpoll — send a poll to registered channel ─────────────────────
    bot.onText(/\/channelpoll(?:\s+(tech|quiz|fun|daily))?/, async (msg, match) => {
        if (msg.chat.type !== 'private') {
            return bot.sendMessage(msg.chat.id,
                `📲 <b>Use /channelpoll in DM with me.</b>\n\nTypes: tech, quiz, fun, daily`, { parse_mode: 'HTML' });
        }

        const userId = msg.from.id;
        const channels = getUserChannels(userId);
        const type = match[1] || 'tech';

        if (!channels.length) {
            return bot.sendMessage(msg.chat.id, `❌ No registered channels.\nUse /addchannel first.`);
        }

        if (channels.length === 1) {
            // Auto-pick the only channel
            const channel = channels[0];
            return postPollToChannel(bot, msg.chat.id, channel, type);
        }

        // Multiple channels — pick
        const buttons = channels.map(c => ([
            { text: `📢 ${c.title.slice(0, 30)}`, callback_data: `dm_post_${type === 'quiz' ? 'quiz' : 'poll'}_${c.id}` }
        ]));

        await bot.sendMessage(msg.chat.id, `📊 <b>Choose channel for ${type} poll:</b>`, {
            parse_mode: 'HTML',
            reply_markup: { inline_keyboard: buttons }
        });
    });

};

// Helper for /channelpoll flow
async function postPollToChannel(bot, dmChatId, channel, type) {
    let poll;
    let opts = { is_anonymous: false };

    if (type === 'quiz') {
        poll = pollsContent.getRandom(pollsContent.techQuizPolls);
        opts.type = 'quiz';
        opts.correct_option_id = poll.correct_option_id;
        opts.explanation = poll.explanation;
    } else if (type === 'fun') {
        poll = pollsContent.getRandom(pollsContent.funCommunityPolls);
        opts.type = 'regular';
    } else if (type === 'daily') {
        poll = pollsContent.getRandom(pollsContent.dailyQuestions);
        opts.type = 'regular';
    } else {
        poll = pollsContent.getRandom(pollsContent.techOpinionPolls);
        opts.type = 'regular';
    }

    try {
        await bot.sendPoll(channel.id, poll.question, poll.options, opts);
        await bot.sendMessage(dmChatId, `✅ <b>${type} poll sent to ${channel.title}!</b>`, { parse_mode: 'HTML' });
    } catch (err) {
        await bot.sendMessage(dmChatId, `❌ Failed: ${err.message}`, { parse_mode: 'HTML' });
    }
}

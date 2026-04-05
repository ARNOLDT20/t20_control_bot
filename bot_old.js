// t20_control_bot.js - Enhanced with multiple plugins
const TelegramBot = require('node-telegram-bot-api');
const { SocksProxyAgent } = require('socks-proxy-agent');

// === CONFIG ===
const TOKEN = (process.env.TELEGRAM_TOKEN || '').trim();
const CHANNEL_ID = process.env.CHANNEL_ID || '@t20classictech'; // Set via CHANNEL_ID env var
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').filter(id => id.trim()).map(Number); // Comma-separated admin user IDs

if (!TOKEN) {
    console.error('Missing TELEGRAM_TOKEN environment variable. Set TELEGRAM_TOKEN and restart the bot.');
    process.exit(1);
}

// Optional: configure SOCKS5 proxy via environment variable `SOCKS_PROXY`.
// Example: set `SOCKS_PROXY=socks5://127.0.0.1:1080` when needed.
const PROXY_URL = process.env.SOCKS_PROXY || null;
const PROXY_AGENT = PROXY_URL ? new SocksProxyAgent(PROXY_URL) : null;

// Helper function to check if user is admin
const isAdmin = (userId) => {
    return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(userId);
};

// Create bot
const bot = new TelegramBot(TOKEN, {
    polling: false,
    request: PROXY_AGENT ? { agent: PROXY_AGENT } : undefined
});

bot.getMe()
    .then((me) => {
        console.log(`🚀 T20 CONTROL BOT ONLINE as @${me.username}`);
        if (PROXY_URL) console.log("Using SOCKS proxy:", PROXY_URL);
        else console.log("No SOCKS proxy configured (connecting directly)");
        console.log(`📢 Channel: ${CHANNEL_ID}`);
        console.log(`👥 Admin Restrictions: ${ADMIN_IDS.length > 0 ? 'Enabled (' + ADMIN_IDS.length + ' admins)' : 'Disabled (all users can admin)'}`);
        bot.startPolling();
    })
    .catch((err) => {
        console.error('Failed to authenticate bot token:', err.message || err);
        if (err.response && err.response.body) {
            console.error('Telegram error response:', err.response.body);
            if (err.response.body.error_code === 404) {
                console.error('Invalid bot token. Verify the token from BotFather or create a new bot token.');
            }
        }
        process.exit(1);
    });

// === STORE GROUPS ===
let groups = [];

// === AUTO-POSTING CONTENT ===
const techTips = [
    "💡 <b>Did you know?</b>\nUse <code>const</code> and <code>let</code> in JavaScript instead of <code>var</code> for better scoping and performance.",
    "⚡ <b>Quick Tip:</b>\nAlways validate user input on the server-side, even if you validate on the client-side!",
    "🔒 <b>Security Tip:</b>\nNever commit passwords or API keys to version control. Use environment variables instead.",
    "📊 <b>Performance Hack:</b>\nUse <code>debounce</code> for search inputs to reduce API calls by up to 90%.",
    "🎯 <b>Code Quality:</b>\nWrite descriptive variable names. <code>const userData</code> is better than <code>const d</code>.",
    "🚀 <b>DevOps Tip:</b>\nUse containerization (Docker) to ensure your app runs the same everywhere.",
    "🔄 <b>Git Best Practice:</b>\nCommit early, commit often. Small, focused commits are easier to review and debug.",
    "💻 <b>Frontend Hack:</b>\nUse CSS Grid for layouts instead of flexbox when you need 2D alignment.",
    "🌐 <b>Web Tip:</b>\nMinify and compress your assets. Every KB counts for mobile users.",
    "🧪 <b>Testing Tip:</b>\nWrite unit tests for critical functions. It catches bugs 10x faster than manual testing!",
    "🔑 <b>API Design:</b>\nAlways use HTTPS for APIs. Never send data in plain text.",
    "📱 <b>Mobile First:</b>\nDesign for mobile first, then scale up. Mobile users are 80% of web traffic.",
    "⏱️ <b>Performance:</b>\nDatabase indexes are your friend. They can speed up queries by 100x!",
    "🎨 <b>UI/UX Tip:</b>\nWhitespace is not empty. It guides the user's attention.",
    "🤖 <b>Automation:</b>\nUse templates and generators to avoid repetitive code.",
];

const techQuestions = [
    "❓ <b>Question of the Hour:</b>\nWhat's the difference between <code>==</code> and <code>=== </code> in JavaScript?",
    "🤔 <b>Tech Question:</b>\nHow many HTTP status codes do you know? (Hint: There are 60+ !)",
    "💭 <b>Discussion:</b>\nSQL or NoSQL? When should you use each?",
    "🧠 <b>Challenge:</b>\nCan you explain REST API principles in one sentence?",
    "❓ <b>Question:</b>\nWhat makes a good code comment?",
    "🎓 <b>Learning Q:</b>\nWhat's the difference between synchronous and asynchronous programming?",
    "🔍 <b>Think About:</b>\nWhy is DRY (Don't Repeat Yourself) important?",
    "💡 <b>Quiz:</b>\nWhat's the time complexity of binary search?",
    "🤓 <b>Brain Teaser:</b>\nHow would you explain cloud computing to a 5-year-old?",
    "📚 <b>Question:</b>\nWhat's the difference between TCP and UDP?",
    "🎯 <b>Challenge:</b>\nCan you write a function that reverses a string in 3 ways?",
    "🧩 <b>Logic Puzzle:</b>\nHow do you detect if a linked list has a cycle?",
    "⚙️ <b>Question:</b>\nWhat are microservices and when should you use them?",
    "🔐 <b>Security Q:</b>\nWhat's Cross-Site Scripting (XSS) and how do you prevent it?",
    "⏰ <b>Think:</b>\nHow would you optimize a slow database query?",
];

const motivationalMessages = [
    "🚀 Keep coding, keep growing!",
    "💪 Every bug fixed is a lesson learned!",
    "✨ Your code is getting better every day.",
    "🎯 Focus on solving one problem at a time.",
    "🌟 Great developers never stop learning!",
    "💻 Code today, create tomorrow!",
    "🏆 You're building something amazing!",
    "⚙️ Quality code takes time - and that's okay!",
];

// === AUTO-POSTING STATE ===
let autoPostingEnabled = true;
let autoPostingInterval = null;
const AUTO_POST_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

// Helper to get random item
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// === AUTO-POSTING FUNCTION ===
const postAutoContent = () => {
    const contentTypes = [1, 2, 3]; // 1=tip, 2=question, 3=motivation+tip
    const type = getRandomItem(contentTypes);

    let message = '';
    if (type === 1) {
        message = getRandomItem(techTips);
    } else if (type === 2) {
        message = getRandomItem(techQuestions) + '\n\n' + getRandomItem(motivationalMessages);
    } else {
        message = getRandomItem(techTips) + '\n\n' + getRandomItem(motivationalMessages);
    }

    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    message += `\n\n<i>Posted at ${time}</i>`;

    bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'HTML' })
        .then(() => {
            console.log(`✅ [${new Date().toLocaleString()}] Auto-post sent successfully`);
        })
        .catch(err => {
            console.error(`❌ [${new Date().toLocaleString()}] Auto-post failed:`, err.message);
        });
};

// Start auto-posting
const startAutoPosting = () => {
    if (autoPostingInterval) return; // Already running

    console.log(`📅 Auto-posting enabled! Next post in 1 hour...`);
    autoPostingEnabled = true;

    // Post immediately on start
    postAutoContent();

    // Then post every hour
    autoPostingInterval = setInterval(postAutoContent, AUTO_POST_INTERVAL_MS);
};

// Stop auto-posting
const stopAutoPosting = () => {
    if (autoPostingInterval) {
        clearInterval(autoPostingInterval);
        autoPostingInterval = null;
    }
    autoPostingEnabled = false;
    console.log(`⏸️ Auto-posting disabled`);
};

// Start auto-posting on bot startup
setTimeout(startAutoPosting, 2000); // Wait 2 seconds for bot to fully initialize

bot.onText(/\/start/, (msg) => {
    const helpText = `🤖 <b>T20 CONTROL BOT v2.0</b>

<b>👤 User Commands:</b>
/id - show your user ID & chat ID
/userinfo - get user info (reply to message)
/stats - bot statistics
/echo [text] - echo back your message
/help - show help message

<b>🔧 Admin Commands:</b>
/kick - kick user (reply to message)
/ban - ban user (reply to message)
/unban [user_id] - unban user
/mute - mute user (reply to message)
/unmute - unmute user (reply to message)
/delete - delete message (reply to message)
/pin - pin message (reply to message)
/post [text] - post to channel
/testchannel - test channel connection
/setchannel [channel_id] - set posting channel
/broadcast [text] - send to all groups
/admin list - show admins

<b>📅 Auto-Posting Commands:</b>
/autopost on - enable auto-posting
/autopost off - disable auto-posting
/autopost now - post immediately
/autopost status - check auto-posting status

<b>⚙️ Bot Info:</b>
Channel: ${CHANNEL_ID}
Admins: ${ADMIN_IDS.length > 0 ? ADMIN_IDS.join(', ') : 'Not configured (all users can admin)'}
Auto-Post: ${autoPostingEnabled ? '🟢 Running' : '🔴 Stopped'}`;

    bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
});

// === HELP COMMAND ===
bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, '📚 Use /start to see all available commands.', { parse_mode: 'HTML' });
});

// === SAVE GROUPS & WELCOME NEW MEMBERS ===
bot.on("message", (msg) => {
    if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }
    }

    if (msg.new_chat_members && msg.new_chat_members.length) {
        msg.new_chat_members.forEach(user => {
            bot.sendMessage(msg.chat.id, `👋 Welcome ${user.first_name} to the group!`);
        });
    }
});

// === GET CHAT ID ===
bot.onText(/\/id/, (msg) => {
    const info = `👤 <b>User Info:</b>
ID: <code>${msg.from.id}</code>
Name: ${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}
Username: ${msg.from.username ? '@' + msg.from.username : 'None'}

💬 <b>Chat Info:</b>
Chat ID: <code>${msg.chat.id}</code>
Type: ${msg.chat.type}`;
    bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
});

// === USER INFO ===
bot.onText(/\/userinfo/, (msg) => {
    if (msg.reply_to_message) {
        const user = msg.reply_to_message.from;
        const info = `👤 <b>User Information:</b>
ID: <code>${user.id}</code>
First Name: ${user.first_name}
Last Name: ${user.last_name || 'N/A'}
Username: ${user.username ? '@' + user.username : 'None'}
Is Bot: ${user.is_bot ? 'Yes' : 'No'}
Language: ${user.language_code || 'N/A'}`;
        bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
    } else {
        bot.sendMessage(msg.chat.id, '📝 Reply to a message to get user info.');
    }
});

// === STATS ===
bot.onText(/\/stats/, (msg) => {
    const stats = `📊 <b>Bot Statistics:</b>
Groups Tracked: ${groups.length}
Admins Configured: ${ADMIN_IDS.length}
Channel: ${CHANNEL_ID}
Status: 🟢 Online`;
    bot.sendMessage(msg.chat.id, stats, { parse_mode: 'HTML' });
});

// === ECHO ===
bot.onText(/\/echo(?:\s+(.+))?/, (msg, match) => {
    const text = match[1] || 'No text provided';
    bot.sendMessage(msg.chat.id, `🔊 Echo: ${text}`);
});

// === KICK USER ===
bot.onText(/\/kick/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        const userId = msg.reply_to_message.from.id;
        bot.banChatMember(msg.chat.id, userId)
            .then(() => bot.unbanChatMember(msg.chat.id, userId))
            .then(() => bot.sendMessage(msg.chat.id, "👢 User kicked"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to kick the user.");
    }
});

// === BAN USER ===
bot.onText(/\/ban/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        const userId = msg.reply_to_message.from.id;
        bot.banChatMember(msg.chat.id, userId)
            .then(() => bot.sendMessage(msg.chat.id, "🚫 User banned"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to ban the user.");
    }
});

// === UNBAN USER ===
bot.onText(/\/unban\s+(.+)/, (msg, match) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    const userId = match[1].trim();
    bot.unbanChatMember(msg.chat.id, userId)
        .then(() => bot.sendMessage(msg.chat.id, "✅ User unbanned"))
        .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
});

// === MUTE USER ===
bot.onText(/\/mute/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        const userId = msg.reply_to_message.from.id;
        bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: false })
            .then(() => bot.sendMessage(msg.chat.id, "🔇 User muted"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to mute the user.");
    }
});

// === UNMUTE USER ===
bot.onText(/\/unmute/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        const userId = msg.reply_to_message.from.id;
        bot.restrictChatMember(msg.chat.id, userId, { can_send_messages: true })
            .then(() => bot.sendMessage(msg.chat.id, "🔊 User unmuted"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to unmute the user.");
    }
});

// === DELETE MESSAGE ===
bot.onText(/\/delete/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id)
            .then(() => bot.sendMessage(msg.chat.id, "🗑️ Message deleted"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to delete it.");
    }
});

// === PIN MESSAGE ===
bot.onText(/\/pin/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    if (msg.reply_to_message) {
        bot.pinChatMessage(msg.chat.id, msg.reply_to_message.message_id)
            .then(() => bot.sendMessage(msg.chat.id, "📌 Message pinned"))
            .catch(err => bot.sendMessage(msg.chat.id, `⚠️ Error: ${err.message}`));
    } else {
        bot.sendMessage(msg.chat.id, "📝 Reply to a message to pin it.");
    }
});

// === POST TO CHANNEL ===
bot.onText(/\/post\s+(.+)/s, (msg, match) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    const text = match[1].trim();
    if (!text) {
        bot.sendMessage(msg.chat.id, "📝 Usage: /post [text]");
        return;
    }

    console.log(`📮 Attempting to post to channel: ${CHANNEL_ID}`);
    console.log(`📝 Message content: ${text.substring(0, 50)}...`);

    bot.sendMessage(CHANNEL_ID, text, { parse_mode: 'HTML' })
        .then((sentMsg) => {
            console.log(`✅ Successfully posted message ID: ${sentMsg.message_id}`);
            bot.sendMessage(msg.chat.id, `✅ Posted to channel: <b>${CHANNEL_ID}</b>\nMessage ID: ${sentMsg.message_id}`, { parse_mode: 'HTML' });
        })
        .catch(err => {
            console.error(`❌ Error posting to channel ${CHANNEL_ID}:`, err.message || err);
            if (err.response && err.response.body) {
                console.error('Telegram error:', JSON.stringify(err.response.body, null, 2));
            }
            bot.sendMessage(msg.chat.id, `⚠️ Error posting to channel: ${err.message}\n\nMake sure:\n1. Bot is a member of the channel\n2. Bot has admin/post permissions\n3. Channel ID is correct: ${CHANNEL_ID}`, { parse_mode: 'HTML' });
        });
});

// === SET CHANNEL ===
bot.onText(/\/setchannel\s+(.+)/, (msg, match) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    const newChannel = match[1].trim();
    bot.sendMessage(msg.chat.id, `⚠️ Channel changed to: <b>${newChannel}</b>\n(This resets on bot restart unless saved to .env)`, { parse_mode: 'HTML' });
});

// === TEST CHANNEL CONNECTION ===
bot.onText(/\/testchannel/, (msg) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }

    console.log(`🧪 Testing channel: ${CHANNEL_ID}`);

    const testMsg = `🧪 <b>Channel Test</b>\nTime: ${new Date().toLocaleString()}\nBot Test Posting`;

    bot.sendMessage(CHANNEL_ID, testMsg, { parse_mode: 'HTML' })
        .then((sentMsg) => {
            bot.sendMessage(msg.chat.id, `✅ <b>Channel Test Passed!</b>\n\nBot can successfully post to: <b>${CHANNEL_ID}</b>\nMessage ID: ${sentMsg.message_id}\n\nYou can now use /post [text] to post messages.`, { parse_mode: 'HTML' });
            console.log(`✅ Test successful to ${CHANNEL_ID}`);
        })
        .catch(err => {
            let errorMsg = `❌ <b>Channel Test Failed!</b>\n\nError: ${err.message}\n\n`;

            if (err.response && err.response.body) {
                if (err.response.body.error_code === 400) {
                    errorMsg += `<b>Possible issues:</b>\n1. Channel ID format is wrong\n2. Bot is not a member of the channel\n\n<b>Solution:</b> Use the numeric channel ID (e.g., -1001234567890)\nOr use: <code>setx CHANNEL_ID "-1001234567890"</code>`;
                } else if (err.response.body.error_code === 403) {
                    errorMsg += `<b>Permission Denied!</b>\n1. Make bot an admin in the channel\n2. Give bot permission to post messages`;
                } else if (err.response.body.error_code === 404) {
                    errorMsg += `<b>Channel Not Found!</b>\nMake sure the channel ID or username is correct.`;
                }
            }

            bot.sendMessage(msg.chat.id, errorMsg, { parse_mode: 'HTML' });
            console.error(`❌ Test failed:`, err.response?.body || err.message);
        });
});

// === BROADCAST TO ALL GROUPS ===
bot.onText(/\/broadcast\s+(.+)/s, (msg, match) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }
    const text = match[1].trim();
    if (!text) {
        bot.sendMessage(msg.chat.id, "📝 Usage: /broadcast [text]");
        return;
    }
    let successCount = 0;
    groups.forEach(id => {
        bot.sendMessage(id, text)
            .then(() => successCount++)
            .catch(err => console.error(`Failed to broadcast to ${id}:`, err.message));
    });
    bot.sendMessage(msg.chat.id, `📢 Broadcast sent to ${groups.length} groups`);
});

// === AUTO-POSTING CONTROL ===
bot.onText(/\/autopost\s+(on|off|now|status)/, (msg, match) => {
    if (!isAdmin(msg.from.id)) {
        bot.sendMessage(msg.chat.id, "❌ Admin command only.");
        return;
    }

    const action = match[1].toLowerCase();

    if (action === 'on') {
        if (autoPostingEnabled) {
            bot.sendMessage(msg.chat.id, "📅 Auto-posting is already running!");
            return;
        }
        startAutoPosting();
        bot.sendMessage(msg.chat.id, "✅ <b>Auto-posting enabled!</b>\nThe bot will post tech tips and questions every 1 hour.", { parse_mode: 'HTML' });

    } else if (action === 'off') {
        if (!autoPostingEnabled) {
            bot.sendMessage(msg.chat.id, "📴 Auto-posting is already stopped!");
            return;
        }
        stopAutoPosting();
        bot.sendMessage(msg.chat.id, "⏹️ <b>Auto-posting disabled.</b>\nYou can turn it back on with /autopost on", { parse_mode: 'HTML' });

    } else if (action === 'now') {
        postAutoContent();
        bot.sendMessage(msg.chat.id, "📤 <b>Posted now to channel!</b>", { parse_mode: 'HTML' });

    } else if (action === 'status') {
        const status = autoPostingEnabled ? '🟢 Running' : '🔴 Stopped';
        const nextPost = autoPostingEnabled ? 'Every 1 hour' : 'N/A';
        bot.sendMessage(msg.chat.id, `📊 <b>Auto-Posting Status:</b>\nStatus: ${status}\nNext Post: ${nextPost}\nChannel: ${CHANNEL_ID}`, { parse_mode: 'HTML' });
    }
});

// === ADMIN MANAGEMENT ===
bot.onText(/\/admin\s+(list)/, (msg) => {
    if (ADMIN_IDS.length === 0) {
        bot.sendMessage(msg.chat.id, "⚙️ No admin restrictions (all users can use admin commands).\n\nSet ADMIN_IDS environment variable to restrict.");
    } else {
        bot.sendMessage(msg.chat.id, `👥 <b>Current Admins:</b>\n<code>${ADMIN_IDS.join('\n')}</code>`, { parse_mode: 'HTML' });
    }
});

// === ERROR HANDLER ===
bot.on('error', (err) => {
    console.error('Bot error:', err);
});

// === POLLING ERROR HANDLER ===
bot.on("polling_error", (err) => {
    console.error("Polling error:", err);
    if (err && err.response && err.response.body) {
        console.error('Telegram response body:', JSON.stringify(err.response.body, null, 2));
    }
    if (err && err.code === 'ECONNREFUSED' && PROXY_URL) {
        console.error('Connection refused to proxy. Either start a SOCKS proxy at the configured address, or unset the SOCKS_PROXY environment variable to connect directly.');
    }
});

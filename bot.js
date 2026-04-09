// T20 Control Bot - Main Entry Point
// Modular plugin-based architecture

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { SocksProxyAgent } = require('socks-proxy-agent');
const pluginLoader = require('./plugins');
const styles = require('./utils/styles');
const blogFetcher = require('./utils/blogFetcher');
const { TOKEN, CHANNEL_ID, ADMIN_IDS, PROXY_URL } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

if (!TOKEN) {
    console.error('Missing TELEGRAM_TOKEN environment variable. Set TELEGRAM_TOKEN and restart the bot.');
    process.exit(1);
}

const PROXY_AGENT = PROXY_URL ? new SocksProxyAgent(PROXY_URL) : null;

// Health check endpoint for Heroku
app.get('/', (req, res) => {
    res.status(200).send('🤖 T20 Bot is alive!');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', bot: 'T20 Control Bot', timestamp: new Date().toISOString() });
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`🌐 HTTP Server listening on port ${PORT}`);
});

// Helper function to check if user is admin
const isAdmin = (userId) => {
    return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(userId);
};

// Store groups and bot startup time
let groups = [];
const botStartTime = Date.now(); // Track when bot starts

// Save groups when messages are received
const handleGroupMessages = (bot) => {
    bot.on("message", (msg) => {
        if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
            if (!groups.includes(msg.chat.id)) {
                groups.push(msg.chat.id);
            }
        }
    });
};

// Create bot
const bot = new TelegramBot(TOKEN, {
    polling: false,
    request: PROXY_AGENT ? { agent: PROXY_AGENT } : undefined
});

// Authenticate and start bot
bot.getMe()
    .then((me) => {
        console.log('\n' + '═'.repeat(50));
        console.log('🚀 T20 CONTROL BOT ONLINE');
        console.log('═'.repeat(50));
        console.log(`Bot Name: @${me.username}`);
        console.log(`Bot ID: ${me.id}`);
        console.log(`Status: 🟢 Connected`);
        console.log(`Channel: ${CHANNEL_ID}`);
        console.log(`Admin Mode: ${ADMIN_IDS.length > 0 ? '✅ Enabled (' + ADMIN_IDS.length + ' admins)' : '⚠️ Disabled'}`);
        console.log(`Proxy: ${PROXY_URL ? '✅ ' + PROXY_URL : '❌ Direct connection'}`);
        console.log('═'.repeat(50) + '\n');

        // Start polling
        bot.startPolling();

        // Setup /start command (slightly enhanced header only)
        bot.onText(/\/start/, (msg) => {
            const helpText = `${styles.header('T20 CONTROL BOT v3.0', '🤖')}
<i>The Ultimate Telegram Group Management System</i>
${styles.dividerLong}

${styles.section('👤', 'User Commands', [
                styles.listItem('🆔', '/id — Your user & chat ID'),
                styles.listItem('👨‍💼', '/userinfo — Get user info (reply)'),
                styles.listItem('📊', '/stats — Bot statistics'),
                styles.listItem('🔊', '/echo — Echo back text'),
                styles.listItem('🏓', '/ping — Check latency'),
                styles.listItem('👥', '/groupinfo — Group information'),
                styles.listItem('👨‍👩‍👦', '/members — Count members'),
                styles.listItem('💳', '/profile — Your profile'),
            ])}

${styles.section('🎮', 'Fun Commands', [
                styles.listItem('🎱', '/8ball — Magic 8 ball'),
                styles.listItem('🎲', '/roll — Roll dice'),
                styles.listItem('🪙', '/flip — Flip coin'),
                styles.listItem('🎯', '/choose — Choose from options'),
                styles.listItem('⭐', '/rate — Rate something'),
                styles.listItem('😂', '/joke — Get a joke'),
                styles.listItem('🔄', '/reverse — Reverse text'),
                styles.listItem('🔤', '/upper, /lower — Case change'),
            ])}

${styles.section('🔧', 'Admin Commands', [
                styles.listItem('🚫', '/kick — Kick user (reply)'),
                styles.listItem('⛔', '/ban — Ban user (reply)'),
                styles.listItem('✅', '/unban — Unban user'),
                styles.listItem('🔇', '/mute — Mute user (reply)'),
                styles.listItem('🔊', '/unmute — Unmute user (reply)'),
                styles.listItem('🗑️', '/delete — Delete message (reply)'),
                styles.listItem('📌', '/pin — Pin message (reply)'),
                styles.listItem('📌', '/unpin — Unpin message (reply)'),
            ])}

${styles.section('⚠️', 'Moderation', [
                styles.listItem('⚠️', '/warn — Warn user (reply)'),
                styles.listItem('📊', '/warnings — Check warnings'),
                styles.listItem('🧹', '/clearwarn — Clear warnings'),
                styles.listItem('⏱️', '/timeout — Mute for time'),
                styles.listItem('🔄', '/softban — Kick user'),
            ])}

${styles.section('⚙️', 'Settings', [
                styles.listItem('🎛️', '/settings — View settings'),
                styles.listItem('🌐', '/setlang — Set language'),
                styles.listItem('🛡️', '/antispam — Toggle anti-spam'),
                styles.listItem('👋', '/togglewelcome — Welcome toggle'),
                styles.listItem('📋', '/setrules — Set group rules'),
                styles.listItem('📋', '/rules — View rules'),
            ])}

${styles.section('📢', 'Channel Commands', [
                styles.listItem('📝', '/post — Post to channel'),
                styles.listItem('🧪', '/testchannel — Test connection'),
                styles.listItem('📡', '/broadcast — Send to all groups'),
            ])}

${styles.section('📅', 'Auto-Posting', [
                styles.listItem('▶️', '/autopost on — Enable'),
                styles.listItem('⏹️', '/autopost off — Disable'),
                styles.listItem('⏰', '/autopost now — Post now'),
                styles.listItem('📊', '/autopost status — Check status'),
            ])}

${styles.section('👥', 'Group Management', [
                styles.listItem('👋', '/welcome on/off toggle'),
                styles.listItem('🌙', '/goodbye on/off toggle'),
                styles.listItem('🧪', '/testwelcome — Test welcome'),
                styles.listItem('🧪', '/testgoodbye — Test goodbye'),
            ])}

${styles.section('🎯', 'System', [
                styles.listItem('🗂️', '/menu — Command menu'),
                styles.listItem('👮', '/admin list — Show admins'),
                styles.listItem('❓', '/help — Bot help'),
            ])}

${styles.dividerLong}
<b>⚡ Status:</b> ${styles.status.online}
<b>📢 Channel:</b> ${CHANNEL_ID}
<b>👥 Admins:</b> ${ADMIN_IDS.length || 'All users'}`;

            bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
        });

        // Error handlers
        bot.on('error', (err) => {
            console.error('Bot error:', err);
        });

        bot.on("polling_error", (err) => {
            console.error("Polling error:", err);
            if (err && err.response && err.response.body) {
                console.error('Telegram response body:', JSON.stringify(err.response.body, null, 2));
            }
        });

        // Setup group handling
        handleGroupMessages(bot);

        // Load plugins
        const plugins = pluginLoader(bot, isAdmin, CHANNEL_ID, ADMIN_IDS, groups, botStartTime);

        // Blog fetcher
        console.log('📚 Initializing blog fetcher from T20 Tech sources...');
        blogFetcher.fetchAllBlogs(true)
            .then((blogs) => {
                console.log(`✅ Blog fetcher initialized with ${blogs.length} blogs`);
                setInterval(() => {
                    blogFetcher.fetchAllBlogs(true)
                        .then((newBlogs) => {
                            console.log(`🔄 Blog cache refreshed: ${newBlogs.length} blogs available`);
                        })
                        .catch(err => {
                            console.warn(`⚠️ Blog refresh failed: ${err.message}`);
                        });
                }, 12 * 60 * 60 * 1000);
            })
            .catch((err) => {
                console.warn(`⚠️ Blog fetcher initialization failed: ${err.message}`);
                console.log('📝 Bot will continue with tech tips and questions only');
            });

    })
    .catch((err) => {
        console.error('❌ Failed to authenticate bot token:', err.message || err);
        if (err.response && err.response.body) {
            console.error('Telegram error response:', err.response.body);
        }
        process.exit(1);
    });

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('🔌 SIGINT received, shutting down gracefully...');
    try {
        bot.stopPolling();
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error stopping bot polling:', err);
        process.exit(1);
    }
});

process.on('SIGTERM', () => {
    console.log('🔌 SIGTERM received, shutting down gracefully...');
    try {
        bot.stopPolling();
        server.close(() => {
            console.log('✅ HTTP server closed');
            process.exit(0);
        });
    } catch (err) {
        console.error('Error stopping bot polling:', err);
        process.exit(1);
    }
});
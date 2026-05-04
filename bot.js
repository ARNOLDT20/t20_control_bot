// T20 Control Bot - Main Entry Point
// Modular plugin-based architecture

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { SocksProxyAgent } = require('socks-proxy-agent');
const pluginLoader = require('./plugins');
const blogFetcher = require('./utils/blogFetcher');
const { TOKEN, CHANNEL_ID, ADMIN_IDS, PROXY_URL } = require('./config');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Setup page HTML (shown when TELEGRAM_TOKEN is not set) ─────────────────
const setupPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>T20 Wolf Bot — Setup</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; max-width: 640px; width: 100%; padding: 40px; }
    .logo { font-size: 48px; text-align: center; margin-bottom: 12px; }
    h1 { text-align: center; font-size: 24px; color: #f0d060; margin-bottom: 6px; }
    .subtitle { text-align: center; color: #8b949e; margin-bottom: 28px; font-size: 14px; }
    .badge { display: inline-block; background: #21262d; border: 1px solid #30363d; border-radius: 6px; padding: 4px 10px; font-size: 12px; color: #7ee787; margin-bottom: 24px; }
    .step { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 16px 20px; margin-bottom: 14px; display: flex; gap: 14px; align-items: flex-start; }
    .step-num { background: #f0d060; color: #0d1117; font-weight: bold; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 13px; }
    .step-content h3 { font-size: 14px; margin-bottom: 4px; color: #e6edf3; }
    .step-content p { font-size: 13px; color: #8b949e; line-height: 1.5; }
    code { background: #21262d; border: 1px solid #30363d; border-radius: 4px; padding: 2px 6px; font-size: 12px; color: #79c0ff; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #8b949e; margin: 22px 0 10px; }
    .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
    .feature { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 12px; font-size: 13px; }
    .feature .icon { font-size: 20px; margin-bottom: 4px; }
    .feature .name { font-weight: 600; margin-bottom: 2px; }
    .feature .desc { color: #8b949e; font-size: 12px; }
    .alert { background: #161b22; border: 1px solid #f85149; border-radius: 8px; padding: 14px 18px; color: #f85149; font-size: 13px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 24px; color: #8b949e; font-size: 12px; }
    a { color: #79c0ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">🐺</div>
    <h1>T20 Wolf Control Bot</h1>
    <p class="subtitle">Advanced Telegram Bot by Arnold T20</p>
    <div style="text-align:center"><span class="badge">⚙️ Setup Required</span></div>

    <div class="section-title">Setup Steps</div>

    <div class="step">
      <div class="step-num">1</div>
      <div class="step-content">
        <h3>Get your Bot Token</h3>
        <p>Open Telegram and message <a href="https://t.me/BotFather" target="_blank">@BotFather</a>. Send <code>/newbot</code> and follow the prompts to get your token.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">2</div>
      <div class="step-content">
        <h3>Set the TELEGRAM_TOKEN secret</h3>
        <p>In Replit, go to <b>Secrets</b> (lock icon in sidebar) and add:<br/><code>Key: TELEGRAM_TOKEN</code> &nbsp; <code>Value: your_bot_token</code></p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">3</div>
      <div class="step-content">
        <h3>Restart the application</h3>
        <p>Click <b>Stop</b> then <b>Run</b>, or press the Run button. The bot will connect automatically.</p>
      </div>
    </div>

    <div class="step">
      <div class="step-num">4</div>
      <div class="step-content">
        <h3>(Optional) Set admin IDs &amp; channel</h3>
        <p>Add <code>ADMIN_IDS</code> (comma-separated Telegram user IDs) and <code>CHANNEL_ID</code> (e.g. <code>@yourchannel</code>) as secrets for full admin features.</p>
      </div>
    </div>

    <div class="section-title">Bot Features</div>
    <div class="feature-grid">
      <div class="feature">
        <div class="icon">🎬</div>
        <div class="name">Movie Hub</div>
        <div class="desc">Browse &amp; download from BlazeMovieHub with 16 categories</div>
      </div>
      <div class="feature">
        <div class="icon">🤖</div>
        <div class="name">AI Chatbot</div>
        <div class="desc">T20 WOLF AI — intelligent conversation &amp; Q&amp;A</div>
      </div>
      <div class="feature">
        <div class="icon">🔧</div>
        <div class="name">Group Management</div>
        <div class="desc">Kick, ban, mute, warn, timeout, softban</div>
      </div>
      <div class="feature">
        <div class="icon">📅</div>
        <div class="name">Auto-Posting</div>
        <div class="desc">Scheduled tech tips &amp; blog posts every 5 hours</div>
      </div>
      <div class="feature">
        <div class="icon">🎮</div>
        <div class="name">Fun Commands</div>
        <div class="desc">8ball, dice, coin flip, jokes, and more</div>
      </div>
      <div class="feature">
        <div class="icon">⚙️</div>
        <div class="name">Settings</div>
        <div class="desc">Per-group config, welcome msgs, antispam</div>
      </div>
    </div>

    <div class="alert">
      ⚠️ <b>TELEGRAM_TOKEN not set.</b> The bot is running in setup mode. Add your token as a secret and restart to activate the bot.
    </div>

    <div class="footer">
      T20 Wolf Bot &bull; By <b>Arnold T20</b> &bull; <a href="https://blazemoviehub.t20tech.site" target="_blank">BlazeMovieHub</a>
    </div>
  </div>
</body>
</html>`;

// ─── HTTP Routes ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    if (!TOKEN) {
        return res.status(200).send(setupPageHTML);
    }
    res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <title>T20 Wolf Bot</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #0d1117; color: #e6edf3; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
        .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 40px; max-width: 480px; text-align: center; }
        .logo { font-size: 56px; margin-bottom: 12px; }
        h1 { color: #f0d060; margin-bottom: 8px; }
        p { color: #8b949e; margin: 6px 0; font-size: 14px; }
        .status { display: inline-block; background: #1a4731; border: 1px solid #2ea043; border-radius: 20px; padding: 6px 16px; color: #56d364; font-size: 13px; margin: 16px 0; }
        a { color: #79c0ff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">🐺🔥</div>
        <h1>T20 Wolf Bot</h1>
        <div class="status">🟢 Bot Online & Running</div>
        <p>Your advanced Telegram control bot is active.</p>
        <p>Channel: <b>${CHANNEL_ID}</b></p>
        <p>Admins: <b>${ADMIN_IDS.length > 0 ? ADMIN_IDS.length : 'Open (no restriction)'}</b></p>
        <p style="margin-top:16px"><a href="https://blazemoviehub.t20tech.site" target="_blank">🎬 BlazeMovieHub</a></p>
        <p style="margin-top:8px; font-size:12px; color:#555">By Arnold T20</p>
      </div>
    </body>
    </html>`);
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: TOKEN ? 'ok' : 'setup_required',
        bot: 'T20 Wolf Bot',
        token_configured: !!TOKEN,
        timestamp: new Date().toISOString()
    });
});

// ─── Start HTTP server first (always) ────────────────────────────────────────
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 HTTP Server listening on port ${PORT}`);
});

// ─── If no token, warn and stay alive serving setup page ─────────────────────
if (!TOKEN) {
    console.error('');
    console.error('══════════════════════════════════════════════════');
    console.error('⚠️  TELEGRAM_TOKEN is not set!');
    console.error('══════════════════════════════════════════════════');
    console.error('The bot is running in SETUP MODE.');
    console.error('');
    console.error('To activate the bot:');
    console.error('  1. Go to Replit Secrets (lock icon in sidebar)');
    console.error('  2. Add key: TELEGRAM_TOKEN');
    console.error('  3. Value: your bot token from @BotFather');
    console.error('  4. Restart the application');
    console.error('══════════════════════════════════════════════════');
    console.error('');
    console.log('🌐 Setup page is available at the preview URL.');
    // Stay alive — do not exit
    return;
}

// ─── Bot setup ───────────────────────────────────────────────────────────────
const PROXY_AGENT = PROXY_URL ? new SocksProxyAgent(PROXY_URL) : null;

const isAdmin = (userId) => {
    return ADMIN_IDS.length === 0 || ADMIN_IDS.includes(userId);
};

let groups = [];
const botStartTime = Date.now();

const handleGroupMessages = (bot) => {
    bot.on('message', (msg) => {
        if (msg.chat.type === 'group' || msg.chat.type === 'supergroup') {
            if (!groups.includes(msg.chat.id)) {
                groups.push(msg.chat.id);
            }
        }
    });
};

// ─── Webhook or Polling ───────────────────────────────────────────────────────
// Use webhook mode when REPLIT_DEV_DOMAIN is available (avoids 409 conflicts)
// Fall back to polling if no public domain is set
const REPLIT_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
const USE_WEBHOOK = !!REPLIT_DOMAIN;
const WEBHOOK_PATH = `/tg-webhook-${TOKEN.split(':')[0]}`;
const WEBHOOK_URL = USE_WEBHOOK ? `https://${REPLIT_DOMAIN}${WEBHOOK_PATH}` : null;

const bot = new TelegramBot(TOKEN, {
    polling: false,
    request: PROXY_AGENT ? { agent: PROXY_AGENT } : undefined
});

// Webhook endpoint — Telegram POSTs updates here
if (USE_WEBHOOK) {
    app.use(express.json());
    app.post(WEBHOOK_PATH, (req, res) => {
        try {
            bot.processUpdate(req.body);
        } catch (e) {
            console.error('processUpdate error:', e.message);
        }
        res.sendStatus(200);
    });
}

bot.on('error', (err) => {
    if (err.message && !err.message.includes('EFATAL')) {
        console.error('Bot error:', err.message);
    }
});

bot.getMe()
    .then(async (me) => {
        console.log('');
        console.log('═'.repeat(50));
        console.log('🚀 T20 CONTROL BOT ONLINE');
        console.log('═'.repeat(50));
        console.log(`Bot Name  : @${me.username}`);
        console.log(`Bot ID    : ${me.id}`);
        console.log(`Status    : 🟢 Connected`);
        console.log(`Channel   : ${CHANNEL_ID}`);
        console.log(`Mode      : ${USE_WEBHOOK ? '🔗 Webhook' : '📡 Polling'}`);
        console.log(`Admin Mode: ${ADMIN_IDS.length > 0 ? '✅ Enabled (' + ADMIN_IDS.length + ' admins)' : '⚠️ Open (no restriction)'}`);
        console.log('═'.repeat(50));
        console.log('');

        // Register all plugin handlers
        handleGroupMessages(bot);
        const { autoPosting } = pluginLoader(bot, isAdmin, CHANNEL_ID, ADMIN_IDS, groups, botStartTime);

        if (USE_WEBHOOK) {
            // ── Webhook mode ────────────────────────────────────────────────
            try {
                const wh = await bot.getWebHookInfo();
                if (wh.url === WEBHOOK_URL) {
                    console.log(`✅ Webhook already set: ${WEBHOOK_URL}`);
                } else {
                    await bot.setWebHook(WEBHOOK_URL, { drop_pending_updates: true });
                    console.log(`✅ Webhook registered: ${WEBHOOK_URL}`);
                }
            } catch (err) {
                console.error('❌ Failed to set webhook:', err.message);
                console.log('⚠️ Falling back to polling...');
                await startPolling(bot);
            }
        } else {
            // ── Polling fallback ─────────────────────────────────────────────
            await startPolling(bot);
        }

        // ── First-run setup wizard ─────────────────────────────────────────────
        // Triggers when auto-posting has never been configured
        const configStore = require('./utils/configStore');
        if (!configStore.get('autopost.setupDone')) {
            if (ADMIN_IDS.length > 0) {
                // DM each admin the setup wizard after a short delay
                setTimeout(async () => {
                    console.log('🎛️ First run — sending auto-post setup wizard to admins...');
                    for (const adminId of ADMIN_IDS) {
                        try {
                            await autoPosting.sendSetupWizard(bot, adminId);
                        } catch (err) {
                            console.warn(`⚠️ Could not DM admin ${adminId}: ${err.message}`);
                            // Fallback: post wizard in channel
                            try {
                                await autoPosting.sendSetupWizard(bot, CHANNEL_ID);
                            } catch (_) {}
                        }
                    }
                }, 8000);
            } else {
                // No admins set — post setup wizard in channel
                setTimeout(async () => {
                    console.log('🎛️ First run — posting auto-post setup wizard in channel...');
                    try {
                        await autoPosting.sendSetupWizard(bot, CHANNEL_ID);
                    } catch (err) {
                        console.warn(`⚠️ Could not post setup wizard: ${err.message}`);
                    }
                }, 8000);
            }
        }

        // Blog fetcher (background)
        console.log('📚 Initializing blog fetcher...');
        blogFetcher.fetchAllBlogs(true)
            .then((blogs) => {
                console.log(`✅ Blog fetcher ready — ${blogs.length} posts cached`);
                setInterval(() => {
                    blogFetcher.fetchAllBlogs(true)
                        .then(b => console.log(`🔄 Blog cache refreshed: ${b.length} posts`))
                        .catch(e => console.warn(`⚠️ Blog refresh: ${e.message}`));
                }, 12 * 60 * 60 * 1000);
            })
            .catch((err) => {
                console.warn(`⚠️ Blog fetcher failed: ${err.message}`);
            });
    })
    .catch((err) => {
        console.error('❌ Failed to authenticate bot token:', err.message || err);
        process.exit(1);
    });

async function startPolling(bot) {
    try {
        await bot._request('deleteWebhook', { drop_pending_updates: true });
        console.log('✅ Webhook cleared — starting polling...');
    } catch (_) {}

    bot.on('polling_error', (err) => {
        const code = err?.response?.body?.error_code;
        if (code !== 409) {
            console.error('Polling error:', err.message || err);
        }
    });

    bot.startPolling({ interval: 2000, timeout: 10, restart: false });
    console.log('📡 Polling active');
}

// ─── Process handlers ─────────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
    if (reason && reason.message && !reason.message.includes('EFATAL')) {
        console.error('Unhandled Rejection:', reason.message || reason);
    }
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message || err);
});

const gracefulShutdown = (signal) => {
    console.log(`\n🔌 ${signal} — shutting down...`);
    try { bot.stopPolling(); } catch (_) {}
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

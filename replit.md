# T20 Wolf Control Bot

## Overview
Advanced Telegram bot (@t20_control_bot) with group management, AI chatbot, movie download + payment system, and fully schedulable auto-posting. By Arnold T20.

## Architecture
- **Entry Point**: `bot.js` — Express server (port 5000) + Telegram bot in **webhook mode** (no polling)
- **Plugin System**: `plugins/index.js` — Loads all 19 feature modules in order
- **Config**: `config.js` — Environment variable handling
- **Persistent Config**: `data/bot_config.json` — Auto-post settings survive restarts
- **Webhook URL**: `https://$REPLIT_DEV_DOMAIN/tg-webhook-<botId>`

## Required Environment Variables
- `TELEGRAM_TOKEN` — Bot token from @BotFather (required)
- `CHANNEL_ID` — Target channel (default: `@t20classictech`)
- `ADMIN_IDS` — Comma-separated admin user IDs (optional, open mode if unset)
- `SOCKS_PROXY` — SOCKS5 proxy URL (optional)

## Key Features

### 📡 Pro Auto-Posting System (Schedulable)
- **First-run setup wizard** — on first deploy, bot automatically DMs admins (or posts in channel) asking what content to post
- **Modes**: `tech` (tips + polls + matters), `movies` (trending movies), `both` (alternating cycle)
- **Tech cycle** (mode=tech): tip → poll → tech matter → tip → poll → ...
- **Both cycle**: tip → poll → movie → matter → tip → poll → ...
- **Configurable interval**: 1 to 168 hours (1 week max)
- **Config persisted** at `data/bot_config.json` — survives restarts
- **Commands**: `/autopost setup|on|off|now|status|mode|interval|preview`

### 🔬 Tech Content Pool (`utils/techContent.js`)
- **15 tech tips** — PC speed, passwords, privacy, AI tools, battery, dev tips, Linux, 5G, etc.
- **15 polls** — regular & quiz-type Telegram polls with explanations
- **3 tech matters** — long-form editorial content on tech trends
- All content rotates with index tracking to avoid repetition

### 🎬 Movie System (BlazeMovieHub)
- **API**: `https://blazemoviehub.t20tech.site/api` — Bearer token `gifted_movieapi_789fbud2389889dg8962e098g23d6`
- **Commands**: `/movies`, `/moviesearch`, `/download`, `/trending`, `/latestmovies`, `/moviehelp`
- Full interactive flow: Search → Results → Movie Info (poster) → Quality Selection → Payment

### 💳 Payment & Access System
- **Telegram Stars**: 50 Stars per movie — native Stars invoice (currency: `XTR`, empty provider_token)
- **OTP Codes**: Admin generates with `/genotp [count]`, users redeem with `/redeem T20-XXXXXXXX`
- **After payment/OTP**: Sends video trailer + premium download link card
- **Admin OTP**: `/genotp`, `/listotp`, `/revokeop`
- OTPs expire 24h, one-time use only

### 🤖 AI Chatbot (T20 WOLF AI)
- `/chat <message>` — Chat with AI
- DM mode — auto AI responses in private chat

### 👥 Group Management
- Admin: kick, ban, unban, mute, unmute, delete, pin, setstatus
- Moderation: warn (auto-kick at 3), timeout, softban
- Settings: antispam, togglewelcome, togglechatbot, setrules

### 👋 Welcome System
- Welcome message with user photo on join, goodbye on leave
- Royal-themed menu via `/menu`

## Plugins (19 total)
```
userCommands       → /userinfo, /echo, /commands
adminCommands      → kick, ban, mute, delete, pin, setstatus
channelCommands    → post, testchannel, setchannel, broadcast
welcomeCommands    → welcome/goodbye, /menu
ping               → two-stage latency
id                 → user + chat ID
stats              → uptime, memory, groups
help               → topic-based /help
settings           → antispam, setrules, toggles
start              → /start with inline keyboard
adminManagement    → /amiadmin, admin panel
funCommands        → 8ball, dice, flip, choose, rate, joke
infoCommands       → groupinfo, members, profile
moderationCommands → warn, timeout, softban
paymentCommands    → Stars invoices, OTP generation/redemption
movieCommands      → BlazeMovieHub interactive search + payment flow
autoPostingCommands→ tech tips/polls/matters + movie auto-posting (schedulable)
chatbot            → T20 WOLF AI
```

## Utils
- `utils/movieApi.js` — BlazeMovieHub API wrapper
- `utils/movieDownloader.js` — Movie delivery (video + download card)
- `utils/techContent.js` — Tech tips, polls, tech matters content pool
- `utils/configStore.js` — JSON persistent config (read/write `data/bot_config.json`)
- `utils/styles.js` — HTML message formatting
- `utils/blogFetcher.js` — Blog fetcher (blog.t20tech.site, currently offline)

## Auto-Post Command Reference
```
/autopost             → Status + control panel
/autopost setup       → Re-run setup wizard
/autopost on          → Enable posting
/autopost off         → Pause posting
/autopost now         → Post immediately
/autopost mode tech   → Switch to tech tips/polls only
/autopost mode movies → Switch to movies only
/autopost mode both   → Switch to alternating mode
/autopost interval 4  → Post every 4 hours
/autopost preview tip → Preview a tip in this chat
/autopost preview poll→ Preview a poll in this chat
/autopost preview movie → Preview a movie post
/autopost preview matter→ Preview a tech matter
```

## Run Command
```
npm install && npm start
```

## Notes
- Bot uses **webhook mode** via `REPLIT_DEV_DOMAIN` — no 409 polling conflicts
- Movie API may return HTML when site is down — handled gracefully
- On first deploy: setup wizard auto-fires (DMs admins, or posts in channel if no ADMIN_IDS)
- Config persisted to `data/bot_config.json` — set ADMIN_IDS env var to receive wizard via DM

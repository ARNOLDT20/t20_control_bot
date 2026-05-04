# T20 Wolf Control Bot

## Overview
Advanced Telegram bot (@t20_control_bot) with group management, AI chatbot, movie download + payment system, and auto-posting. By Arnold T20.

## Architecture
- **Entry Point**: `bot.js` — Express server (port 5000) + Telegram bot in **webhook mode** (no polling)
- **Plugin System**: `plugins/index.js` — Loads all 19 feature modules in order
- **Config**: `config.js` — Environment variable handling
- **Webhook URL**: `https://$REPLIT_DEV_DOMAIN/tg-webhook-<botId>`

## Required Environment Variables
- `TELEGRAM_TOKEN` — Bot token from @BotFather (required)
- `CHANNEL_ID` — Target channel (default: `@t20classictech`)
- `ADMIN_IDS` — Comma-separated admin user IDs (optional, open mode if unset)
- `SOCKS_PROXY` — SOCKS5 proxy URL (optional)

## Key Features

### 🎬 Movie System (BlazeMovieHub)
- **API**: `https://blazemoviehub.t20tech.site/api` — Bearer token `gifted_movieapi_789fbud2389889dg8962e098g23d6`
- **Working endpoints**: `/api/search/{query}`, `/api/trending`, `/api/info/{subjectId}`, `/api/homepage`
- **Commands**: `/movies`, `/moviesearch`, `/download`, `/trending`, `/latestmovies`, `/moviehelp`
- Full interactive flow: Search → Results → Movie Info (with poster) → Quality Selection → Payment

### 💳 Payment & Access System
- **Telegram Stars**: 50 Stars per movie — native Telegram Stars invoice (currency: `XTR`, empty provider_token)
- **OTP Codes**: Admin generates codes with `/genotp [count]`, users redeem with `/redeem T20-XXXXXXXX`
- **After payment/OTP**: Bot sends video preview (trailer MP4) + premium download link with poster
- **Admin OTP commands**: `/genotp`, `/listotp`, `/revokeop`
- **User OTP command**: `/redeem <code>`
- Sessions and granted access stored in-memory (Map)
- OTPs expire after 24 hours, one-time use

### 🤖 AI Chatbot (T20 WOLF AI)
- `/chat <message>` — Chat with AI
- DM mode — Auto AI responses in private chat

### 👥 Group Management
- Admin: kick, ban, unban, mute, unmute, delete, pin, unpin, setdesc, setstatus
- Moderation: warn (auto-kick at 3 warnings), timeout, softban
- Settings: antispam, togglewelcome, togglechatbot, setrules

### 📡 Auto-Posting
- Posts trending movies from BlazeMovieHub every 5 hours to `@t20classictech`
- Each post includes movie poster image, title, genre, rating, and download link
- Commands: `/autopost on/off/now/status`

### 👋 Welcome System
- Welcome message with user photo on join, goodbye on leave
- Royal-themed menu via `/menu`

## Plugins (19 total, load order matters)
```
userCommands      → /userinfo, /echo, /commands
adminCommands     → kick, ban, mute, delete, pin, setstatus
channelCommands   → post, testchannel, setchannel, broadcast
welcomeCommands   → welcome/goodbye, /menu
ping              → two-stage latency
id                → user + chat ID
stats             → uptime, memory, groups
help              → topic-based /help
settings          → antispam, setrules, toggles
start             → /start with inline keyboard
adminManagement   → /amiadmin, admin panel
funCommands       → 8ball, dice, flip, choose, rate, joke
infoCommands      → groupinfo, members, profile
moderationCommands→ warn, timeout, softban
paymentCommands   → Stars invoices, OTP generation/redemption
movieCommands     → BlazeMovieHub interactive search + payment flow
autoPostingCommands → movie auto-posting to channel
chatbot           → T20 WOLF AI
```

## Utils
- `utils/movieApi.js` — BlazeMovieHub API wrapper (search, trending, info, URLs)
- `utils/movieDownloader.js` — Delivers movies: fetches video URL, sends video + download card
- `utils/styles.js` — HTML message formatting helpers
- `utils/blogFetcher.js` — Blog post fetcher (blog.t20tech.site, currently offline)

## Run Command
```
npm install && npm start
```

## Notes
- Bot uses **webhook mode** via `REPLIT_DEV_DOMAIN` — no 409 polling conflicts
- Movie API may occasionally return HTML (site down) — handled gracefully with error logging
- Telegram files: bots can send up to 50MB; trailers are sent via direct MP4 URL
- Stars payments: `currency: 'XTR'`, `provider_token: ''` (Telegram native Stars)

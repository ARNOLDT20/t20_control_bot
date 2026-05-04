// Auto-Posting Plugin — Pro Schedulable System
// Posts tech tips, polls, tech matters, and movies on a configurable schedule
// Supports: tech-only | movies-only | both (alternating)

const configStore = require('../utils/configStore');
const techContent = require('../utils/techContent');
const movieApi = require('../utils/movieApi');

const SITE_URL = 'https://blazemoviehub.t20tech.site';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const escHtml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

// Mode labels
const modeLabel = (mode) => ({
    tech: '🔬 Tech Tips & Polls',
    movies: '🎬 Movies Only',
    both: '🔬🎬 Tech + Movies (Alternating)',
}[mode] || '❓ Not set');

const intervalLabel = (h) => h === 1 ? '1 hour' : `${h} hours`;

// ─── Content Senders ─────────────────────────────────────────────────────────

// Post a tech tip
const postTechTip = async (bot, channelId) => {
    const idx = configStore.get('autopost.techIndex') || 0;
    const tips = techContent.techTips;
    const tip = tips[idx % tips.length];
    configStore.set('autopost.techIndex', idx + 1);

    const msg = `${tip.content}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📲 @t20classictech · 👑 <i>T20 Wolf Bot</i>`;

    await bot.sendMessage(channelId, msg, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[
                { text: '💡 More Tips', url: `https://t.me/t20classictech` },
                { text: '🤖 Get Bot', url: `https://t.me/t20_control_bot` }
            ]]
        }
    });

    console.log(`✅ Tech tip posted: "${tip.title}"`);
};

// Post a tech poll (regular or quiz)
const postTechPoll = async (bot, channelId) => {
    const idx = configStore.get('autopost.pollIndex') || 0;
    const polls = techContent.techPolls;
    const poll = polls[idx % polls.length];
    configStore.set('autopost.pollIndex', idx + 1);

    const opts = {
        is_anonymous: false,
        allows_multiple_answers: false,
    };

    if (poll.type === 'quiz') {
        opts.type = 'quiz';
        opts.correct_option_id = poll.correct_option_id;
        if (poll.explanation) opts.explanation = poll.explanation;
    } else {
        opts.type = 'regular';
    }

    await bot.sendPoll(channelId, poll.question, poll.options, opts);
    console.log(`✅ Poll posted: "${poll.question.slice(0, 40)}..."`);
};

// Post a tech matter (longer editorial content)
const postTechMatter = async (bot, channelId) => {
    const idx = configStore.get('autopost.matterIndex') || 0;
    const matters = techContent.techMatters;
    const matter = matters[idx % matters.length];
    configStore.set('autopost.matterIndex', idx + 1);

    const msg = `${matter.content}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📲 @t20classictech · 👑 <i>T20 Wolf Bot</i>`;

    await bot.sendMessage(channelId, msg, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [[
                { text: '📲 Join Channel', url: `https://t.me/t20classictech` },
                { text: '💬 Discuss', url: `https://t.me/t20classictech` }
            ]]
        }
    });

    console.log(`✅ Tech matter posted: "${matter.title}"`);
};

// Post a trending movie
let cachedMovies = [];
let movieCacheTime = 0;

const postMovie = async (bot, channelId) => {
    const now = Date.now();

    // Refresh cache every 6 hours
    if (!cachedMovies.length || now - movieCacheTime > 6 * 60 * 60 * 1000) {
        try {
            const items = await movieApi.getTrending();
            if (items && items.length) {
                cachedMovies = shuffleArray(items);
                movieCacheTime = now;
                console.log(`🎬 Movie cache refreshed: ${cachedMovies.length} movies`);
            }
        } catch (err) {
            console.warn('⚠️ Movie API unavailable:', err.message);
        }
    }

    if (!cachedMovies.length) {
        console.warn('⚠️ No movies available to post');
        return false;
    }

    const idx = configStore.get('autopost.movieIndex') || 0;
    const movie = cachedMovies[idx % cachedMovies.length];
    configStore.set('autopost.movieIndex', idx + 1);

    const title = escHtml(movie.title || 'Unknown');
    const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA';
    const genre = movie.genre ? movie.genre.split(',').slice(0, 3).join(' · ') : 'General';
    const country = movie.countryName || '';
    const rating = parseFloat(movie.imdbRatingValue) || 0;
    const ratingStr = rating > 0 ? `⭐ ${rating}/10` : '⭐ Not yet rated';
    const type = movieApi.subjectTypeLabel(movie.subjectType || 1);
    const watchUrl = `${SITE_URL}/movie/${movie.detailPath || ''}`;
    const posterUrl = movie.cover?.url || movie.thumbnail;

    const message = `🎬 <b>${title}</b> (${year})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${type}${country ? ` · 🌍 ${country}` : ''}
🎭 <b>Genre:</b> ${genre}
${ratingStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 Stream or download in HD quality
📀 4K · 1080p · 720p · 480p available

🔗 <a href="${watchUrl}">Watch / Download Now</a>
🌐 <a href="${SITE_URL}">BlazeMovieHub</a>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Use /moviesearch or /download in bot
📲 @t20classictech · 👑 <i>T20 Wolf Bot</i>`;

    const keyboard = {
        inline_keyboard: [[
            { text: '▶️ Watch / Download', url: watchUrl },
            { text: '🔥 More Movies', url: SITE_URL }
        ]]
    };

    if (posterUrl) {
        try {
            await bot.sendPhoto(channelId, posterUrl, { caption: message, parse_mode: 'HTML', reply_markup: keyboard });
            console.log(`✅ Movie posted: "${movie.title}"`);
            return true;
        } catch (_) {}
    }

    await bot.sendMessage(channelId, message, { parse_mode: 'HTML', reply_markup: keyboard });
    console.log(`✅ Movie posted (text): "${movie.title}"`);
    return true;
};

// ─── Main cycling logic for 'both' mode ──────────────────────────────────────
// Cycle: tip → poll → movie → matter → tip → poll → movie → ...
const BOTH_CYCLE = ['tip', 'poll', 'movie', 'matter'];

const postNextContent = async (bot, channelId) => {
    const mode = configStore.get('autopost.mode');
    let posted = false;

    if (mode === 'tech') {
        // Alternate between tip, poll, matter
        const cycle = configStore.get('autopost.contentCycle') || 0;
        const techCycle = ['tip', 'poll', 'matter'];
        const type = techCycle[cycle % techCycle.length];
        configStore.set('autopost.contentCycle', cycle + 1);

        if (type === 'tip') await postTechTip(bot, channelId);
        else if (type === 'poll') await postTechPoll(bot, channelId);
        else await postTechMatter(bot, channelId);
        posted = true;

    } else if (mode === 'movies') {
        posted = await postMovie(bot, channelId);

    } else if (mode === 'both') {
        const cycle = configStore.get('autopost.contentCycle') || 0;
        const type = BOTH_CYCLE[cycle % BOTH_CYCLE.length];
        configStore.set('autopost.contentCycle', cycle + 1);

        if (type === 'tip') await postTechTip(bot, channelId);
        else if (type === 'poll') await postTechPoll(bot, channelId);
        else if (type === 'movie') posted = await postMovie(bot, channelId);
        else await postTechMatter(bot, channelId);
        if (type !== 'movie') posted = true;
    }

    if (posted !== false) {
        configStore.set('autopost.lastPosted', Date.now());
    }

    return posted;
};

// ─── Setup wizard ─────────────────────────────────────────────────────────────
const sendSetupWizard = async (bot, chatId) => {
    try {
        await bot.sendMessage(chatId, `🎛️ <b>T20 Wolf Bot — Auto-Post Setup</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👋 Welcome! Let's configure what your channel receives.

<b>What content should the bot auto-post?</b>

🔬 <b>Tech Only</b> — Tech tips, polls &amp; tech matters
🎬 <b>Movies Only</b> — Trending movies from BlazeMovieHub
🔬🎬 <b>Both</b> — Alternates between tech &amp; movies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tap your preferred mode below:`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔬 Tech Tips & Polls', callback_data: 'setup_mode_tech' },
                    ],
                    [
                        { text: '🎬 Movies Only', callback_data: 'setup_mode_movies' },
                    ],
                    [
                        { text: '🔬🎬 Both (Recommended)', callback_data: 'setup_mode_both' },
                    ],
                    [
                        { text: '⏭️ Skip / Keep Current', callback_data: 'setup_skip' },
                    ]
                ]
            }
        });
        console.log(`📋 Setup wizard sent to ${chatId}`);
    } catch (err) {
        console.warn('⚠️ Could not send setup wizard:', err.message);
    }
};

// Send interval selection after mode is chosen
const sendIntervalSelector = async (bot, chatId, mode) => {
    const label = modeLabel(mode);
    await bot.sendMessage(chatId, `✅ <b>Mode set: ${label}</b>

⏱️ <b>How often should the bot post?</b>
Choose the posting interval:`, {
        parse_mode: 'HTML',
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '⚡ Every 1 hour', callback_data: 'setup_interval_1' },
                    { text: '🕐 Every 2 hours', callback_data: 'setup_interval_2' },
                ],
                [
                    { text: '🕓 Every 4 hours', callback_data: 'setup_interval_4' },
                    { text: '🕕 Every 5 hours', callback_data: 'setup_interval_5' },
                ],
                [
                    { text: '🕕 Every 6 hours', callback_data: 'setup_interval_6' },
                    { text: '🕛 Every 12 hours', callback_data: 'setup_interval_12' },
                ],
                [
                    { text: '🌙 Once daily (24h)', callback_data: 'setup_interval_24' },
                ]
            ]
        }
    });
};

// ─── Module export ─────────────────────────────────────────────────────────────
module.exports = (bot, isAdmin, channelId) => {
    let schedulerTimer = null;
    let isPosting = false;

    // ── Start the scheduler ────────────────────────────────────────────────────
    const startScheduler = () => {
        if (schedulerTimer) clearInterval(schedulerTimer);

        const interval = (configStore.get('autopost.interval') || 5) * 60 * 60 * 1000;
        console.log(`⏰ Scheduler started — every ${configStore.get('autopost.interval') || 5}h`);

        // Post once on startup if mode is configured
        if (configStore.get('autopost.mode') && configStore.get('autopost.enabled')) {
            const lastPosted = configStore.get('autopost.lastPosted') || 0;
            const elapsed = Date.now() - lastPosted;

            if (elapsed > interval) {
                // Overdue — post after 10 seconds
                setTimeout(() => triggerPost(), 10000);
            } else {
                const remaining = interval - elapsed;
                console.log(`⏳ Next post in ${Math.round(remaining / 60000)} minutes`);
            }
        }

        schedulerTimer = setInterval(triggerPost, interval);
    };

    const stopScheduler = () => {
        if (schedulerTimer) {
            clearInterval(schedulerTimer);
            schedulerTimer = null;
        }
        console.log('⏸️ Scheduler stopped');
    };

    const triggerPost = async () => {
        if (!configStore.get('autopost.enabled')) return;
        if (!configStore.get('autopost.mode')) return;
        if (isPosting) return;

        isPosting = true;
        try {
            await postNextContent(bot, channelId);
        } catch (err) {
            console.error('❌ Auto-post error:', err.message);
        } finally {
            isPosting = false;
        }
    };

    // ── Setup callback handler ─────────────────────────────────────────────────
    bot.on('callback_query', async (query) => {
        const data = query.data;
        if (!data.startsWith('setup_')) return;

        const chatId = query.message.chat.id;
        const userId = query.from.id;

        if (!isAdmin(userId)) {
            try { await bot.answerCallbackQuery(query.id, { text: '❌ Admin only' }); } catch (_) {}
            return;
        }

        try { await bot.answerCallbackQuery(query.id); } catch (_) {}

        // Delete setup message
        try { await bot.deleteMessage(chatId, query.message.message_id); } catch (_) {}

        if (data.startsWith('setup_mode_')) {
            const mode = data.replace('setup_mode_', '');
            configStore.set('autopost.mode', mode);
            await sendIntervalSelector(bot, chatId, mode);

        } else if (data.startsWith('setup_interval_')) {
            const hours = parseInt(data.replace('setup_interval_', ''));
            configStore.set('autopost.interval', hours);
            configStore.set('autopost.enabled', true);
            configStore.set('autopost.setupDone', true);

            const mode = configStore.get('autopost.mode');

            await bot.sendMessage(chatId, `🎉 <b>Auto-posting Configured!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ <b>Mode:</b> ${modeLabel(mode)}
⏱️ <b>Interval:</b> Every ${intervalLabel(hours)}
📢 <b>Channel:</b> ${channelId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Bot will start posting immediately!

<b>Change anytime with:</b>
<code>/autopost setup</code> — re-run wizard
<code>/autopost mode tech|movies|both</code>
<code>/autopost interval [hours]</code>
<code>/autopost on|off|now|status</code>`, {
                parse_mode: 'HTML'
            });

            // Restart scheduler with new settings
            startScheduler();

            // Post first item right away
            setTimeout(() => triggerPost(), 3000);

        } else if (data === 'setup_skip') {
            configStore.set('autopost.setupDone', true);
            await bot.sendMessage(chatId, `⏭️ <b>Setup skipped.</b>\n\nRun <code>/autopost setup</code> anytime to configure.\nCurrent mode: <b>${modeLabel(configStore.get('autopost.mode'))}</b>`, { parse_mode: 'HTML' });
        }
    });

    // ── /autopost command ─────────────────────────────────────────────────────
    bot.onText(/\/autopost(?:\s+(.+))?/, async (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, '❌ <b>Admin only command.</b>', { parse_mode: 'HTML' });
        }

        const args = match[1] ? match[1].trim().split(/\s+/) : [];
        const action = args[0]?.toLowerCase();
        const chatId = msg.chat.id;

        // No args — show status + menu
        if (!action || action === 'status') {
            const mode = configStore.get('autopost.mode');
            const interval = configStore.get('autopost.interval') || 5;
            const enabled = configStore.get('autopost.enabled');
            const lastPosted = configStore.get('autopost.lastPosted') || 0;
            const lastStr = lastPosted ? new Date(lastPosted).toLocaleString() : 'Never';
            const nextIn = lastPosted
                ? Math.max(0, Math.round(((lastPosted + interval * 3600000) - Date.now()) / 60000))
                : 0;

            return bot.sendMessage(chatId, `📊 <b>Auto-Post Status</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${enabled && schedulerTimer ? '🟢 Running' : '🔴 Stopped'} | Mode: <b>${modeLabel(mode)}</b>
⏱️ Interval: <b>Every ${intervalLabel(interval)}</b>
📢 Channel: <b>${channelId}</b>
🕐 Last post: <b>${lastStr}</b>
⏳ Next post in: <b>${enabled && schedulerTimer ? `~${nextIn}min` : 'N/A (stopped)'}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Commands:</b>
<code>/autopost setup</code> — Setup wizard
<code>/autopost on/off</code> — Enable/disable
<code>/autopost now</code> — Post immediately
<code>/autopost mode [tech|movies|both]</code>
<code>/autopost interval [1-24]</code>
<code>/autopost preview [tech|poll|movie|matter]</code>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: enabled ? '⏸️ Stop' : '▶️ Start', callback_data: enabled ? 'ap_off' : 'ap_on' },
                            { text: '📤 Post Now', callback_data: 'ap_now' }
                        ],
                        [{ text: '🎛️ Setup Wizard', callback_data: 'ap_setup' }]
                    ]
                }
            });
        }

        // on/off
        if (action === 'on') {
            if (!configStore.get('autopost.mode')) {
                return bot.sendMessage(chatId, `⚠️ <b>Not configured yet.</b>\nRun: <code>/autopost setup</code>`, { parse_mode: 'HTML' });
            }
            configStore.set('autopost.enabled', true);
            startScheduler();
            return bot.sendMessage(chatId, `✅ <b>Auto-posting enabled!</b>\nMode: ${modeLabel(configStore.get('autopost.mode'))}\nInterval: Every ${intervalLabel(configStore.get('autopost.interval') || 5)}`, { parse_mode: 'HTML' });
        }

        if (action === 'off') {
            configStore.set('autopost.enabled', false);
            stopScheduler();
            return bot.sendMessage(chatId, `⏸️ <b>Auto-posting paused.</b>\nUse <code>/autopost on</code> to resume.`, { parse_mode: 'HTML' });
        }

        // now — immediate post
        if (action === 'now') {
            if (!configStore.get('autopost.mode')) {
                return bot.sendMessage(chatId, `⚠️ <b>Not configured yet.</b>\nRun: <code>/autopost setup</code>`, { parse_mode: 'HTML' });
            }
            await bot.sendMessage(chatId, '📤 <b>Posting now...</b>', { parse_mode: 'HTML' });
            await triggerPost();
            return bot.sendMessage(chatId, '✅ <b>Post sent to channel!</b>', { parse_mode: 'HTML' });
        }

        // setup — re-run wizard
        if (action === 'setup') {
            await sendSetupWizard(bot, chatId);
            return;
        }

        // mode change
        if (action === 'mode') {
            const newMode = args[1]?.toLowerCase();
            const validModes = ['tech', 'movies', 'both'];
            if (!newMode || !validModes.includes(newMode)) {
                return bot.sendMessage(chatId, `❌ Invalid mode.\nUse: <code>/autopost mode tech|movies|both</code>`, { parse_mode: 'HTML' });
            }
            configStore.set('autopost.mode', newMode);
            configStore.set('autopost.contentCycle', 0);
            startScheduler();
            return bot.sendMessage(chatId, `✅ <b>Mode changed to: ${modeLabel(newMode)}</b>\nTakes effect from the next post.`, { parse_mode: 'HTML' });
        }

        // interval change
        if (action === 'interval') {
            const hours = parseInt(args[1]);
            if (!hours || hours < 1 || hours > 168) {
                return bot.sendMessage(chatId, `❌ Invalid interval.\nUse: <code>/autopost interval [1-168]</code>\n(1 to 168 hours = 1 week max)`, { parse_mode: 'HTML' });
            }
            configStore.set('autopost.interval', hours);
            startScheduler();
            return bot.sendMessage(chatId, `✅ <b>Interval set to: Every ${intervalLabel(hours)}</b>\nScheduler restarted.`, { parse_mode: 'HTML' });
        }

        // preview — test-post a specific type without incrementing index
        if (action === 'preview') {
            const type = args[1]?.toLowerCase();
            await bot.sendMessage(chatId, `👁️ <b>Previewing: ${type || 'auto'}...</b>`, { parse_mode: 'HTML' });
            try {
                if (type === 'tech' || type === 'tip') await postTechTip(bot, chatId);
                else if (type === 'poll') await postTechPoll(bot, chatId);
                else if (type === 'matter') await postTechMatter(bot, chatId);
                else if (type === 'movie') await postMovie(bot, chatId);
                else await postNextContent(bot, chatId);
            } catch (err) {
                await bot.sendMessage(chatId, `❌ Preview error: ${err.message}`, { parse_mode: 'HTML' });
            }
            return;
        }

        // Unknown action
        return bot.sendMessage(chatId, `❓ Unknown action: <code>${args[0]}</code>\nUse <code>/autopost</code> to see all options.`, { parse_mode: 'HTML' });
    });

    // ── Quick callback buttons from status message ──────────────────────────────
    bot.on('callback_query', async (query) => {
        const data = query.data;
        if (!data.startsWith('ap_')) return;

        const chatId = query.message.chat.id;
        if (!isAdmin(query.from.id)) {
            try { await bot.answerCallbackQuery(query.id, { text: '❌ Admin only' }); } catch (_) {}
            return;
        }

        try { await bot.answerCallbackQuery(query.id); } catch (_) {}

        if (data === 'ap_on') {
            configStore.set('autopost.enabled', true);
            startScheduler();
            await bot.sendMessage(chatId, `✅ <b>Auto-posting enabled!</b>`, { parse_mode: 'HTML' });
        } else if (data === 'ap_off') {
            configStore.set('autopost.enabled', false);
            stopScheduler();
            await bot.sendMessage(chatId, `⏸️ <b>Auto-posting paused.</b>`, { parse_mode: 'HTML' });
        } else if (data === 'ap_now') {
            if (!configStore.get('autopost.mode')) {
                return bot.sendMessage(chatId, `⚠️ Run <code>/autopost setup</code> first.`, { parse_mode: 'HTML' });
            }
            await bot.sendMessage(chatId, '📤 <b>Posting now...</b>', { parse_mode: 'HTML' });
            await triggerPost();
            await bot.sendMessage(chatId, '✅ <b>Posted to channel!</b>', { parse_mode: 'HTML' });
        } else if (data === 'ap_setup') {
            await sendSetupWizard(bot, chatId);
        }
    });

    // ── Auto-start if already configured ──────────────────────────────────────
    if (configStore.get('autopost.mode') && configStore.get('autopost.enabled') !== false) {
        console.log(`📡 Auto-post: mode="${configStore.get('autopost.mode')}", every ${configStore.get('autopost.interval') || 5}h`);
        setTimeout(() => startScheduler(), 5000);
    } else {
        console.log(`⚙️ Auto-post: not configured yet — run /autopost setup`);
    }

    return {
        startScheduler,
        stopScheduler,
        triggerPost,
        sendSetupWizard,
        postTechTip: (cid) => postTechTip(bot, cid),
        postTechPoll: (cid) => postTechPoll(bot, cid),
        postTechMatter: (cid) => postTechMatter(bot, cid),
        postMovie: (cid) => postMovie(bot, cid),
    };
};

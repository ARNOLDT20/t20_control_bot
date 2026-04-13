// Auto-Posting Plugin — Movie Edition
// Posts trending movies from BlazeMovieHub every 5 hours

const styles = require('../utils/styles');
const movieApi = require('../utils/movieApi');

const SITE_URL = 'https://blazemoviehub.t20tech.site';

// Shuffle array
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);

// Last posted movie index tracker
let lastPostedIndex = 0;
let cachedMovies = [];

// Refresh movie cache from API
const refreshMovies = async () => {
    try {
        const items = await movieApi.getTrending();
        if (items && items.length) {
            cachedMovies = shuffle(items);
            console.log(`🎬 Movie cache refreshed: ${cachedMovies.length} movies`);
        }
    } catch (err) {
        console.warn('⚠️ Could not refresh movie cache:', err.message);
    }
};

// Format a movie post for the channel
const formatMoviePost = (movie) => {
    const title = (movie.title || 'Unknown').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : 'TBA';
    const genre = movie.genre ? movie.genre.split(',').slice(0, 3).join(' · ') : 'General';
    const country = movie.countryName || '';
    const rating = parseFloat(movie.imdbRatingValue) || 0;
    const ratingStr = rating > 0 ? `⭐ ${rating}/10` : '⭐ Not rated yet';
    const type = movieApi.subjectTypeLabel(movie.subjectType || 1);
    const detailPath = movie.detailPath || '';
    const watchUrl = `${SITE_URL}/movie/${detailPath}`;

    return `🎬 <b>${title}</b> (${year})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${type}${country ? ` · 🌍 ${country}` : ''}
🎭 <b>Genre:</b> ${genre}
${ratingStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 Stream or Download in HD Quality
📀 Available: 4K · 1080p · 720p · 480p

🔗 <a href="${watchUrl}">Watch / Download Now</a>
🌐 <a href="${SITE_URL}">BlazeMovieHub</a>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Use /moviesearch or /download in bot
👑 <i>T20 Wolf Bot by Arnold T20</i>`;
};

module.exports = (bot, isAdmin, channelId) => {
    let autoPostingEnabled = true;
    let autoPostingInterval = null;
    const AUTO_POST_INTERVAL_MS = 5 * 60 * 60 * 1000; // 5 hours

    // Post a trending movie to the channel
    const postAutoContent = async () => {
        try {
            // Refresh cache if empty or depleted
            if (cachedMovies.length === 0 || lastPostedIndex >= cachedMovies.length) {
                await refreshMovies();
                lastPostedIndex = 0;
            }

            if (cachedMovies.length === 0) {
                console.warn('⚠️ No movies in cache to post');
                return;
            }

            const movie = cachedMovies[lastPostedIndex % cachedMovies.length];
            lastPostedIndex++;

            const message = formatMoviePost(movie);
            const posterUrl = movie.cover?.url || movie.thumbnail;

            // Try to send with movie poster image
            if (posterUrl) {
                try {
                    await bot.sendPhoto(channelId, posterUrl, {
                        caption: message,
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '▶️ Watch / Download', url: `${SITE_URL}/movie/${movie.detailPath || ''}` },
                                { text: '🔥 More Movies', url: SITE_URL }
                            ]]
                        }
                    });
                    console.log(`✅ [${new Date().toLocaleString()}] Movie post sent: ${movie.title}`);
                    return;
                } catch (photoErr) {
                    console.warn(`⚠️ Photo post failed, sending text: ${photoErr.message}`);
                }
            }

            // Fallback: text only
            await bot.sendMessage(channelId, message, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        { text: '▶️ Watch / Download', url: `${SITE_URL}/movie/${movie.detailPath || ''}` },
                        { text: '🔥 More Movies', url: SITE_URL }
                    ]]
                }
            });
            console.log(`✅ [${new Date().toLocaleString()}] Movie post (text) sent: ${movie.title}`);

        } catch (err) {
            console.error(`❌ Auto-post error: ${err.message}`);
        }
    };

    // Start auto-posting
    const startAutoPosting = () => {
        if (autoPostingInterval) return;
        autoPostingEnabled = true;
        console.log(`🎬 Movie auto-posting enabled — posts every 5 hours to ${channelId}`);

        // Load movies first then post immediately
        refreshMovies().then(() => postAutoContent());

        autoPostingInterval = setInterval(postAutoContent, AUTO_POST_INTERVAL_MS);
    };

    // Stop auto-posting
    const stopAutoPosting = () => {
        if (autoPostingInterval) {
            clearInterval(autoPostingInterval);
            autoPostingInterval = null;
        }
        autoPostingEnabled = false;
        console.log('⏸️ Movie auto-posting disabled');
    };

    // Start on boot
    setTimeout(startAutoPosting, 3000);

    // ═══ /autopost commands ═══════════════════════════════════════════════════
    bot.onText(/\/autopost\s+(on|off|now|status)/, async (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const action = match[1].toLowerCase();

        if (action === 'on') {
            if (autoPostingEnabled) {
                return bot.sendMessage(msg.chat.id, styles.infoMsg('Movie auto-posting is already running!'), { parse_mode: 'HTML' });
            }
            startAutoPosting();
            bot.sendMessage(msg.chat.id, styles.successMsg('🎬 Movie auto-posting enabled!\nBot will post trending movies every 5 hours to the channel.'), { parse_mode: 'HTML' });

        } else if (action === 'off') {
            if (!autoPostingEnabled) {
                return bot.sendMessage(msg.chat.id, styles.infoMsg('Auto-posting is already stopped.'), { parse_mode: 'HTML' });
            }
            stopAutoPosting();
            bot.sendMessage(msg.chat.id, styles.infoMsg('🎬 Movie auto-posting disabled.\nUse /autopost on to restart.'), { parse_mode: 'HTML' });

        } else if (action === 'now') {
            await postAutoContent();
            bot.sendMessage(msg.chat.id, styles.successMsg('🎬 Posted a trending movie to the channel now!'), { parse_mode: 'HTML' });

        } else if (action === 'status') {
            const status = autoPostingEnabled ? '🟢 Running' : '🔴 Stopped';
            const nextPost = autoPostingEnabled ? 'Every 5 hours' : 'N/A';
            const cacheSize = cachedMovies.length;

            bot.sendMessage(msg.chat.id,
                `${styles.header('Auto-Posting Status', '📊')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${styles.listItem('📡', `Status: <b>${status}</b>`)}
${styles.listItem('⏰', `Interval: <b>${nextPost}</b>`)}
${styles.listItem('📢', `Channel: <b>${channelId}</b>`)}
${styles.listItem('🎬', `Movie Cache: <b>${cacheSize}</b> movies`)}
${styles.listItem('📍', `Next post #: <b>${lastPostedIndex + 1}</b>`)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Content: 🎬 Trending movies from BlazeMovieHub`,
                { parse_mode: 'HTML' });
        }
    });

    return { startAutoPosting, stopAutoPosting, postAutoContent };
};

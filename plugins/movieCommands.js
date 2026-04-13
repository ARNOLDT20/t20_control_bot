// Movie Download Commands Plugin
// Powered by BlazeMovieHub API (GiftedTech)

const movieApi = require('../utils/movieApi');

// ─── User session state ─────────────────────────────────────────────────────
// Tracks each user's current search results + selected movie
const sessions = new Map();

const setSession = (userId, data) => {
    sessions.set(userId, { ...sessions.get(userId), ...data, updatedAt: Date.now() });
};

const getSession = (userId) => sessions.get(userId) || {};

// Clean up sessions older than 10 minutes
setInterval(() => {
    const now = Date.now();
    for (const [userId, session] of sessions) {
        if (now - session.updatedAt > 10 * 60 * 1000) sessions.delete(userId);
    }
}, 5 * 60 * 1000);

// ─── Helpers ────────────────────────────────────────────────────────────────
const escape = (text) => String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const formatGenre = (genre) => {
    if (!genre) return 'Unknown';
    return genre.split(',').slice(0, 3).join(' · ');
};

const formatDate = (dateStr) => {
    if (!dateStr || dateStr === '0000-00-00') return 'TBA';
    return dateStr.slice(0, 4);
};

const ratingStars = (val) => {
    const n = parseFloat(val) || 0;
    if (n === 0) return 'Not rated';
    return '⭐'.repeat(Math.min(Math.round(n / 2), 5)) + ` ${n}/10`;
};

// Build search results inline keyboard (max 8 results shown as buttons)
const buildResultsKeyboard = (items, query, page, hasMore) => {
    const rows = [];
    const shown = items.slice(0, 8);
    for (let i = 0; i < shown.length; i += 2) {
        const row = [];
        const a = shown[i];
        row.push({
            text: `${movieApi.subjectTypeLabel(a.subjectType).split(' ')[0]} ${escape(a.title).slice(0, 28)} (${formatDate(a.releaseDate)})`,
            callback_data: `mv_pick_${a.subjectId}`
        });
        if (shown[i + 1]) {
            const b = shown[i + 1];
            row.push({
                text: `${movieApi.subjectTypeLabel(b.subjectType).split(' ')[0]} ${escape(b.title).slice(0, 28)} (${formatDate(b.releaseDate)})`,
                callback_data: `mv_pick_${b.subjectId}`
            });
        }
        rows.push(row);
    }

    // Navigation row
    const navRow = [];
    if (page > 1) navRow.push({ text: '⬅️ Prev', callback_data: `mv_search_${encodeURIComponent(query)}_${page - 1}` });
    if (hasMore) navRow.push({ text: 'Next ➡️', callback_data: `mv_search_${encodeURIComponent(query)}_${page + 1}` });
    if (navRow.length) rows.push(navRow);

    rows.push([{ text: '🔍 New Search', callback_data: 'mv_new_search' }, { text: '📈 Trending', callback_data: 'mv_trending' }]);
    return { inline_keyboard: rows };
};

// Build quality selection keyboard
const buildQualityKeyboard = (subjectId, detailPath, resolutions) => {
    const rows = [];

    if (resolutions.length === 0) {
        // No resolutions known — offer general download
        rows.push([{ text: '🌐 Watch / Download', url: movieApi.getWatchUrl(detailPath) }]);
    } else {
        for (let i = 0; i < resolutions.length; i += 2) {
            const row = [];
            const res = resolutions[i];
            row.push({
                text: movieApi.resolutionLabel(res),
                url: movieApi.getDownloadUrl(detailPath, res)
            });
            if (resolutions[i + 1]) {
                const res2 = resolutions[i + 1];
                row.push({
                    text: movieApi.resolutionLabel(res2),
                    url: movieApi.getDownloadUrl(detailPath, res2)
                });
            }
            rows.push(row);
        }
    }

    rows.push([
        { text: '▶️ Watch Online', url: movieApi.getWatchUrl(detailPath) },
        { text: '🔙 Back', callback_data: `mv_back_${subjectId}` }
    ]);
    rows.push([{ text: '🔍 Search Another Movie', callback_data: 'mv_new_search' }]);
    return { inline_keyboard: rows };
};

// Build trending keyboard
const buildTrendingKeyboard = (items) => {
    const rows = [];
    const shown = items.slice(0, 10);
    for (let i = 0; i < shown.length; i += 2) {
        const row = [];
        const a = shown[i];
        row.push({
            text: `${movieApi.subjectTypeLabel(a.subjectType).split(' ')[0]} ${escape(a.title).slice(0, 28)}`,
            callback_data: `mv_pick_${a.subjectId}`
        });
        if (shown[i + 1]) {
            const b = shown[i + 1];
            row.push({
                text: `${movieApi.subjectTypeLabel(b.subjectType).split(' ')[0]} ${escape(b.title).slice(0, 28)}`,
                callback_data: `mv_pick_${b.subjectId}`
            });
        }
        rows.push(row);
    }
    rows.push([{ text: '🔍 Search a Movie', callback_data: 'mv_new_search' }, { text: '🏠 Movie Menu', callback_data: 'mv_menu' }]);
    return { inline_keyboard: rows };
};

// Send or edit "loading" message
const sendLoading = (bot, chatId, text = '⏳ Searching...') => bot.sendMessage(chatId, text, { parse_mode: 'HTML' });

// ─── Main module ─────────────────────────────────────────────────────────────
module.exports = (bot) => {

    // ═══ /movies — main menu ═══════════════════════════════════════════════
    bot.onText(/\/movies$/, (msg) => {
        bot.sendMessage(msg.chat.id, `🎬 <b>BlazeMovieHub — T20 Movie Center</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍿 Search, browse &amp; download movies in HD
🌐 Powered by <a href="${movieApi.SITE_URL}">BlazeMovieHub</a>
👑 By <b>Arnold T20</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Choose an option:`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🔍 Search Movie', callback_data: 'mv_new_search' },
                        { text: '📈 Trending Now', callback_data: 'mv_trending' }
                    ],
                    [
                        { text: '📀 How to Download', callback_data: 'mv_guide' },
                        { text: '🌐 Visit Site', url: movieApi.SITE_URL }
                    ]
                ]
            }
        });
    });

    // ═══ /moviesearch <query> ════════════════════════════════════════════════
    bot.onText(/\/moviesearch(?:\s+(.+))?/, async (msg, match) => {
        const query = match && match[1] ? match[1].trim() : null;
        if (!query) {
            return bot.sendMessage(msg.chat.id,
                `🔍 <b>Movie Search</b>\n\nUsage: <code>/moviesearch &lt;title&gt;</code>\n\nExamples:\n• <code>/moviesearch Avengers</code>\n• <code>/moviesearch Spider-Man</code>\n• <code>/moviesearch Fast and Furious</code>`,
                { parse_mode: 'HTML' });
        }

        const loading = await sendLoading(bot, msg.chat.id, `🔍 Searching for <b>"${escape(query)}"</b>...`);

        try {
            const data = await movieApi.searchMovies(query, 1);
            const items = data.items || [];

            if (!items.length) {
                return bot.editMessageText(
                    `❌ <b>No results found for:</b> "${escape(query)}"\n\nTry a different spelling or check the movie title.`,
                    { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML',
                      reply_markup: { inline_keyboard: [[{ text: '🔍 Search Again', callback_data: 'mv_new_search' }]] } }
                );
            }

            // Store results in session
            setSession(msg.from.id, {
                query, page: 1,
                results: items.map(i => ({ subjectId: i.subjectId, subjectType: i.subjectType, title: i.title, releaseDate: i.releaseDate, cover: i.cover?.url, genre: i.genre, detailPath: i.detailPath }))
            });

            const total = data.pager?.totalCount || items.length;
            const hasMore = data.pager?.hasMore || false;

            await bot.editMessageText(
                `🔍 <b>Search Results for:</b> "<i>${escape(query)}</i>"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 Found <b>${total}</b> result(s) — Page 1\n\n👇 <b>Tap a movie to view &amp; download:</b>`,
                {
                    chat_id: msg.chat.id,
                    message_id: loading.message_id,
                    parse_mode: 'HTML',
                    reply_markup: buildResultsKeyboard(items, query, 1, hasMore)
                }
            );

        } catch (err) {
            console.error('Movie search error:', err.message);
            bot.editMessageText(
                `❌ <b>Search failed.</b>\n\nCould not reach the movie database. Please try again.\n<i>${escape(err.message)}</i>`,
                { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML',
                  reply_markup: { inline_keyboard: [[{ text: '🔄 Retry', callback_data: `mv_search_${encodeURIComponent(query)}_1` }]] } }
            );
        }
    });

    // ═══ /download <query> — alias for moviesearch with download intent ════
    bot.onText(/\/download(?:\s+(.+))?/, async (msg, match) => {
        const query = match && match[1] ? match[1].trim() : null;
        if (!query) {
            return bot.sendMessage(msg.chat.id,
                `⬇️ <b>Movie Download</b>\n\nUsage: <code>/download &lt;movie title&gt;</code>\n\nExamples:\n• <code>/download Avengers</code>\n• <code>/download John Wick 4</code>\n• <code>/download Black Panther</code>\n\nI'll search and show you quality options!`,
                { parse_mode: 'HTML' });
        }

        const loading = await sendLoading(bot, msg.chat.id, `🔍 Searching for <b>"${escape(query)}"</b> to download...`);

        try {
            const data = await movieApi.searchMovies(query, 1);
            const items = data.items || [];

            if (!items.length) {
                return bot.editMessageText(
                    `❌ No results for "<b>${escape(query)}</b>". Try a different title.`,
                    { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML',
                      reply_markup: { inline_keyboard: [[{ text: '🔍 Try Another Search', callback_data: 'mv_new_search' }]] } }
                );
            }

            setSession(msg.from.id, {
                query, page: 1,
                results: items.map(i => ({ subjectId: i.subjectId, subjectType: i.subjectType, title: i.title, releaseDate: i.releaseDate, cover: i.cover?.url, genre: i.genre, detailPath: i.detailPath }))
            });

            const total = data.pager?.totalCount || items.length;
            const hasMore = data.pager?.hasMore || false;

            await bot.editMessageText(
                `⬇️ <b>Download:</b> "<i>${escape(query)}</i>"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 <b>${total}</b> result(s) found\n\n👇 Select a movie to choose quality:`,
                {
                    chat_id: msg.chat.id,
                    message_id: loading.message_id,
                    parse_mode: 'HTML',
                    reply_markup: buildResultsKeyboard(items, query, 1, hasMore)
                }
            );

        } catch (err) {
            console.error('Download search error:', err.message);
            bot.editMessageText(
                `❌ <b>Search failed.</b> Please try again later.`,
                { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML' }
            );
        }
    });

    // ═══ /trending ════════════════════════════════════════════════════════════
    bot.onText(/\/trending$/, async (msg) => {
        const loading = await sendLoading(bot, msg.chat.id, '📈 Loading trending movies...');
        try {
            const items = await movieApi.getTrending();
            if (!items.length) throw new Error('No trending data');

            await bot.editMessageText(
                `📈 <b>Trending Now on BlazeMovieHub</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔥 Top ${Math.min(items.length, 10)} trending movies right now\n\n👇 Tap any movie to view &amp; download:`,
                {
                    chat_id: msg.chat.id,
                    message_id: loading.message_id,
                    parse_mode: 'HTML',
                    reply_markup: buildTrendingKeyboard(items)
                }
            );

        } catch (err) {
            console.error('Trending error:', err.message);
            bot.editMessageText('❌ Could not load trending movies. Please try again.',
                { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML' });
        }
    });

    // ═══ /latestmovies ════════════════════════════════════════════════════════
    bot.onText(/\/latestmovies/, async (msg) => {
        const loading = await sendLoading(bot, msg.chat.id, '🔥 Loading latest releases...');
        try {
            const items = await movieApi.getTrending();
            if (!items.length) throw new Error('No data');

            const sorted = items.slice().sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

            await bot.editMessageText(
                `🔥 <b>Latest Movie Releases</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📅 Freshest titles on BlazeMovieHub\n\n👇 Tap any movie to view &amp; download:`,
                {
                    chat_id: msg.chat.id,
                    message_id: loading.message_id,
                    parse_mode: 'HTML',
                    reply_markup: buildTrendingKeyboard(sorted)
                }
            );
        } catch (err) {
            bot.editMessageText('❌ Could not load latest movies. Please try again.',
                { chat_id: msg.chat.id, message_id: loading.message_id, parse_mode: 'HTML' });
        }
    });

    // ═══ /moviehelp ═══════════════════════════════════════════════════════════
    bot.onText(/\/moviehelp/, (msg) => {
        bot.sendMessage(msg.chat.id, `📀 <b>How to Download Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<b>Step 1:</b> 🔍 Search for a movie
   → <code>/download Avengers</code>
   → <code>/moviesearch Spider-Man</code>

<b>Step 2:</b> 🎬 Pick a movie from results
   → Tap any result button

<b>Step 3:</b> 📀 Choose your quality
   → 4K | 1080p | 720p | 480p | 360p

<b>Step 4:</b> ⬇️ Download from site
   → Click the quality button to open BlazeMovieHub
   → Tap the download button on the page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Available Commands:</b>
🔍 <code>/moviesearch &lt;title&gt;</code>
⬇️ <code>/download &lt;title&gt;</code>
📈 <code>/trending</code>
🔥 <code>/latestmovies</code>
🎬 <code>/movies</code>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 <a href="${movieApi.SITE_URL}">BlazeMovieHub</a> — Stream &amp; Download HD`, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '🔍 Search a Movie Now', callback_data: 'mv_new_search' }],
                    [{ text: '📈 Trending', callback_data: 'mv_trending' }, { text: '🌐 Open Site', url: movieApi.SITE_URL }]
                ]
            }
        });
    });

    // ═══ Callback query handler ════════════════════════════════════════════════
    bot.on('callback_query', async (query) => {
        const data = query.data;
        const chatId = query.message.chat.id;
        const msgId = query.message.message_id;
        const userId = query.from.id;

        // Only handle mv_ callbacks
        if (!data.startsWith('mv_')) return;

        try {
            await bot.answerCallbackQuery(query.id);
        } catch (_) {}

        try {

            // ── Movie menu ──────────────────────────────────────────────────
            if (data === 'mv_menu') {
                await bot.editMessageText(`🎬 <b>BlazeMovieHub — T20 Movie Center</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍿 Search, browse &amp; download movies in HD
👑 By <b>Arnold T20</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔍 Search Movie', callback_data: 'mv_new_search' }, { text: '📈 Trending', callback_data: 'mv_trending' }],
                            [{ text: '📀 Download Guide', callback_data: 'mv_guide' }, { text: '🌐 Visit Site', url: movieApi.SITE_URL }]
                        ]
                    }
                });
            }

            // ── Search prompt ───────────────────────────────────────────────
            else if (data === 'mv_new_search') {
                await bot.editMessageText(`🔍 <b>Search for a Movie</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Send the movie title using this command:

<code>/moviesearch Avengers</code>
<code>/download Spider-Man</code>
<code>/moviesearch Fast and Furious 10</code>`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: [[{ text: '📈 Trending Instead', callback_data: 'mv_trending' }, { text: '🏠 Menu', callback_data: 'mv_menu' }]] }
                });
            }

            // ── Trending ────────────────────────────────────────────────────
            else if (data === 'mv_trending') {
                await bot.editMessageText('📈 <b>Loading trending movies...</b>', { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' });
                const items = await movieApi.getTrending();
                await bot.editMessageText(
                    `📈 <b>Trending Now on BlazeMovieHub</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔥 Top ${Math.min(items.length, 10)} trending right now\n\n👇 Tap a movie to view &amp; download:`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: buildTrendingKeyboard(items) }
                );
            }

            // ── Paginated search ────────────────────────────────────────────
            else if (data.startsWith('mv_search_')) {
                const parts = data.replace('mv_search_', '').split('_');
                const page = parseInt(parts.pop()) || 1;
                const query_str = decodeURIComponent(parts.join('_'));

                await bot.editMessageText(`🔍 <b>Searching page ${page}...</b>`, { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' });

                const d = await movieApi.searchMovies(query_str, page);
                const items = d.items || [];
                const hasMore = d.pager?.hasMore || false;

                if (!items.length) {
                    return bot.editMessageText('❌ No more results found.', { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' });
                }

                setSession(userId, {
                    query: query_str, page,
                    results: items.map(i => ({ subjectId: i.subjectId, subjectType: i.subjectType, title: i.title, releaseDate: i.releaseDate, cover: i.cover?.url, genre: i.genre, detailPath: i.detailPath }))
                });

                await bot.editMessageText(
                    `🔍 <b>Results for:</b> "<i>${escape(query_str)}</i>" — Page ${page}\n\n👇 Tap a movie to view &amp; download:`,
                    { chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: buildResultsKeyboard(items, query_str, page, hasMore) }
                );
            }

            // ── Movie picked — show details + quality ──────────────────────
            else if (data.startsWith('mv_pick_')) {
                const subjectId = data.replace('mv_pick_', '');

                await bot.editMessageText('⏳ <b>Loading movie details...</b>', { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' });

                const info = await movieApi.getMovieInfo(subjectId);
                const subject = info.subject || {};
                const resource = info.resource || {};
                const resolutions = movieApi.getResolutions(info);

                // Store selected movie in session
                setSession(userId, {
                    selectedId: subjectId,
                    selectedTitle: subject.title,
                    selectedDetailPath: subject.detailPath,
                    selectedResolutions: resolutions
                });

                const title = escape(subject.title || 'Unknown Title');
                const year = formatDate(subject.releaseDate);
                const genre = formatGenre(subject.genre);
                const type = movieApi.subjectTypeLabel(subject.subjectType);
                const rating = ratingStars(subject.imdbRatingValue);
                const country = escape(subject.countryName || '');
                const description = escape(subject.description || 'No description available.');
                const detailPath = subject.detailPath || '';
                const posterUrl = subject.cover?.url || subject.thumbnail;
                const uploadBy = resource.uploadBy ? `👤 ${escape(resource.uploadBy)}` : '';

                const caption = `🎬 <b>${title}</b> (${year})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${type}${country ? ` · 🌍 ${country}` : ''}
🎭 <b>Genre:</b> ${genre}
⭐ <b>Rating:</b> ${rating}
${uploadBy}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 ${description.slice(0, 300)}${description.length > 300 ? '...' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📀 <b>Choose your download quality:</b>`;

                const keyboard = buildQualityKeyboard(subjectId, detailPath, resolutions);

                // Try to send poster image
                if (posterUrl) {
                    try {
                        await bot.deleteMessage(chatId, msgId);
                        await bot.sendPhoto(chatId, posterUrl, {
                            caption,
                            parse_mode: 'HTML',
                            reply_markup: keyboard
                        });
                        return;
                    } catch (_) {}
                }

                // Fallback: text only
                await bot.editMessageText(caption, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'HTML', reply_markup: keyboard
                });
            }

            // ── Back from quality → show results again ─────────────────────
            else if (data.startsWith('mv_back_')) {
                const session = getSession(userId);
                const { query: q, results, page } = session;

                if (!results || !results.length) {
                    await bot.editMessageText('🔍 Session expired. Please search again.\n\n<code>/moviesearch &lt;title&gt;</code>', {
                        chat_id: chatId, message_id: msgId, parse_mode: 'HTML'
                    });
                    return;
                }

                await bot.editMessageText(
                    `🔍 <b>Results for:</b> "<i>${escape(q || 'movies')}</i>" — Page ${page || 1}\n\n👇 Tap a movie to view &amp; download:`,
                    {
                        chat_id: chatId, message_id: msgId, parse_mode: 'HTML',
                        reply_markup: buildResultsKeyboard(results, q || '', page || 1, false)
                    }
                );
            }

            // ── Download guide ─────────────────────────────────────────────
            else if (data === 'mv_guide') {
                await bot.editMessageText(`📀 <b>How to Download Movies</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Step 1:</b> 🔍 Search for a movie
<b>Step 2:</b> 🎬 Select from results
<b>Step 3:</b> 📀 Choose quality (4K/1080p/720p/480p/360p)
<b>Step 4:</b> ⬇️ Download from BlazeMovieHub

<b>Commands:</b>
<code>/download &lt;title&gt;</code>
<code>/moviesearch &lt;title&gt;</code>
<code>/trending</code>`, {
                    chat_id: chatId, message_id: msgId, parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🔍 Search Now', callback_data: 'mv_new_search' }],
                            [{ text: '📈 Trending', callback_data: 'mv_trending' }, { text: '🌐 Open Site', url: movieApi.SITE_URL }]
                        ]
                    }
                });
            }

        } catch (err) {
            if (!err.message?.includes('message is not modified') && !err.message?.includes('message to edit not found')) {
                console.error('Movie callback error:', err.message);
                try {
                    await bot.sendMessage(chatId, '❌ Something went wrong. Please try again with /movies', { parse_mode: 'HTML' });
                } catch (_) {}
            }
        }
    });
};

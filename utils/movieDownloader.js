// Movie Downloader Utility
// Fetches movie video URL and delivers to user via Telegram

const axios = require('axios');
const movieApi = require('./movieApi');

const SITE_URL = 'https://blazemoviehub.t20tech.site';

// Try to get a sendable video URL for a movie (trailer or actual video)
// Returns { url, title, isTrailer, size } or null
const getMovieVideoUrl = async (subjectId) => {
    try {
        const info = await movieApi.getMovieInfo(subjectId);
        const subject = info.subject || {};

        // Check trailer first (always available when hasResource=true)
        const trailer = subject.trailer?.videoAddress;
        if (trailer && trailer.url) {
            return {
                url: trailer.url,
                title: subject.title,
                isTrailer: true,
                duration: trailer.duration || 0,
                width: trailer.width || 0,
                height: trailer.height || 0,
                size: trailer.size || 0,
                poster: subject.cover?.url || subject.thumbnail,
                detailPath: subject.detailPath,
            };
        }

        return null;
    } catch (err) {
        console.error('getMovieVideoUrl error:', err.message);
        return null;
    }
};

// Send movie content to user after payment/OTP
// Sends: trailer video + premium download link card
const deliverMovieToUser = async (bot, chatId, subjectId, quality, movieTitle, detailPath) => {
    const qualityLabel = movieApi.resolutionLabel(quality || 480);
    const watchUrl = `${SITE_URL}/movie/${detailPath}`;
    const downloadUrl = `${SITE_URL}/movie/${detailPath}?quality=${quality || 480}`;

    // Step 1: Send "processing" message
    const processing = await bot.sendMessage(chatId,
        `⚙️ <b>Preparing your movie...</b>\n\n🎬 <b>${escHtml(movieTitle)}</b>\n📀 Quality: <b>${qualityLabel}</b>`,
        { parse_mode: 'HTML' });

    // Step 2: Try to get and send the trailer
    let videoSent = false;
    try {
        const vid = await getMovieVideoUrl(subjectId);
        if (vid && vid.url) {
            try {
                await bot.sendVideo(chatId, vid.url, {
                    caption: `🎬 <b>${escHtml(vid.title)}</b>\n🎞️ <i>Preview / Trailer</i>\n\nFull movie available via the download link below 👇`,
                    parse_mode: 'HTML',
                    duration: vid.duration || undefined,
                    width: vid.width || undefined,
                    height: vid.height || undefined,
                    supports_streaming: true,
                });
                videoSent = true;
            } catch (sendErr) {
                // If Telegram can't fetch the URL, try downloading it
                if (vid.size && vid.size < 50 * 1024 * 1024) {
                    try {
                        const resp = await axios.get(vid.url, { responseType: 'arraybuffer', timeout: 30000 });
                        const buffer = Buffer.from(resp.data);
                        await bot.sendVideo(chatId, buffer, {
                            caption: `🎬 <b>${escHtml(vid.title)}</b> — Preview`,
                            parse_mode: 'HTML',
                            supports_streaming: true,
                        });
                        videoSent = true;
                    } catch (_) {}
                }
            }
        }
    } catch (_) {}

    // Step 3: Delete the processing message
    try { await bot.deleteMessage(chatId, processing.message_id); } catch (_) {}

    // Step 4: Send premium access card with download link
    const poster = await getPosterUrl(subjectId);

    const accessMsg = `✅ <b>Access Granted!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 <b>${escHtml(movieTitle)}</b>
📀 <b>Quality:</b> ${qualityLabel}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${videoSent ? '🎞️ <i>Preview video sent above</i>\n' : ''}
📥 <b>Your Premium Download Link:</b>
<a href="${downloadUrl}">👆 Tap here to download (${qualityLabel})</a>

▶️ <b>Watch Online:</b>
<a href="${watchUrl}">Open in BlazeMovieHub</a>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ <i>Link is valid — save it before it expires!</i>
👑 <i>T20 Wolf Bot by Arnold T20</i>`;

    const keyboard = {
        inline_keyboard: [
            [
                { text: `⬇️ Download ${qualityLabel}`, url: downloadUrl },
                { text: '▶️ Watch Online', url: watchUrl }
            ],
            [{ text: '🔍 Search Another Movie', callback_data: 'mv_new_search' }]
        ]
    };

    if (poster) {
        try {
            await bot.sendPhoto(chatId, poster, { caption: accessMsg, parse_mode: 'HTML', reply_markup: keyboard });
            return;
        } catch (_) {}
    }

    await bot.sendMessage(chatId, accessMsg, { parse_mode: 'HTML', reply_markup: keyboard });
};

const getPosterUrl = async (subjectId) => {
    try {
        const info = await movieApi.getMovieInfo(subjectId);
        return info.subject?.cover?.url || info.subject?.thumbnail || null;
    } catch (_) {
        return null;
    }
};

const escHtml = (text) =>
    String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

module.exports = { deliverMovieToUser, getMovieVideoUrl };

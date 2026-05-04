// Payment Commands Plugin
// Handles Telegram Stars payments + OTP access codes for movie downloads

const crypto = require('crypto');
const { deliverMovieToUser } = require('../utils/movieDownloader');
const movieApi = require('../utils/movieApi');
const styles = require('../utils/styles');

// ─── Stores (in-memory) ────────────────────────────────────────────────────────
// OTP store: code -> { subjectId, detailPath, title, quality, used, usedBy, createdAt }
const otpStore = new Map();

// Payment intent store (tracks what user is trying to buy before Stars invoice)
// key: `${userId}_${subjectId}_${quality}` -> { subjectId, title, detailPath, quality, createdAt }
const paymentIntents = new Map();

// Granted access store (to avoid re-charging): `${userId}_${subjectId}` -> { quality, grantedAt }
const grantedAccess = new Map();

// ─── Config ────────────────────────────────────────────────────────────────────
const MOVIE_STARS_PRICE = 50; // 50 Telegram Stars per movie
const OTP_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const OTP_LENGTH = 8;

// ─── Helpers ────────────────────────────────────────────────────────────────────
const escHtml = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const genOtp = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous chars
    let code = 'T20-';
    for (let i = 0; i < OTP_LENGTH; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
};

const hasAccess = (userId, subjectId) => {
    return grantedAccess.has(`${userId}_${subjectId}`);
};

const grantAccess = (userId, subjectId, quality) => {
    grantedAccess.set(`${userId}_${subjectId}`, { quality, grantedAt: Date.now() });
};

// Clean up old payment intents (> 1 hour old)
setInterval(() => {
    const now = Date.now();
    for (const [k, v] of paymentIntents) {
        if (now - v.createdAt > 60 * 60 * 1000) paymentIntents.delete(k);
    }
    for (const [k, v] of otpStore) {
        if (now - v.createdAt > OTP_EXPIRY_MS) otpStore.delete(k);
    }
}, 15 * 60 * 1000);

// ─── Export ─────────────────────────────────────────────────────────────────────
module.exports = (bot, isAdmin) => {

    // ══ Send Telegram Stars invoice for a movie ════════════════════════════════
    const sendMovieInvoice = async (chatId, userId, subjectId, detailPath, title, quality) => {
        const qualityLabel = movieApi.resolutionLabel(quality);
        const intentKey = `${userId}_${subjectId}_${quality}`;

        paymentIntents.set(intentKey, {
            subjectId, detailPath, title, quality,
            createdAt: Date.now()
        });

        const payload = JSON.stringify({ subjectId, detailPath, title, quality, userId });

        try {
            await bot.sendInvoice(
                chatId,
                `🎬 ${title}`,
                `Stream or download "${title}" in ${qualityLabel} quality.\nPowered by BlazeMovieHub.`,
                payload,
                '',   // empty provider_token = Telegram Stars
                'XTR', // Telegram Stars currency
                [{ label: `${title} (${qualityLabel})`, amount: MOVIE_STARS_PRICE }],
                {
                    photo_url: `https://blazemoviehub.t20tech.site`,
                    photo_width: 300,
                    photo_height: 200,
                    need_name: false,
                    need_phone_number: false,
                    need_email: false,
                    is_flexible: false,
                    start_parameter: `movie_${subjectId}`,
                    protect_content: false,
                }
            );
        } catch (err) {
            console.error('sendInvoice error:', err.message);
            // Fallback if invoice fails
            await bot.sendMessage(chatId,
                `❌ <b>Could not create Stars payment.</b>\n\nTry using an OTP code instead.\nContact admin for a free OTP: /moviehelp`,
                { parse_mode: 'HTML' });
        }
    };

    // ══ Pre-checkout query — must answer within 10s ════════════════════════════
    bot.on('pre_checkout_query', async (query) => {
        try {
            // Validate payload
            const data = JSON.parse(query.invoice_payload);
            if (data.subjectId && data.title) {
                await bot.answerPreCheckoutQuery(query.id, true);
            } else {
                await bot.answerPreCheckoutQuery(query.id, false, { error_message: 'Invalid movie data.' });
            }
        } catch (err) {
            console.error('pre_checkout_query error:', err.message);
            try {
                await bot.answerPreCheckoutQuery(query.id, false, { error_message: 'Payment error. Please try again.' });
            } catch (_) {}
        }
    });

    // ══ Successful payment — deliver the movie ═════════════════════════════════
    bot.on('message', async (msg) => {
        if (!msg.successful_payment) return;

        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const payment = msg.successful_payment;

        try {
            const data = JSON.parse(payment.invoice_payload);
            const { subjectId, detailPath, title, quality } = data;

            console.log(`💰 Stars payment: ${payment.total_amount} XTR from user ${userId} for "${title}"`);

            // Grant access
            grantAccess(userId, subjectId, quality);

            // Deliver the movie
            await deliverMovieToUser(bot, chatId, subjectId, quality, title, detailPath);

        } catch (err) {
            console.error('successful_payment error:', err.message);
            await bot.sendMessage(chatId,
                `✅ <b>Payment received!</b> (${payment.total_amount} ⭐)\n\nBut there was an error delivering your movie. Please contact support with your transaction ID.\n\n<code>${payment.telegram_payment_charge_id}</code>`,
                { parse_mode: 'HTML' });
        }
    });

    // ══ OTP Redemption — /redeem <code> ═══════════════════════════════════════
    bot.onText(/\/redeem(?:\s+(.+))?/, async (msg, match) => {
        const userId = msg.from.id;
        const chatId = msg.chat.id;
        const code = match[1] ? match[1].trim().toUpperCase() : null;

        if (!code) {
            return bot.sendMessage(chatId,
                `🔑 <b>Redeem an OTP Code</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nUsage: <code>/redeem T20-XXXXXXXX</code>\n\nOTP codes can be obtained from Arnold T20 (admin).`,
                { parse_mode: 'HTML' });
        }

        const otp = otpStore.get(code);

        if (!otp) {
            return bot.sendMessage(chatId, `❌ <b>Invalid OTP code.</b>\n\nCode "<code>${escHtml(code)}</code>" not found or already expired.`, { parse_mode: 'HTML' });
        }

        if (otp.used) {
            return bot.sendMessage(chatId, `❌ <b>OTP already used.</b>\n\nThis code has already been redeemed.`, { parse_mode: 'HTML' });
        }

        if (Date.now() - otp.createdAt > OTP_EXPIRY_MS) {
            otpStore.delete(code);
            return bot.sendMessage(chatId, `❌ <b>OTP expired.</b>\n\nThis code has expired (codes are valid for 24 hours).`, { parse_mode: 'HTML' });
        }

        // Mark OTP as used
        otp.used = true;
        otp.usedBy = userId;
        otp.usedAt = Date.now();

        // Grant access
        grantAccess(userId, otp.subjectId, otp.quality);

        console.log(`🔑 OTP redeemed: ${code} by user ${userId} for "${otp.title}"`);

        await bot.sendMessage(chatId,
            `✅ <b>OTP Accepted!</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔑 Code: <code>${escHtml(code)}</code>\n🎬 Movie: <b>${escHtml(otp.title)}</b>\n📀 Quality: <b>${movieApi.resolutionLabel(otp.quality)}</b>\n\n⏳ Fetching your movie...`,
            { parse_mode: 'HTML' });

        await deliverMovieToUser(bot, chatId, otp.subjectId, otp.quality, otp.title, otp.detailPath);
    });

    // ══ Admin: Generate OTP codes ═══════════════════════════════════════════════
    bot.onText(/\/genotp(?:\s+(.+))?/, async (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, styles.errorMsg('Admin only command.'), { parse_mode: 'HTML' });
        }

        // Parse: /genotp [count] or /genotp [movie_title] [quality] [count]
        const args = match[1] ? match[1].trim().split(/\s+/) : [];
        const count = Math.min(parseInt(args[args.length - 1]) || 1, 20);
        const movie = args.length > 1 ? args.slice(0, -1).join(' ') : 'Any Movie';
        const quality = 480;

        const codes = [];
        for (let i = 0; i < count; i++) {
            const code = genOtp();
            otpStore.set(code, {
                subjectId: 'any', // 'any' = usable for any movie
                detailPath: '',
                title: movie,
                quality,
                used: false,
                createdAt: Date.now()
            });
            codes.push(code);
        }

        const codeList = codes.map((c, i) => `${i + 1}. <code>${c}</code>`).join('\n');

        await bot.sendMessage(msg.chat.id,
            `🔑 <b>Generated ${count} OTP Code(s)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${codeList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Valid for: <b>24 hours</b>
🎬 For: <b>${escHtml(movie)}</b>
📀 Quality: <b>${movieApi.resolutionLabel(quality)}</b>

Users can redeem with: <code>/redeem &lt;code&gt;</code>`,
            { parse_mode: 'HTML' });
    });

    // ══ Admin: List active OTPs ═══════════════════════════════════════════════
    bot.onText(/\/listotp/, async (msg) => {
        if (!isAdmin(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, styles.errorMsg('Admin only command.'), { parse_mode: 'HTML' });
        }

        const valid = [];
        const now = Date.now();
        for (const [code, otp] of otpStore) {
            if (!otp.used && now - otp.createdAt < OTP_EXPIRY_MS) {
                const expiresIn = Math.round((OTP_EXPIRY_MS - (now - otp.createdAt)) / 60000);
                valid.push(`<code>${code}</code> — ${escHtml(otp.title)} (${expiresIn}m left)`);
            }
        }

        if (!valid.length) {
            return bot.sendMessage(msg.chat.id, `📋 <b>No active OTPs</b>\n\nGenerate with: <code>/genotp [count]</code>`, { parse_mode: 'HTML' });
        }

        await bot.sendMessage(msg.chat.id,
            `📋 <b>Active OTP Codes (${valid.length})</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${valid.join('\n')}`,
            { parse_mode: 'HTML' });
    });

    // ══ Admin: Revoke an OTP ══════════════════════════════════════════════════
    bot.onText(/\/revokeop(?:\s+(.+))?/, async (msg, match) => {
        if (!isAdmin(msg.from.id)) return;
        const code = match[1]?.trim().toUpperCase();
        if (!code || !otpStore.has(code)) {
            return bot.sendMessage(msg.chat.id, `❌ OTP not found: <code>${escHtml(code)}</code>`, { parse_mode: 'HTML' });
        }
        otpStore.delete(code);
        await bot.sendMessage(msg.chat.id, `✅ OTP revoked: <code>${escHtml(code)}</code>`, { parse_mode: 'HTML' });
    });

    // ══ Callback: Handle buy/OTP buttons from movie commands ═══════════════════
    bot.on('callback_query', async (query) => {
        const data = query.data;
        if (!data.startsWith('pay_') && !data.startsWith('otp_')) return;

        const chatId = query.message.chat.id;
        const userId = query.from.id;

        try {
            await bot.answerCallbackQuery(query.id);
        } catch (_) {}

        // ── Pay with Stars ──────────────────────────────────────────────────
        if (data.startsWith('pay_stars_')) {
            // Format: pay_stars_SUBJECTID_QUALITY_DETAILPATH
            const parts = data.replace('pay_stars_', '').split('_');
            const subjectId = parts[0];
            const quality = parseInt(parts[1]) || 480;
            const detailPath = parts.slice(2).join('_');

            // Check if already has access
            if (hasAccess(userId, subjectId)) {
                const access = grantedAccess.get(`${userId}_${subjectId}`);
                return bot.sendMessage(chatId,
                    `✅ <b>You already have access to this movie!</b>\n\nWould you like to re-download it?`,
                    {
                        parse_mode: 'HTML',
                        reply_markup: {
                            inline_keyboard: [[
                                { text: '📥 Re-download', callback_data: `pay_deliver_${subjectId}_${access.quality}_${detailPath}` }
                            ]]
                        }
                    });
            }

            // Get movie title from info
            try {
                const info = await movieApi.getMovieInfo(subjectId);
                const title = info.subject?.title || 'Movie';

                await bot.sendMessage(chatId,
                    `⭐ <b>Purchase with Telegram Stars</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎬 <b>${escHtml(title)}</b>\n📀 Quality: <b>${movieApi.resolutionLabel(quality)}</b>\n💰 Price: <b>${MOVIE_STARS_PRICE} ⭐ Stars</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n✨ One-time purchase — permanent access\n⭐ Tap below to pay with Telegram Stars:`,
                    { parse_mode: 'HTML' }
                );

                await sendMovieInvoice(chatId, userId, subjectId, detailPath, title, quality);

            } catch (err) {
                console.error('pay_stars error:', err.message);
                await bot.sendMessage(chatId, '❌ Could not load movie info. Please try again.', { parse_mode: 'HTML' });
            }
        }

        // ── OTP Entry prompt ────────────────────────────────────────────────
        else if (data.startsWith('otp_enter_')) {
            const parts = data.replace('otp_enter_', '').split('_');
            const subjectId = parts[0];
            const quality = parseInt(parts[1]) || 480;
            const detailPath = parts.slice(2).join('_');

            await bot.sendMessage(chatId,
                `🔑 <b>Enter Your OTP Code</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nSend the command:\n<code>/redeem T20-XXXXXXXX</code>\n\nOTP codes are provided by Arnold T20 (admin).\nEach code is valid for <b>24 hours</b> and can be used once.`,
                {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '🔍 Search Another Movie', callback_data: 'mv_new_search' }
                        ]]
                    }
                });
        }

        // ── Deliver (for already-purchased) ────────────────────────────────
        else if (data.startsWith('pay_deliver_')) {
            const parts = data.replace('pay_deliver_', '').split('_');
            const subjectId = parts[0];
            const quality = parseInt(parts[1]) || 480;
            const detailPath = parts.slice(2).join('_');

            if (!hasAccess(userId, subjectId)) {
                return bot.sendMessage(chatId, '❌ Access not found. Please purchase or use an OTP code.', { parse_mode: 'HTML' });
            }

            try {
                const info = await movieApi.getMovieInfo(subjectId);
                const title = info.subject?.title || 'Movie';
                await deliverMovieToUser(bot, chatId, subjectId, quality, title, detailPath);
            } catch (err) {
                await bot.sendMessage(chatId, '❌ Error delivering movie. Please try again.', { parse_mode: 'HTML' });
            }
        }
    });

    // Expose for use by movieCommands
    return { sendMovieInvoice, hasAccess, grantAccess, MOVIE_STARS_PRICE };
};

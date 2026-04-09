// Ping Command Plugin
module.exports = (bot) => {
    bot.onText(/\/ping/, (msg) => {
        const latencyMs = Date.now() - (msg.date * 1000);
        bot.sendMessage(msg.chat.id,
            `🏓 <b>PONG!</b>\n⚡ ${latencyMs} ms\n🟢 Online`,
            { parse_mode: 'HTML' }
        );
    });
};
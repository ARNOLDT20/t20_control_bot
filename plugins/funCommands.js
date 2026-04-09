// Fun & Utility Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    // === 8BALL ===
    bot.onText(/\/8ball(?:\s+(.+))?/, (msg, match) => {
        const question = match[1] || 'Is this a question?';
        const answers = [
            '🎱 Yes, definitely!',
            '🎱 No, absolutely not.',
            '🎱 Maybe, ask again later.',
            '🎱 The stars are unclear.',
            '🎱 Outlook good.',
            '🎱 Don\'t count on it.',
            '🎱 Ask again later.',
            '🎱 Concentrate and ask again.',
            '🎱 My sources say no.',
            '🎱 Signs point to yes.',
            '🎱 Without a doubt!',
            '🎱 Impossible to tell.'
        ];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        const response = `<b>Question:</b> ${question}\n\n${randomAnswer}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === DICE ROLL ===
    bot.onText(/\/roll(?:\s+(\d+)d(\d+))?/, (msg, match) => {
        const dice = match ? (match[1] || 1) : 1;
        const sides = match ? (match[2] || 6) : 6;
        
        let total = 0;
        let rolls = [];
        
        for (let i = 0; i < dice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        const response = `🎲 <b>Rolling ${dice}d${sides}:</b>\n\n${rolls.map((r, i) => `Roll ${i + 1}: <b>${r}</b>`).join('\n')}\n\n<b>Total: ${total}</b>`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === FLIP COIN ===
    bot.onText(/\/flip/, (msg) => {
        const result = Math.random() > 0.5 ? 'Heads 🪙' : 'Tails 🪙';
        const response = `<b>Coin Flip Result:</b>\n\n${result}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === CHOOSE ===
    bot.onText(/\/choose\s+(.+)/, (msg, match) => {
        const options = match[1].split('|').map(opt => opt.trim());
        if (options.length < 2) {
            bot.sendMessage(msg.chat.id, '❌ Please provide at least 2 options separated by |', { parse_mode: 'HTML' });
            return;
        }
        const chosen = options[Math.floor(Math.random() * options.length)];
        const response = `<b>Hmm, I choose:</b>\n\n<b><u>${chosen}</u></b>`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === RATE ===
    bot.onText(/\/rate\s+(.+)/, (msg, match) => {
        const thing = match[1];
        const rating = Math.floor(Math.random() * 11);
        const stars = '⭐'.repeat(rating);
        const response = `<b>Rating for:</b> ${thing}\n\n${stars}${rating === 10 ? ' Perfect!' : rating >= 7 ? ' Pretty Good!' : rating >= 4 ? ' Average.' : ' Could be better.'}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === JOKE ===
    bot.onText(/\/joke/, (msg) => {
        const jokes = [
            { setup: 'Why don\'t scientists trust atoms?', punchline: 'Because they make up everything!' },
            { setup: 'What do you call a fake noodle?', punchline: 'An impasta!' },
            { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field!' },
            { setup: 'What do you call a boomerang that doesn\'t come back?', punchline: 'A stick!' },
            { setup: 'Why don\'t eggs tell jokes?', punchline: 'They\'d crack each other up!' },
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        const response = `😂 <b>${joke.setup}</b>\n\n${joke.punchline}`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === REVERSE TEXT ===
    bot.onText(/\/reverse\s+(.+)/, (msg, match) => {
        const text = match[1];
        const reversed = text.split('').reverse().join('');
        const response = `<b>Original:</b> ${text}\n\n<b>Reversed:</b> <code>${reversed}</code>`;
        bot.sendMessage(msg.chat.id, response, { parse_mode: 'HTML' });
    });

    // === UPPERCASE ===
    bot.onText(/\/upper\s+(.+)/, (msg, match) => {
        const text = match[1].toUpperCase();
        bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
    });

    // === LOWERCASE ===
    bot.onText(/\/lower\s+(.+)/, (msg, match) => {
        const text = match[1].toLowerCase();
        bot.sendMessage(msg.chat.id, text, { parse_mode: 'HTML' });
    });
};

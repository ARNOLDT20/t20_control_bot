// Chatbot Plugin
// AI-powered conversational responses

const styles = require('../utils/styles');

// Simple AI responses database
const responses = {
    greetings: [
        "Hello! 👋 How can I help you today?",
        "Hi there! 🤖 What can I do for you?",
        "Greetings! 🌟 How may I assist you?",
        "Hey! 😊 What would you like to know?"
    ],
    questions: {
        "how are you": ["I'm doing great! Thanks for asking. 🤖", "I'm excellent! Ready to help you. ✨"],
        "what can you do": ["I can help with various tasks! Type /menu to see all my commands. 📋", "I'm your AI assistant! Check /start for all my capabilities. 🚀"],
        "who made you": ["I was created by ARNOLD T20! 👑 The ultimate bot developer.", "ARNOLD T20 built me with love and code! 💻❤️"],
        "what is your name": ["I'm T20 Control Bot! 🤖 Your royal assistant.", "You can call me T20 Bot! 👑"],
        "help": ["Type /menu for all commands, or /start to get started! 📚", "Need help? Try /help or /menu for command list! 🆘"]
    },
    keywords: {
        "hello": "greetings",
        "hi": "greetings",
        "hey": "greetings",
        "howdy": "greetings",
        "greetings": "greetings",
        "good morning": "greetings",
        "good afternoon": "greetings",
        "good evening": "greetings",
        "how are you": "how are you",
        "how do you do": "how are you",
        "what can you do": "what can you do",
        "what do you do": "what can you do",
        "who made you": "who made you",
        "who created you": "who made you",
        "what is your name": "what is your name",
        "your name": "what is your name",
        "help": "help",
        "assist": "help",
        "support": "help"
    },
    fallback: [
        "I'm not sure I understand. Try /menu for available commands! 🤔",
        "Hmm, I didn't catch that. Type /help for assistance! ❓",
        "Sorry, I don't understand. Check /start for all my features! 📋",
        "I'm still learning! Use /menu to see what I can do. 📚"
    ]
};

// Function to get AI response
function getAIResponse(message) {
    const text = message.toLowerCase().trim();

    // Check for exact question matches
    for (const [question, responses] of Object.entries(responses.questions)) {
        if (text.includes(question)) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    // Check for keyword matches
    for (const [keyword, category] of Object.entries(responses.keywords)) {
        if (text.includes(keyword)) {
            if (category === "greetings") {
                return responses.greetings[Math.floor(Math.random() * responses.greetings.length)];
            }
            return responses.questions[category][Math.floor(Math.random() * responses.questions[category].length)];
        }
    }

    // Fallback response
    return responses.fallback[Math.floor(Math.random() * responses.fallback.length)];
}

module.exports = (bot) => {
    console.log('🤖 Chatbot loaded');

    // Handle chatbot conversations
    bot.onText(/\/chat (.+)/, async (msg, match) => {
        const query = match[1];
        const response = getAIResponse(query);

        const reply = `${styles.header('🤖 T20 Chatbot', '💬')}
<i>Your AI Assistant</i>

<b>You:</b> ${query}

<b>T20 Bot:</b> ${response}

${styles.dividerShort}
💡 <i>Try asking me questions or type /menu for commands!</i>`;

        await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    // Handle direct messages to bot (private chats)
    bot.on('message', async (msg) => {
        // Only respond in private chats, not groups
        if (msg.chat.type === 'private' && !msg.text?.startsWith('/')) {
            const response = getAIResponse(msg.text || '');

            const reply = `${styles.header('🤖 T20 Chatbot', '💬')}
<i>AI Conversation</i>

<b>You:</b> ${msg.text}

<b>T20 Bot:</b> ${response}

${styles.dividerShort}
💡 <i>Type /menu for commands or ask me anything!</i>`;

            await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
        }
    });

    // Chatbot help command
    bot.onText(/\/chatbot/, async (msg) => {
        const helpText = `${styles.header('🤖 T20 Chatbot', '💬')}
<i>AI-Powered Conversations</i>

${styles.section('💬', 'Chat Commands', [
            styles.listItem('💭', '/chat [message] — Talk to AI'),
            styles.listItem('🤖', 'DM me directly — Auto chat mode'),
            styles.listItem('❓', 'Ask questions — Get smart responses'),
            styles.listItem('🆘', '/chatbot — This help menu')
        ])}

${styles.section('🧠', 'What I Can Do', [
            styles.listItem('👋', 'Greetings & conversations'),
            styles.listItem('❓', 'Answer questions about myself'),
            styles.listItem('📚', 'Help with bot commands'),
            styles.listItem('🎯', 'Smart keyword recognition')
        ])}

${styles.dividerLong}
🚀 <i>Try: "/chat hello" or just DM me!</i>

${styles.menuFooter('ARNOLD T20')}`;

        await bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
    });
};
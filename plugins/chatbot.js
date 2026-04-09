// Chatbot Plugin
// AI-powered conversational responses using external API

const axios = require('axios');
const styles = require('../utils/styles');

// Function to get AI response from external API
async function getAIResponse(message) {
    try {
        // Use T20 WOLF API
        const endpoint = 'https://jqkciagpzjpmfypewkyg.supabase.co/functions/v1/t20-wolf-chat';
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxa2NpYWdwempwbWZ5cGV3a3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzYwMTcsImV4cCI6MjA5MTI1MjAxN30.XAANVCxwnFJm4_C5dnfXnd_nRd7MWP7lDxATnHUpOas';

        const response = await axios.post(endpoint, {
            message: message
        }, {
            timeout: 15000, // 15 second timeout for AI responses
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'User-Agent': 'T20-Control-Bot/1.0'
            }
        });

        if (response.data && response.data.reply) {
            return response.data.reply;
        }

        // If unexpected response format, use fallback
        throw new Error('Unexpected API response format');

    } catch (error) {
        console.error('T20 WOLF API error:', error.message);

        // Intelligent fallback responses based on message content
        return getIntelligentFallback(message);
    }
}

// Intelligent fallback response system
function getIntelligentFallback(message) {
    const text = message.toLowerCase().trim();

    // Greetings
    if (text.match(/\b(hello|hi|hey|good morning|good afternoon|good evening|greetings|howdy)\b/)) {
        const greetings = [
            "Hello! 👋 How can I help you today?",
            "Hi there! 🤖 What can I do for you?",
            "Hey! 😊 How's it going?",
            "Greetings! 🌟 How may I assist you?",
            "Hello! 👋 I'm here to help!"
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Questions about well-being
    if (text.match(/\b(how are you|how do you do|how's it going|what's up)\b/)) {
        const responses = [
            "I'm doing great! Thanks for asking. 🤖 How about you?",
            "I'm excellent! Ready to help you with anything. ✨",
            "I'm fantastic! 🤖 What can I help you with today?",
            "I'm doing well, thank you! How can I assist you? 😊"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Questions about capabilities
    if (text.match(/\b(what can you do|what do you do|help|commands|features)\b/)) {
        return "I can help with many things! 🤖 Use /menu to see all my commands, or ask me questions. I'm powered by intelligent conversation systems!";
    }

    // Questions about origin
    if (text.match(/\b(who made you|who created you|who built you|creator|developer)\b/)) {
        return "I was created by ARNOLD T20! 👑 The ultimate bot developer and tech innovator. He's amazing at building AI systems!";
    }

    // Questions about name
    if (text.match(/\b(what is your name|your name|who are you|what are you)\b/)) {
        const names = [
            "I'm T20 Control Bot! 🤖 Your royal assistant.",
            "You can call me T20 Bot! 👑 I'm here to help.",
            "I'm the T20 Control Bot! 🤖 Ready to assist you.",
            "My name is T20 Control Bot! 👑 How can I help?"
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    // Questions about AI/time
    if (text.match(/\b(what time|time|date|day)\b/)) {
        const now = new Date();
        return `It's currently ${now.toLocaleTimeString()} on ${now.toLocaleDateString()}. ⏰ How can I help you today?`;
    }

    // Programming/tech questions
    if (text.match(/\b(javascript|js|python|code|programming|developer|tech)\b/)) {
        const techResponses = [
            "I love talking about programming! 💻 What specific technology or language are you working with?",
            "Tech is my favorite topic! 🚀 What programming language or framework are you interested in?",
            "Programming is awesome! 🤖 What are you building or learning about?"
        ];
        return techResponses[Math.floor(Math.random() * techResponses.length)];
    }

    // Thanks
    if (text.match(/\b(thank you|thanks|thx|ty)\b/)) {
        const thanks = [
            "You're welcome! 😊 Is there anything else I can help with?",
            "My pleasure! 🤖 Happy to help!",
            "No problem at all! 👋 What else can I do for you?",
            "You're very welcome! ✨ Let me know if you need anything else!"
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
    }

    // Goodbye
    if (text.match(/\b(bye|goodbye|see you|later|cya)\b/)) {
        const goodbyes = [
            "Goodbye! 👋 Have a great day!",
            "See you later! 🤖 Take care!",
            "Bye! 👋 Come back anytime!",
            "Take care! 😊 See you soon!"
        ];
        return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }

    // Default conversational responses
    const defaultResponses = [
        "That's interesting! 🤔 Can you tell me more about that?",
        "I understand! 💭 What else would you like to know?",
        "Thanks for sharing that! 📝 Is there something specific you'd like help with?",
        "I see! 🤖 How can I assist you further?",
        "That's cool! 😊 What else can I help you with today?",
        "I appreciate you telling me that! 💬 What would you like to do next?"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

module.exports = (bot) => {
    console.log('🤖 Chatbot loaded');

    // Handle chatbot conversations
    bot.onText(/\/chat (.+)/, async (msg, match) => {
        const query = match[1];
        const response = await getAIResponse(query);

        const reply = `${styles.header('🤖 T20 WOLF AI Chatbot', '💬')}
<i>Your AI Assistant</i>

<b>You:</b> ${query}

<b>T20 WOLF AI:</b> ${response}

${styles.dividerShort}
💡 <i>Try asking me questions or type /menu for commands!</i>`;

        await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    // Handle direct messages to bot (private chats)
    bot.on('message', async (msg) => {
        // Only respond in private chats, not groups
        if (msg.chat.type === 'private' && !msg.text?.startsWith('/')) {
            const response = await getAIResponse(msg.text || '');

            const reply = `${styles.header('🤖 T20 WOLF AI Chatbot', '💬')}
<i>AI Conversation</i>

<b>You:</b> ${msg.text}

<b>T20 AI:</b> ${response}

${styles.dividerShort}
💡 <i>Type /menu for commands or ask me anything!</i>`;

            await bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
        }
    });

    // Chatbot help command
    bot.onText(/\/chatbot/, async (msg) => {
const helpText = `${styles.header('🤖 T20 WOLF AI Chatbot', '🐺🔥')}
<i>Powered by T20 WOLF AI</i>

${styles.section('💬', 'Chat Commands', [
    styles.listItem('💭', '/chat [message] — Talk to T20 WOLF AI'),
    styles.listItem('🤖', 'DM me directly — Auto AI chat mode'),
    styles.listItem('❓', 'Ask questions — Get intelligent responses'),
    styles.listItem('🆘', '/chatbot — This help menu')
])}

${styles.section('🐺', 'T20 WOLF AI Features', [
    styles.listItem('🎯', 'Natural conversations'),
    styles.listItem('💡', 'Smart question answering'),
    styles.listItem('🌐', 'Powered by T20 WOLF AI'),
    styles.listItem('⚡', 'Real-time AI responses'),
    styles.listItem('🔥', 'Advanced AI capabilities')
])}

${styles.section('🔧', 'How It Works', [
    styles.listItem('🔗', 'Primary: T20 WOLF AI API'),
    styles.listItem('🛡️', 'Fallback: Intelligent responses'),
    styles.listItem('🎪', 'Pattern: Advanced AI processing'),
    styles.listItem('📚', 'Learning: Context awareness')
])}

${styles.dividerLong}
🚀 <i>Try: "/chat hello" or DM me directly!</i>

${styles.menuFooter('ARNOLD T20')}`;

        await bot.sendMessage(msg.chat.id, helpText, { parse_mode: 'HTML' });
    });
};
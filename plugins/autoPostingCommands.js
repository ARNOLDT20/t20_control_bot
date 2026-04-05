// Auto-Posting Plugin with Beautiful Templates and Blog Fetching
const styles = require('../utils/styles');
const { createTechTipPost, createQuestionPost, createBlogPost, createMixedPost } = require('../utils/templateFormatter');
const blogFetcher = require('../utils/blogFetcher');

const techTips = [
    "💡 <b>Did you know?</b>\nUse <code>const</code> and <code>let</code> in JavaScript instead of <code>var</code> for better scoping and performance.",
    "⚡ <b>Quick Tip:</b>\nAlways validate user input on the server-side, even if you validate on the client-side!",
    "🔒 <b>Security Tip:</b>\nNever commit passwords or API keys to version control. Use environment variables instead.",
    "📊 <b>Performance Hack:</b>\nUse <code>debounce</code> for search inputs to reduce API calls by up to 90%.",
    "🎯 <b>Code Quality:</b>\nWrite descriptive variable names. <code>const userData</code> is better than <code>const d</code>.",
    "🚀 <b>DevOps Tip:</b>\nUse containerization (Docker) to ensure your app runs the same everywhere.",
    "🔄 <b>Git Best Practice:</b>\nCommit early, commit often. Small, focused commits are easier to review and debug.",
    "💻 <b>Frontend Hack:</b>\nUse CSS Grid for layouts instead of flexbox when you need 2D alignment.",
    "🌐 <b>Web Tip:</b>\nMinify and compress your assets. Every KB counts for mobile users.",
    "🧪 <b>Testing Tip:</b>\nWrite unit tests for critical functions. It catches bugs 10x faster than manual testing!",
];

const techQuestions = [
    "❓ <b>Question of the Hour:</b>\nWhat's the difference between <code>==</code> and <code>===</code> in JavaScript?",
    "🤔 <b>Tech Question:</b>\nHow many HTTP status codes do you know? (Hint: There are 60+!)",
    "💭 <b>Discussion:</b>\nSQL or NoSQL? When should you use each?",
    "🧠 <b>Challenge:</b>\nCan you explain REST API principles in one sentence?",
    "🎓 <b>Learning Q:</b>\nWhat's the difference between synchronous and asynchronous programming?",
];

const motivationalMessages = [
    "🚀 Keep coding, keep growing!",
    "💪 Every bug fixed is a lesson learned!",
    "✨ Your code is getting better every day.",
    "🌟 Great developers never stop learning!",
    "💻 Code today, create tomorrow!",
];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = (bot, isAdmin, channelId) => {
    let autoPostingEnabled = true;
    let autoPostingInterval = null;
    const AUTO_POST_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

    // Post auto-content with beautiful templates
    const postAutoContent = async () => {
        try {
            const contentTypes = ['blog', 'tip', 'question', 'mixed'];
            const type = getRandomItem(contentTypes);

            let message = '';

            if (type === 'blog' && blogFetcher.getBlogs().length > 0) {
                // Post a blog from T20 Tech
                const blog = blogFetcher.getRandomBlog();
                message = createBlogPost(blog.title, blog.excerpt, blog.link);
            } else if (type === 'tip') {
                // Post a tech tip with watermark
                message = createTechTipPost(getRandomItem(techTips));
            } else if (type === 'question') {
                // Post a question with motivation
                message = createQuestionPost(
                    getRandomItem(techQuestions),
                    getRandomItem(motivationalMessages)
                );
            } else {
                // Post mixed content
                message = createMixedPost(
                    getRandomItem(techTips) + '\n\n' + getRandomItem(motivationalMessages),
                    'mixed'
                );
            }

            bot.sendMessage(channelId, message, { parse_mode: 'HTML' })
                .then(() => {
                    console.log(`✅ [${new Date().toLocaleString()}] Auto-post (${type}) sent successfully`);
                })
                .catch(err => {
                    console.error(`❌ [${new Date().toLocaleString()}] Auto-post failed:`, err.message);
                });
        } catch (error) {
            console.error(`❌ [${new Date().toLocaleString()}] Auto-post error:`, error.message);
        }
    };

    // Start auto-posting
    const startAutoPosting = () => {
        if (autoPostingInterval) return;

        console.log(`📅 Auto-posting enabled! Next post in 1 hour...`);
        autoPostingEnabled = true;

        postAutoContent();

        autoPostingInterval = setInterval(postAutoContent, AUTO_POST_INTERVAL_MS);
    };

    // Stop auto-posting
    const stopAutoPosting = () => {
        if (autoPostingInterval) {
            clearInterval(autoPostingInterval);
            autoPostingInterval = null;
        }
        autoPostingEnabled = false;
        console.log(`⏸️ Auto-posting disabled`);
    };

    // Start auto-posting on startup
    setTimeout(startAutoPosting, 2000);

    // === AUTO-POSTING CONTROL ===
    bot.onText(/\/autopost\s+(on|off|now|status)/, (msg, match) => {
        if (!isAdmin(msg.from.id)) {
            bot.sendMessage(msg.chat.id, styles.errorMsg('Admin command only.'), { parse_mode: 'HTML' });
            return;
        }

        const action = match[1].toLowerCase();

        if (action === 'on') {
            if (autoPostingEnabled) {
                bot.sendMessage(msg.chat.id, styles.infoMsg('Auto-posting is already running!'), { parse_mode: 'HTML' });
                return;
            }
            startAutoPosting();
            bot.sendMessage(msg.chat.id, styles.successMsg('Auto-posting enabled!\nThe bot will post tech tips and questions every 1 hour.'), { parse_mode: 'HTML' });

        } else if (action === 'off') {
            if (!autoPostingEnabled) {
                bot.sendMessage(msg.chat.id, styles.infoMsg('Auto-posting is already stopped!'), { parse_mode: 'HTML' });
                return;
            }
            stopAutoPosting();
            bot.sendMessage(msg.chat.id, styles.infoMsg('Auto-posting disabled.\nYou can turn it back on with /autopost on'), { parse_mode: 'HTML' });

        } else if (action === 'now') {
            postAutoContent();
            bot.sendMessage(msg.chat.id, styles.successMsg('Posted now to channel!'), { parse_mode: 'HTML' });

        } else if (action === 'status') {
            const status = autoPostingEnabled ? styles.status.running : styles.status.stopped;
            const nextPost = autoPostingEnabled ? 'Every 1 hour' : 'N/A';
            bot.sendMessage(msg.chat.id, `${styles.header('Auto-Posting Status', '📊')}\n${styles.listItem(status, '')}\nNext Post: <b>${nextPost}</b>\nChannel: <b>${channelId}</b>`, { parse_mode: 'HTML' });
        }
    });

    return { startAutoPosting, stopAutoPosting, postAutoContent };
};

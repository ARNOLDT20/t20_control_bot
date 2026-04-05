// Post Template Formatter with Beautiful Styling

const WATERMARK = '🔥 BLAZE TECH 🔥';
const SEPARATOR = '━'.repeat(40);

// Beautiful post templates

const createTechTipPost = (tip) => {
    return `${WATERMARK}
${SEPARATOR}

${tip}

${SEPARATOR}
💬 Share your thoughts in the comments!
🔗 Follow for more tech tips
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>⏰ Updated: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</i>
${WATERMARK}`;
};

const createQuestionPost = (question, motivation) => {
    return `${WATERMARK}
${SEPARATOR}

${question}

<b>━━ Daily Motivation ━━</b>
${motivation}

${SEPARATOR}
💡 Drop your answer below!
🚀 Let's learn together
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>⏰ Posted: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</i>
${WATERMARK}`;
};

const createBlogPost = (title, excerpt, url) => {
    const cleanTitle = title.replace(/<[^>]*>/g, '').substring(0, 50);
    const cleanExcerpt = excerpt.replace(/<[^>]*>/g, '').substring(0, 150);

    return `${WATERMARK}
${SEPARATOR}

📚 <b>New Blog Post</b>

<b>${cleanTitle}</b>

${cleanExcerpt}...

<a href="${url}">📖 Read Full Article →</a>

${SEPARATOR}
✨ Brought to you by T20 Tech
📢 Stay updated with our latest insights
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>⏰ Published: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</i>
${WATERMARK}`;
};

const createMixedPost = (content, postType = 'tip') => {
    return `${WATERMARK}
${SEPARATOR}

${content}

${SEPARATOR}
🎯 Keep learning, keep growing!
📲 Share this with your fellow developers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>⏰ ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</i>
${WATERMARK}`;
};

module.exports = {
    createTechTipPost,
    createQuestionPost,
    createBlogPost,
    createMixedPost,
    WATERMARK,
    SEPARATOR,
};

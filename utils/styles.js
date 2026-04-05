// Beautiful formatting and styling utilities

const styles = {
    // Section dividers
    divider: '━━━━━━━━━━━━━━━━━━━━━━',
    dividerLong: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',

    // Box styles
    box: (title, content) => {
        return `╭─ <b>${title}</b>\n${content}\n╰─────`;
    },

    // Header styles
    header: (title, emoji = '⚙️') => {
        return `${emoji} <b>${title}</b>`;
    },

    // List item
    listItem: (icon, text) => {
        return `${icon} ${text}`;
    },

    // Status badge
    status: {
        online: '🟢 Online',
        offline: '🔴 Offline',
        running: '🟢 Running',
        stopped: '🔴 Stopped',
        success: '✅ Success',
        error: '❌ Error',
        warning: '⚠️ Warning',
        info: 'ℹ️ Info',
    },

    // Code block
    code: (text) => `<code>${text}</code>`,
    codeBlock: (text) => `<pre><code>${text}</code></pre>`,

    // Text formatting
    bold: (text) => `<b>${text}</b>`,
    italic: (text) => `<i>${text}</i>`,
    underline: (text) => `<u>${text}</u>`,
    strikethrough: (text) => `<s>${text}</s>`,

    // Formatting helpers
    section: (emoji, title, items) => {
        let text = `\n${emoji} <b>${title}:</b>\n`;
        items.forEach(item => {
            text += `${item}\n`;
        });
        return text;
    },

    // Card style
    card: (emoji, title, description) => {
        return `${emoji} <b>${title}</b>\n${description}`;
    },

    // Success/Error messages
    successMsg: (message) => `✅ <b>Success!</b>\n${message}`,
    errorMsg: (message) => `❌ <b>Error!</b>\n${message}`,
    warningMsg: (message) => `⚠️ <b>Warning!</b>\n${message}`,
    infoMsg: (message) => `ℹ️ <b>Info:</b>\n${message}`,
};

module.exports = styles;

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

    // Premium menu styling
    menuHeader: (title) => {
        return `╔╭━━〔 ✦✦✦ ${title} ✦✦✦ 〕━━╮`;
    },

    menuInfo: (label, value) => {
        return `│ ✦ ${label} : ${value}`;
    },

    menuClosing: () => {
        return `╰─────────────────╯`;
    },

    menuDivider: () => {
        return `━━━━━━━━━━━━━━━━━━━━━━`;
    },

    menuCategory: (emoji, title) => {
        return `\n${emoji} ${title}`;
    },

    menuItem: (emoji, text) => {
        return `${emoji} ${text}`;
    },

    menuFooter: (credit) => {
        return `\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${credit}©`;
    },

    // Format uptime nicely
    formatUptime: (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) {
            return `${days}d ${hours % 24}h ${minutes % 60}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    },

    // Format time nicely
    formatTime: () => {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
    },

    // Format date nicely
    formatDate: () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { 
            month: '2-digit', 
            day: '2-digit', 
            year: 'numeric' 
        });
    },
};

module.exports = styles;

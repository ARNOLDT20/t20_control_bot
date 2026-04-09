// Settings Command Plugin
const styles = require('../utils/styles');
const { getGroupSettings, setGroupSetting } = require('../utils/sharedSettings');

module.exports = (bot) => {
    bot.onText(/\/settings/, (msg) => {
        const s = getGroupSettings(msg.chat.id);
        const settingsText = `${styles.header('Bot Settings', '⚙️')}
${styles.listItem('👋', `Welcome: ${s.welcome ? '✅ Enabled' : '❌ Disabled'}`)}
${styles.listItem('👋', `Goodbye: ${s.goodbye ? '✅ Enabled' : '❌ Disabled'}`)}
${styles.divider}
Use /welcome on/off and /goodbye on/off to toggle.`;

        bot.sendMessage(msg.chat.id, settingsText, { parse_mode: 'HTML' });
    });

    // Toggles
    bot.onText(/\/welcome\s+(on|off)/, (msg, match) => {
        const value = match[1] === 'on';
        setGroupSetting(msg.chat.id, 'welcome', value);
        bot.sendMessage(msg.chat.id, `✅ Welcome ${value ? 'enabled' : 'disabled'}`, { parse_mode: 'HTML' });
    });

    bot.onText(/\/goodbye\s+(on|off)/, (msg, match) => {
        const value = match[1] === 'on';
        setGroupSetting(msg.chat.id, 'goodbye', value);
        bot.sendMessage(msg.chat.id, `✅ Goodbye ${value ? 'enabled' : 'disabled'}`, { parse_mode: 'HTML' });
    });
};
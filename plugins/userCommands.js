// User Commands Plugin
const styles = require('../utils/styles');

module.exports = (bot) => {
    // === USER INFO ===
    bot.onText(/\/userinfo/, (msg) => {
        if (msg.reply_to_message) {
            const user = msg.reply_to_message.from;
            const info = `${styles.header('User Information', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(user.id)}`)}
${styles.listItem('📝', `First Name: ${user.first_name}`)}
${styles.listItem('📝', `Last Name: ${user.last_name || 'N/A'}`)}
${styles.listItem('👤', `Username: ${user.username ? '@' + user.username : 'None'}`)}
${styles.listItem('🤖', `Is Bot: ${user.is_bot ? 'Yes' : 'No'}`)}
${styles.listItem('🌐', `Language: ${user.language_code || 'N/A'}`)}`;

            bot.sendMessage(msg.chat.id, info, { parse_mode: 'HTML' });
        } else {
            bot.sendMessage(msg.chat.id, '📝 Reply to a message to get user info.', { parse_mode: 'HTML' });
        }
    });

    // === ECHO ===
    bot.onText(/\/echo(?:\s+(.+))?/, (msg, match) => {
        const text = match[1] || 'No text provided';
        const echo = `🔊 <b>Echo:</b> ${text}`;
        bot.sendMessage(msg.chat.id, echo, { parse_mode: 'HTML' });
    });

    // === HELP COMMAND ===
    bot.onText(/\/help/, (msg) => {
        const help = `${styles.header('Help & Support', '📚')}

Use <code>/start</code> to see all available commands and features.

${styles.divider}

<b>Command Categories:</b>
👤 <b>User Commands</b> - Info, stats, user data
🎮 <b>Fun Commands</b> - Games, jokes, utilities
🔧 <b>Admin Commands</b> - Kick, ban, mute, delete
⚠️ <b>Moderation</b> - Warnings, timeouts, softban
⚙️ <b>Settings</b> - Configure group behavior
📢 <b>Channel</b> - Post and broadcast
📅 <b>Auto-Posting</b> - Automatic content posting
👥 <b>Group Management</b> - Welcome/goodbye messages

${styles.divider}

<b>Need more help?</b> Type any command you need info about!`;

        bot.sendMessage(msg.chat.id, help, { parse_mode: 'HTML' });
    });

    // === COMMANDS COMMAND (Alternative to start) ===
    bot.onText(/\/commands/, (msg) => {
        const commands = `${styles.header('All Available Commands', '🤖')}

${styles.section('👤', 'User Info', [
            styles.listItem('🆔', '<code>/id</code> - Your ID & chat info'),
            styles.listItem('👨‍💼', '<code>/userinfo</code> - Info about user (reply)'),
            styles.listItem('📊', '<code>/stats</code> - Bot stats'),
            styles.listItem('👥', '<code>/groupinfo</code> - Group details'),
            styles.listItem('👨‍👩‍👦', '<code>/members</code> - Member count'),
            styles.listItem('💳', '<code>/profile</code> - Your profile'),
        ])}

${styles.section('🎮', 'Fun & Games', [
            styles.listItem('🎱', '<code>/8ball</code> - Magic 8 ball'),
            styles.listItem('🎲', '<code>/roll [xdy]</code> - Roll dice'),
            styles.listItem('🪙', '<code>/flip</code> - Flip coin'),
            styles.listItem('🎯', '<code>/choose</code> - Choose option'),
            styles.listItem('⭐', '<code>/rate [thing]</code> - Rate'),
            styles.listItem('😂', '<code>/joke</code> - Get joke'),
            styles.listItem('🔄', '<code>/reverse [text]</code> - Reverse'),
            styles.listItem('🔤', '<code>/upper|/lower</code> - Case'),
        ])}

${styles.section('🔧', 'Admin', [
            styles.listItem('🚫', '<code>/kick</code> - Kick user (reply)'),
            styles.listItem('⛔', '<code>/ban</code> - Ban user (reply)'),
            styles.listItem('✅', '<code>/unban [id]</code> - Unban'),
            styles.listItem('🔇', '<code>/mute</code> - Mute (reply)'),
            styles.listItem('🔊', '<code>/unmute</code> - Unmute (reply)'),
            styles.listItem('🗑️', '<code>/delete</code> - Delete (reply)'),
            styles.listItem('📌', '<code>/pin</code> - Pin (reply)'),
            styles.listItem('📌', '<code>/unpin</code> - Unpin (reply)'),
        ])}

${styles.section('⚠️', 'Moderation', [
            styles.listItem('⚠️', '<code>/warn</code> - Warn user (reply)'),
            styles.listItem('📊', '<code>/warnings</code> - Check warns (reply)'),
            styles.listItem('🧹', '<code>/clearwarn</code> - Clear warns (reply)'),
            styles.listItem('⏱️', '<code>/timeout [min]</code> - Timeout (reply)'),
            styles.listItem('🔄', '<code>/softban</code> - Softban (reply)'),
        ])}

${styles.section('⚙️', 'Settings', [
            styles.listItem('🎛️', '<code>/settings</code> - View settings'),
            styles.listItem('🌐', '<code>/setlang [lang]</code> - Set language'),
            styles.listItem('🛡️', '<code>/antispam on/off</code> - Anti-spam'),
            styles.listItem('👋', '<code>/togglewelcome</code> - Toggle welcome'),
            styles.listItem('📋', '<code>/setrules [text]</code> - Set rules'),
            styles.listItem('📋', '<code>/rules</code> - View rules'),
        ])}

${styles.section('📢', 'Channel', [
            styles.listItem('📝', '<code>/post [text]</code> - Post'),
            styles.listItem('🧪', '<code>/testchannel</code> - Test'),
            styles.listItem('📡', '<code>/broadcast [text]</code> - Broadcast'),
        ])}

${styles.section('📅', 'Auto-Posting', [
            styles.listItem('▶️', '<code>/autopost on</code> - Enable'),
            styles.listItem('⏹️', '<code>/autopost off</code> - Disable'),
            styles.listItem('⏰', '<code>/autopost now</code> - Post now'),
            styles.listItem('📊', '<code>/autopost status</code> - Status'),
        ])}

${styles.section('👥', 'Group Mgmt', [
            styles.listItem('👋', '<code>/welcome on/off</code> - Toggle'),
            styles.listItem('🌙', '<code>/goodbye on/off</code> - Toggle'),
            styles.listItem('🧪', '<code>/testwelcome</code> - Test'),
            styles.listItem('🧪', '<code>/testgoodbye</code> - Test'),
        ])}

${styles.divider}
Type <code>/menu</code> for quick access menu!`;

        bot.sendMessage(msg.chat.id, commands, { parse_mode: 'HTML' });
    });
};

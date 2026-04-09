// Welcome Commands Plugin
const styles = require('../utils/styles');

// Settings to control welcome/goodbye messages per chat
const settings = {};

module.exports = (bot, groups, botStartTime) => {
    // Helper function to get settings for a chat
    const getSettings = (chatId) => {
        if (!settings[chatId]) {
            settings[chatId] = { welcome: true, goodbye: true };
        }
        return settings[chatId];
    };

    bot.on('message', async (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            return;
        }

        if (!groups.includes(msg.chat.id)) {
            groups.push(msg.chat.id);
        }

        const chatSettings = getSettings(msg.chat.id);

        if (msg.new_chat_members && msg.new_chat_members.length && chatSettings.welcome) {
            const names = msg.new_chat_members.map(user => `${user.first_name || 'New member'}${user.last_name ? ' ' + user.last_name : ''}`);
            const joinedUsers = names.join(', ');
            const groupName = msg.chat.title || 'this community';
            const welcomeText = `
✨ <b>WELCOME TO ${groupName.toUpperCase()}</b> ✨

👋 <b>${joinedUsers}</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send welcome message:', err.message || err);
            }
        }

        if (msg.left_chat_member && chatSettings.goodbye) {
            const user = msg.left_chat_member;
            const groupName = msg.chat.title || 'this community';
            const goodbyeText = `
🌙 <b>FAREWELL, ${user.first_name || 'friend'}</b>.

Your journey through <b>${groupName}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;

            try {
                await bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
            } catch (err) {
                console.error('❌ Failed to send goodbye message:', err.message || err);
            }
        }
    });

    bot.onText(/\/ping/, (msg) => {
        const latencyMs = Date.now() - (msg.date * 1000);
        const reply = `🏓 <b>PONG!</b>\nLatency: <b>${latencyMs} ms</b>\nStatus: <b>Online</b>`;
        bot.sendMessage(msg.chat.id, reply, { parse_mode: 'HTML' });
    });

    bot.onText(/\/menu/, async (msg) => {
        try {
            // Get bot info
            const me = await bot.getMe();
            
            // Calculate uptime
            const uptime = Date.now() - botStartTime;
            const uptimeStr = styles.formatUptime(uptime);
            
            // Get current time and date
            const timeStr = styles.formatTime();
            const dateStr = styles.formatDate();
            
            // Build the styled menu
            const botName = `${me.first_name || 'T20'} ${me.last_name || ''}`.trim().toUpperCase();
            
            const menuText = `${styles.menuHeader(botName)}

${styles.menuInfo('Mᴏᴅᴇ', 'public')}
${styles.menuInfo('Pʀᴇғɪx', '/')}
${styles.menuInfo('Usᴇʀ', `@${me.id}`)}
${styles.menuInfo('Cᴏᴍᴍᴀɴᴅs', '500')}
${styles.menuInfo('Uᴘᴛɪᴍᴇ', uptimeStr)}
${styles.menuInfo('Tɪᴍᴇ', timeStr)}
${styles.menuInfo('Dᴀᴛᴇ', dateStr)}
${styles.menuInfo('Pʟᴀᴛғᴏʀᴍ', 'Linux')}
${styles.menuInfo('Rᴀᴍ', '93%')}
${styles.menuClosing()}

🎮 GROUP MANAGING BOT
${styles.menuDivider()}

📋 <b>Main Categories:</b>
${styles.menuItem('💰', 'Economy System')}
${styles.menuItem('🃏', 'Card Collection')}
${styles.menuItem('⚔️', 'PVP Combat')}

Type <code>/menu &lt;category&gt;</code> to view commands

${styles.menuFooter('ʜᴏʀʟᴀ-ᴘᴏᴏᴋɪᴇ')}`;

            const keyboard = [
                [
                    { text: 'Start', callback_data: '/start' },
                    { text: 'Menu', callback_data: '/menu' }
                ],
                [
                    { text: 'Help', callback_data: '/help' },
                    { text: 'Ping', callback_data: '/ping' }
                ],
                [
                    { text: 'My ID', callback_data: '/id' },
                    { text: 'Post', callback_data: '/post' }
                ],
                [
                    { text: 'Autopost', callback_data: '/autopost' },
                    { text: 'Admins', callback_data: '/admin list' }
                ],
                [
                    { text: 'Welcome status', callback_data: '/welcome status' },
                    { text: 'Goodbye status', callback_data: '/goodbye status' }
                ],
                [
                    { text: 'Test welcome', callback_data: '/testwelcome' },
                    { text: 'Test goodbye', callback_data: '/testgoodbye' }
                ]
            ];

            // Try to send photo with menu image, fallback to text if it fails
            try {
                await bot.sendPhoto(msg.chat.id, 'https://files.catbox.moe/eycaql.png', {
                    caption: menuText,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                });
            } catch (error) {
                console.error('Failed to send menu photo, using text fallback:', error.message);
                await bot.sendMessage(msg.chat.id, menuText, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboard
                    }
                });
            }
        } catch (error) {
            console.error('Error generating menu:', error);
            await bot.sendMessage(msg.chat.id, '❌ Failed to generate menu', { parse_mode: 'HTML' });
        }
    });

    // === TOGGLE WELCOME MESSAGES ===
    bot.onText(/\/welcome\s+(on|off)/, (msg, match) => {
        const action = match[1];
        const chatSettings = getSettings(msg.chat.id);
        chatSettings.welcome = action === 'on';
        const status = chatSettings.welcome ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `✅ Welcome messages have been <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === TOGGLE GOODBYE MESSAGES ===
    bot.onText(/\/goodbye\s+(on|off)/, (msg, match) => {
        const action = match[1];
        const chatSettings = getSettings(msg.chat.id);
        chatSettings.goodbye = action === 'on';
        const status = chatSettings.goodbye ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `✅ Goodbye messages have been <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === WELCOME STATUS ===
    bot.onText(/\/welcome\s+status/, (msg) => {
        const chatSettings = getSettings(msg.chat.id);
        const status = chatSettings.welcome ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `ℹ️ Welcome messages are currently <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === GOODBYE STATUS ===
    bot.onText(/\/goodbye\s+status/, (msg) => {
        const chatSettings = getSettings(msg.chat.id);
        const status = chatSettings.goodbye ? 'enabled' : 'disabled';
        bot.sendMessage(msg.chat.id, `ℹ️ Goodbye messages are currently <b>${status}</b>.`, { parse_mode: 'HTML' });
    });

    // === TEST WELCOME MESSAGE ===
    bot.onText(/\/testwelcome/, (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            bot.sendMessage(msg.chat.id, '❌ This command only works in groups.', { parse_mode: 'HTML' });
            return;
        }

        const groupName = msg.chat.title || 'this community';
        const welcomeText = `
✨ <b>WELCOME TO ${groupName.toUpperCase()}</b> ✨

👋 <b>Test User</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;

        bot.sendMessage(msg.chat.id, welcomeText, { parse_mode: 'HTML' });
    });

    // === TEST GOODBYE MESSAGE ===
    bot.onText(/\/testgoodbye/, (msg) => {
        if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup') {
            bot.sendMessage(msg.chat.id, '❌ This command only works in groups.', { parse_mode: 'HTML' });
            return;
        }

        const groupName = msg.chat.title || 'this community';
        const goodbyeText = `
🌙 <b>FAREWELL, Test User</b>.

Your journey through <b>${groupName}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;

        bot.sendMessage(msg.chat.id, goodbyeText, { parse_mode: 'HTML' });
    });

    // Handle callback queries from inline keyboard buttons
    bot.on('callback_query', async (query) => {
        const command = query.data;
        const chatId = query.message.chat.id;
        const chatSettings = getSettings(chatId);

        try {
            switch (command) {
                case '/start':
                    // Trigger start command - this might need to be handled differently
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/start'
                    });
                    break;

                case '/menu':
                    // Re-trigger menu
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/menu'
                    });
                    break;

                case '/ping':
                    const latencyMs = Date.now() - (query.message.date * 1000);
                    const reply = `🏓 <b>PONG!</b>\nLatency: <b>${latencyMs} ms</b>\nStatus: <b>Online</b>`;
                    await bot.sendMessage(chatId, reply, { parse_mode: 'HTML' });
                    break;

                case '/help':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/help'
                    });
                    break;

                case '/id':
                    const idInfo = `${styles.header('User & Chat Info', '👤')}
${styles.listItem('🆔', `ID: ${styles.code(query.from.id)}`)}
${styles.listItem('📝', `Name: ${query.from.first_name}${query.from.last_name ? ' ' + query.from.last_name : ''}`)}
${styles.listItem('👤', `Username: ${query.from.username ? '@' + query.from.username : 'None'}`)}

${styles.header('Chat Details', '💬')}
${styles.listItem('🔖', `Chat ID: ${styles.code(chatId)}`)}
${styles.listItem('📌', `Type: ${query.message.chat.type}`)}`;
                    await bot.sendMessage(chatId, idInfo, { parse_mode: 'HTML' });
                    break;

                case '/post':
                    await bot.sendMessage(chatId, '📝 To post to channel, use: <code>/post [your message]</code>', { parse_mode: 'HTML' });
                    break;

                case '/autopost':
                    await bot.sendMessage(chatId, '📅 Auto-posting commands:\n• <code>/autopost on</code> - Enable\n• <code>/autopost off</code> - Disable\n• <code>/autopost now</code> - Post immediately\n• <code>/autopost status</code> - Check status', { parse_mode: 'HTML' });
                    break;

                case '/admin list':
                    bot.emit('message', {
                        message_id: query.message.message_id,
                        from: query.from,
                        chat: query.message.chat,
                        date: query.message.date,
                        text: '/admin list'
                    });
                    break;

                case '/welcome status':
                    const welcomeStatus = chatSettings.welcome ? 'enabled' : 'disabled';
                    await bot.sendMessage(chatId, `ℹ️ Welcome messages are currently <b>${welcomeStatus}</b>.`, { parse_mode: 'HTML' });
                    break;

                case '/goodbye status':
                    const goodbyeStatus = chatSettings.goodbye ? 'enabled' : 'disabled';
                    await bot.sendMessage(chatId, `ℹ️ Goodbye messages are currently <b>${goodbyeStatus}</b>.`, { parse_mode: 'HTML' });
                    break;

                case '/testwelcome':
                    if (query.message.chat.type !== 'group' && query.message.chat.type !== 'supergroup') {
                        await bot.sendMessage(chatId, '❌ This command only works in groups.', { parse_mode: 'HTML' });
                        break;
                    }
                    const testGroupName = query.message.chat.title || 'this community';
                    const testWelcomeText = `
✨ <b>WELCOME TO ${testGroupName.toUpperCase()}</b> ✨

👋 <b>Test User</b> just arrived and the squad is stronger already.

🔥 <b>Mission:</b> Learn fast, stay safe, and build powerful Telegram workflows.
💎 <b>Next step:</b> introduce yourself, check pinned rules, and say hi to the team.

${styles.dividerLong}
🚀 <i>Type /menu to explore commands, or /help to get started.</i>
`;
                    await bot.sendMessage(chatId, testWelcomeText, { parse_mode: 'HTML' });
                    break;

                case '/testgoodbye':
                    if (query.message.chat.type !== 'group' && query.message.chat.type !== 'supergroup') {
                        await bot.sendMessage(chatId, '❌ This command only works in groups.', { parse_mode: 'HTML' });
                        break;
                    }
                    const testGroupName2 = query.message.chat.title || 'this community';
                    const testGoodbyeText = `
🌙 <b>FAREWELL, Test User</b>.

Your journey through <b>${testGroupName2}</b> continues beyond this chat.

💬 We'll miss your presence and hope to see you again soon.

${styles.dividerLong}
✨ <i>If you want back in, ask an admin for a fresh invite.</i>
`;
                    await bot.sendMessage(chatId, testGoodbyeText, { parse_mode: 'HTML' });
                    break;
            }

            bot.answerCallbackQuery(query.id);
        } catch (error) {
            console.error('Error handling callback query:', error);
            bot.answerCallbackQuery(query.id, { text: 'An error occurred', show_alert: true });
        }
    });
};

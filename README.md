# T20 Control Bot - Plugin Architecture

## 🎯 Project Structure

```
t20_control_bot/
├── bot.js                    # Main bot entry point
├── package.json              # Dependencies
├── plugins/                  # Plugin modules
│   ├── index.js             # Plugin loader
│   ├── userCommands.js      # User-facing commands
│   ├── adminCommands.js     # Admin moderation commands
│   ├── channelCommands.js   # Channel posting commands
│   ├── autoPostingCommands.js  # Auto-posting scheduler
│   └── adminManagement.js   # Admin management
├── utils/                    # Utility modules
│   └── styles.js            # Beautiful text formatting
└── bot_old.js               # Backup of previous version
```

## 🚀 Features

### User Commands
- `/id` - Display user & chat information
- `/userinfo` - Get detailed user info (reply to message)
- `/stats` - Show bot statistics
- `/echo [text]` - Echo text back
- `/help` - Display help message
- `/start` - Beautiful welcome screen

### Admin Commands (with permission checks)
- `/kick` - Remove user from group (reply to message)
- `/ban` - Ban user from group (reply to message)
- `/unban [user_id]` - Unban user
- `/mute` - Silence user (reply to message)
- `/unmute` - Allow user to message (reply to message)
- `/delete` - Delete message (reply to message)
- `/pin` - Pin message (reply to message)

### Channel Management
- `/post [text]` - Post to channel with beautiful formatting
- `/testchannel` - Test channel connection
- `/setchannel [id]` - Change posting channel
- `/broadcast [text]` - Send message to all groups

### Group Management
- `/welcome on/off` - Enable/disable welcome messages for new members
- `/welcome status` - Check welcome message status
- `/goodbye on/off` - Enable/disable goodbye messages for leaving members
- `/goodbye status` - Check goodbye message status

### Auto-Posting System
- `/autopost on` - Enable hourly posts
- `/autopost off` - Disable auto-posting
- `/autopost now` - Post immediately
- `/autopost status` - Check posting status

Posts include:
- 💡 Tech tips and best practices
- ❓ Thought-provoking questions
- ✨ Motivational messages

### System Management
- `/admin list` - Show configured admins

## 🎨 Beautiful Styling

The bot uses rich formatting with:
- **Styled headers** with emojis
- **Organized sections** with dividers
- **Color-coded messages** (success/error/warning/info)
- **Code blocks** for technical information
- **Status indicators** (online, offline, running, stopped)

## 🔧 Plugin System

Each plugin is a separate module that:
1. Exports a function that receives the bot instance
2. Registers its own commands
3. Has access to utility styles
4. Can be easily modified or disabled

### Adding a New Plugin

Create `plugins/myPlugin.js`:
```javascript
const styles = require('../utils/styles');

module.exports = (bot, isAdmin, channelId) => {
    bot.onText(/\/mycommand/, (msg) => {
        bot.sendMessage(msg.chat.id, 
            styles.successMsg('Hello from my plugin!'), 
            { parse_mode: 'HTML' }
        );
    });
};
```

Then add to `plugins/index.js`:
```javascript
const myPlugin = require('./myPlugin');
myPlugin(bot, isAdmin, channelId);
```

## 📦 Loading Plugins

All plugins are loaded from `plugins/index.js` when the bot starts:

```
✅ User commands loaded
✅ Admin commands loaded
✅ Channel commands loaded
✅ Auto-posting commands loaded
✅ Admin management loaded
✨ All plugins loaded successfully!
```

## 🔐 Configuration

Set environment variables:

```powershell
# Required
setx TELEGRAM_TOKEN "your_bot_token_here"

# Optional
setx CHANNEL_ID "@your_channel"
setx ADMIN_IDS "123456789,987654321"  # Comma-separated
setx SOCKS_PROXY "socks5://127.0.0.1:1080"  # For proxy
```

## ✨ Beautiful Start Command

When users run `/start`, they see a beautifully formatted menu with:
- All available commands organized by category
- Descriptions for each command
- Bot status and configuration
- Visual separators and emojis

## 📊 Auto-Posting Content

The bot automatically posts varied content every hour:
- 33% Tech Tips
- 33% Tech Questions + Motivation
- 33% Tech Tips + Motivation

Never repeats the same post twice in a row.

## 🚀 Running the Bot

### Development
```powershell
$env:TELEGRAM_TOKEN="your_token"
npm start
```

### Production
```powershell
# Set permanent environment variables
setx TELEGRAM_TOKEN "your_token"
setx CHANNEL_ID "@your_channel"

# Run
npm start
```

## � Deployment Shortcuts

### Heroku (Recommended)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ARNOLDT20/t20_control_bot)

1. **Click the "Deploy to Heroku" button above**
2. **Connect your GitHub account** and select this repository
3. **Set Environment Variables** in Heroku dashboard:
   - `TELEGRAM_TOKEN` = your_bot_token
   - `CHANNEL_ID` = @your_channel
   - `ADMIN_IDS` = 123456789,987654321 (optional)
4. **Deploy** and your bot will be live!

**Or deploy manually:**

```bash
heroku create your-app-name
heroku config:set TELEGRAM_TOKEN="your_bot_token"
heroku config:set CHANNEL_ID="@your_channel"
git push heroku main
```

### Replit

1. **Fork this Replit**
   - Go to [replit.com](https://replit.com)
   - Import from GitHub: `ARNOLDT20/t20_control_bot`

2. **Set Secrets**
   - Go to Tools → Secrets
   - Add:
     - `TELEGRAM_TOKEN` = your_bot_token
     - `CHANNEL_ID` = @your_channel
     - `ADMIN_IDS` = 123456789,987654321 (optional)

3. **Run**
   - Click the green "Run" button
   - Or use: `npm start`

### Railway

1. **Connect Repository**
   ```bash
   # Deploy from GitHub
   railway login
   railway link
   railway up
   ```

2. **Set Variables**
   ```bash
   railway variables set TELEGRAM_TOKEN=your_token
   railway variables set CHANNEL_ID=@your_channel
   ```

### Render

1. **Connect GitHub**
   - Connect your GitHub repo: `ARNOLDT20/t20_control_bot`
   - Set build command: `npm install`
   - Set start command: `npm start`

2. **Environment Variables**
   - `TELEGRAM_TOKEN` = your_bot_token
   - `CHANNEL_ID` = @your_channel

### Local Server (VPS/Dedicated)

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/ARNOLDT20/t20_control_bot.git
cd t20_control_bot
npm install

# Create .env file
echo "TELEGRAM_TOKEN=your_token" > .env
echo "CHANNEL_ID=@your_channel" >> .env

# Run with PM2
npm install -g pm2
pm2 start npm --name "t20-bot" -- start
pm2 save
pm2 startup
```

### Docker (Advanced)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

```bash
docker build -t t20-bot .
docker run -e TELEGRAM_TOKEN=your_token -e CHANNEL_ID=@your_channel t20-bot
```

## �📝 Logs

The console shows:
```
══════════════════════════════════════════════════
🚀 T20 CONTROL BOT ONLINE
══════════════════════════════════════════════════
Bot Name: @t20_control_bot
Bot ID: 8490061324
Status: 🟢 Connected
Channel: @t20classictech
Admin Mode: Disabled
══════════════════════════════════════════════════

📦 Loading plugins...
✅ User commands loaded
✅ Admin commands loaded
✅ Channel commands loaded
✅ Auto-posting commands loaded
✅ Admin management loaded
✨ All plugins loaded successfully!
📅 Auto-posting enabled! Next post in 1 hour...
```

## 🔄 Future Enhancements

The modular structure makes it easy to add:
- Database integration
- More auto-posting content types
- Custom reaction handlers
- Message scheduling
- Analytics and statistics
- User permission levels
- Configuration management UI

## 📄 File Sizes

- `bot.js` - ~3.5 KB (clean and minimal)
- `plugins/userCommands.js` - ~2 KB
- `plugins/adminCommands.js` - ~4 KB
- `plugins/channelCommands.js` - ~4 KB
- `plugins/autoPostingCommands.js` - ~5 KB
- `utils/styles.js` - ~2 KB

**Total: Clean, maintainable, and scalable!**

---

**Version:** 3.0  
**Status:** 🟢 Production Ready  
**Architecture:** Modular Plugin-Based  
**Last Updated:** April 4, 2026

#!/usr/bin/env bash
# Quick Reference Guide for T20 Control Bot

## 🚀 Getting Started

### First Time Setup
1. Add bot to your Telegram group
2. Make bot an admin
3. Type `/start` to see all commands
4. Type `/menu` for quick-access menu

### Most Used Commands
```
/start    - See all commands
/menu     - Quick-access menu
/help     - Get help
/ping     - Check bot status
/id       - Get user/chat ID
```

---

## 👥 For Group Members

### User Information
- `/id` - Get your and chat IDs
- `/userinfo` - Get info about another user (reply)
- `/stats` - View bot statistics
- `/groupinfo` - Group information
- `/members` - Member count
- `/profile` - Your profile info

### Fun & Games
- `/joke` - Get random joke
- `/8ball [question]` - Ask magic 8 ball
- `/roll [XdY]` - Roll dice (e.g., /roll 2d6)
- `/flip` - Flip a coin
- `/choose option1 | option2` - Bot chooses
- `/rate [thing]` - Rate something (0-10 stars)
- `/reverse [text]` - Reverse text
- `/upper [text]` - Convert to uppercase
- `/lower [text]` - Convert to lowercase

### Information
- `/rules` - View group rules
- `/ping` - Check bot latency
- `/echo [text]` - Echo your text

---

## 👮 For Admin/Moderators

### User Management (Reply to message)
- `/kick` - Remove user (temporary)
- `/ban` - Ban user (permanent)
- `/mute` - Mute user
- `/unmute` - Unmute user
- `/warn` - Issue warning (3 = auto-kick)
- `/warnings` - Check user warnings
- `/clearwarn` - Clear warnings
- `/timeout [minutes]` - Mute for duration
- `/softban` - Kick without permanent ban

### Message Management (Reply to message)
- `/delete` - Delete message
- `/pin` - Pin message
- `/unpin` - Unpin message

### Group Settings
- `/settings` - View all settings
- `/setlang [lang]` - Set language
- `/antispam on/off` - Toggle anti-spam
- `/togglewelcome` - Toggle welcome messages
- `/setrules [text]` - Set group rules
- `/setdesc [text]` - Set group description

### Unban User
- `/unban [user_id]` - Unban specific user

---

## 📢 For Broadcasters

### Channel/Broadcasting
- `/post [message]` - Post to channel
- `/broadcast [message]` - Send to all groups
- `/testchannel` - Test channel connection

### Auto-Posting
- `/autopost on` - Enable auto-posting
- `/autopost off` - Disable auto-posting
- `/autopost now` - Post immediately
- `/autopost status` - Check auto-post status

---

## 🎯 Command Quick Reference

### By Frequency of Use
```
Tier 1 (Daily)
├── /menu - Quick menu
├── /ping - Check status
├── /joke - Have fun
└── /id - Info

Tier 2 (Regular)
├── /kick - Moderation
├── /warn - Warnings
├── /8ball - Fun
└── /roll - Games

Tier 3 (Occasional)
├── /settings - Config
├── /post - Broadcasting
└── /timeout - Advanced mod
```

### By Admin Level
```
Basic Admin
├── /kick, /ban, /unban
├── /mute, /unmute
├── /delete, /pin, /unpin
└── /warn

Advanced Admin
├── /timeout, /softban
├── /settings, /setdesc, /setrules
├── /antispam, /togglewelcome
└── /post, /broadcast
```

---

## 📊 Bot Info

### Current Features
- ✅ 50+ commands
- ✅ User management
- ✅ Warning system (auto-kick at 3 warnings)
- ✅ Auto-moderation tools
- ✅ Group customization
- ✅ Channel posting
- ✅ Fun commands
- ✅ Real-time uptime tracking

### Status Display
Type `/ping` to see:
- 🏓 Bot latency (response time)
- 🟢 Online status
- ⚡ Connection quality

---

## 🔴 Common Issues & Solutions

### "Admin command only"
- Make sure you have admin permission in the group
- Bot must be admin to execute commands

### "Reply to a message to use this command"
- Some commands require you to reply to a message
- Example: `/kick` → reply to message → send `/kick`

### "This command only works in groups"
- Some commands like `/testwelcome` need a real group
- Cannot be used in private chat

### Command not responding
- Try `/ping` to check bot status
- Wait a few seconds and retry
- Make sure you're using correct format

---

## 💡 Pro Tips

1. **Quick Access:** Use `/menu` button instead of typing commands
2. **Help:** Type `/help` to see command categories
3. **Full List:** Type `/commands` for detailed command list
4. **Warning System:** 3 warnings = automatic kick
5. **Timeout:** Use `/timeout` instead of `/mute` for timed mutes
6. **Rules:** Set group rules with `/setrules` for new members
7. **Fun Time:** Use `/8ball` or `/joke` to liven up the group
8. **Check Status:** Type `/groupinfo` to see group details

---

## ⚡ Keyboard Shortcuts (From `/menu`)

Button | Action
-------|-------
🏠 Start | Full command list
📚 Help | Help & support
👤 User Info | Get your ID
🏓 Ping | Check latency
🎮 Fun | Tell a joke
⚙️ Settings | View settings
👥 Group Info | Group details
📊 Members | Member count
🔧 Admin | Admin options
🗂️ Rules | View rules

---

## 📞 Getting Help

### In the Bot
- `/help` - General help
- `/start` - Full command list
- `/commands` - Detailed list
- `/menu` - Quick access menu

### For Admins
- Check `/settings` for group configuration options
- Use `/admin list` to see admin list
- Review rules with `/rules`

---

## 👔 Bot Administration

### Bot Details
- **Name:** T20 Control Bot
- **Version:** 3.0
- **Type:** Group Management System
- **Features:** 50+ commands
- **Update:** Type `/menu` to see real-time uptime

### Admin Permissions Needed
- Delete messages
- Kick users
- Ban users
- Restrict users
- Manage group settings

---

## 🎮 Fun Commands Examples

```
/8ball    → Ask: "Will it rain?"
/roll 2d6 → Roll 2 six-sided dice
/flip     → Get heads or tails
/choose Pizza | Burgers | Tacos → Bot chooses
/rate my code → Get 0-10 star rating
/joke     → Get random joke
/reverse hello → Get: olleH
```

---

## ⚠️ Warning System Details

### How it Works
1. Admin issues warning with `/warn`
2. User gets warning count: 1/3, 2/3, 3/3
3. At 3/3 warnings → Automatic kick
4. Use `/clearwarn` to reset count

### Check Warnings
- `/warnings` reply to user message to check count

### Clear Warnings
- `/clearwarn` reply to user message to reset

---

## 🔒 Security Notes

### Protection
- Only admins can use admin commands
- Users cannot modify settings
- Auto-protection against spam (when enabled)
- Warnings prevent repetitive violations

### Admin Responsibilities
- Use `/kick` for temporary removal
- Use `/ban` for permanent bans
- Use `/warn` for behavior correction
- Use `/timeout` for timed mutes

---

## 📱 Mobile Tips

- Tap bot username to see command suggestions
- Use `/menu` buttons for easier access
- Long press message, then select command
- Use reply feature for user-specific commands

---

## 🌐 Bot Branding

**Powered by:** horla-pookie©

This branding appears in:
- `/menu` command footer
- Bot messages and responses

---

## 📈 Command Statistics

| Category | Count | Examples |
|---------|-------|----------|
| User | 8 | id, userinfo, stats |
| Fun | 9 | joke, roll, flip |
| Admin | 8 | kick, ban, mute |
| Moderation | 5 | warn, timeout |
| Settings | 6 | settings, setrules |
| Channel | 3 | post, broadcast |
| Auto-Post | 4 | autopost on/off |
| Group | 4 | welcome, goodbye |
| System | 3 | start, help, menu |

**Total: 50+ Commands**

---

## 🚀 Quick Command Cheat Sheet

```
# User Commands
/id /userinfo /stats /groupinfo /members /profile

# Fun Commands  
/joke /8ball /roll /flip /choose /rate /reverse /upper /lower

# Moderation (Reply to message)
/kick /ban /mute /unmute /warn /warnings /clearwarn /timeout /softban

# Management
/delete /pin /unpin /setdesc

# Settings
/settings /setlang /antispam /togglewelcome /setrules /rules

# Broadcasting
/post /broadcast /testchannel

# Auto-Post
/autopost on|off|now|status

# Group
/welcome on/off /goodbye on/off /testwelcome /testgoodbye

# Help & Info
/start /menu /help /commands /ping /admin list
```

---

## 📖 Full Documentation

For detailed documentation of each command with examples and options, see:
- `COMMANDS.md` - Complete command reference
- `ENHANCEMENTS.md` - Feature additions overview

---

## 🎉 Enjoy Your Bot!

Your T20 Control Bot is now fully configured with 50+ commands!
- Use `/start` to explore
- Use `/menu` for quick access
- Have fun with `/joke` and `/8ball`
- Keep group safe with moderation tools

**Happy moderating!** 🚀

---

*Last Updated: 2026*
*Version: 3.0*
*Creator: T20*

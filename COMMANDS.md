># T20 Control Bot - Complete Command Documentation

## Overview
T20 Control Bot v3.0 is a comprehensive Telegram group management system with 50+ commands organized into 9 categories. Each command is beautifully formatted with emojis and structured help text.

---

## 👤 User Commands

All users can use these commands to get information and interact with the bot.

### `/id` - Get Your ID
Shows your Telegram user ID and the current chat/group ID.
- **Usage:** `/id`
- **Emoji:** 🆔
- **Example Output:** Shows user ID, name, username, chat ID, and chat type

### `/userinfo` - Get User Information
Get detailed information about another user.
- **Usage:** Reply to a message with `/userinfo`
- **Emoji:** 👨‍💼
- **Shows:** ID, first name, last name, username, bot status, language code

### `/stats` - Bot Statistics
View current bot statistics including groups tracked, admin count, and status.
- **Usage:** `/stats`
- **Emoji:** 📊
- **Shows:** Groups, admins, channel, and online status

### `/echo [text]` - Echo Text
Repeat whatever you type back to you.
- **Usage:** `/echo Hello World`
- **Emoji:** 🔊
- **Format:** Shows quoted echo

### `/ping` - Check Bot Latency
Check the bot's response time and connection status.
- **Usage:** `/ping`
- **Emoji:** 🏓
- **Shows:** Latency in milliseconds and status

### `/groupinfo` - Group Information
Get detailed information about the current group.
- **Usage:** `/groupinfo`
- **Emoji:** 👥
- **Shows:** Group name, ID, type, and description

### `/members` - Member Count
Get the total number of members in the current group.
- **Usage:** `/members`
- **Emoji:** 👨‍👩‍👦
- **Shows:** Exact member count

### `/profile` - Your Profile
View your profile information in the current group.
- **Usage:** `/profile`
- **Emoji:** 💳
- **Shows:** Name, ID, status, and join date

### `/commands` - All Commands
Get a complete list of all available commands with descriptions (alternative to `/start`).
- **Usage:** `/commands`
- **Emoji:** 🤖
- **Shows:** Fully formatted command list

---

## 🎮 Fun Commands

Fun and entertainment commands for group members to enjoy.

### `/8ball [question?]` - Magic 8 Ball
Ask the magic 8 ball a yes/no question.
- **Usage:** `/8ball Will I win?`
- **Emoji:** 🎱
- **Answers:** 12 random answers (Yes, No, Maybe, etc.)

### `/roll [XdY]` - Roll Dice
Roll dice with custom notation (e.g., 2d6 = roll 2 six-sided dice).
- **Usage:** `/roll` (defaults to 1d6) or `/roll 2d20` (roll 2 twenty-sided dice)
- **Emoji:** 🎲
- **Shows:** Individual roll results and total

### `/flip` - Flip Coin
Flip a coin for heads or tails.
- **Usage:** `/flip`
- **Emoji:** 🪙
- **Shows:** Heads or Tails result

### `/choose option1 | option2 | option3` - Choose
The bot picks one option for you.
- **Usage:** `/choose Pizza | Burgers | Tacos`
- **Emoji:** 🎯
- **Requires:** At least 2 options separated by |

### `/rate [thing]` - Rate Something
Get a random star rating (0-10) for anything.
- **Usage:** `/rate my code`
- **Emoji:** ⭐
- **Shows:** Rating and feedback

### `/joke` - Get Random Joke
Get a funny joke to laugh at.
- **Usage:** `/joke`
- **Emoji:** 😂
- **Includes:** Setup and punchline

### `/reverse [text]` - Reverse Text
Reverse any text you provide.
- **Usage:** `/reverse Hello World`
- **Emoji:** 🔄
- **Shows:** Original and reversed text

### `/upper [text]` - Convert to Uppercase
Convert text to all uppercase letters.
- **Usage:** `/upper hello`
- **Emoji:** 🔤
- **Output:** HELLO

### `/lower [text]` - Convert to Lowercase
Convert text to all lowercase letters.
- **Usage:** `/lower HELLO`
- **Emoji:** 🔤
- **Output:** hello

---

## 🔧 Admin Commands

Admin-only commands for group moderation and management.

### `/kick` - Kick User
Remove a user from the group temporarily.
- **Usage:** Reply to a message with `/kick`
- **Emoji:** 🚫
- **Effect:** User is kicked but can rejoin
- **Requires:** Admin permissions

### `/ban` - Ban User
Permanently ban a user from the group.
- **Usage:** Reply to a message with `/ban`
- **Emoji:** ⛔
- **Effect:** User cannot rejoin
- **Requires:** Admin permissions

### `/unban [user_id]` - Unban User
Unban a previously banned user.
- **Usage:** `/unban 123456789`
- **Emoji:** ✅
- **Requires:** Admin permissions

### `/mute` - Mute User
Prevent a user from sending messages.
- **Usage:** Reply to a message with `/mute`
- **Emoji:** 🔇
- **Effect:** User can view but not send messages
- **Requires:** Admin permissions

### `/unmute` - Unmute User
Allow a muted user to send messages again.
- **Usage:** Reply to a message with `/unmute`
- **Emoji:** 🔊
- **Requires:** Admin permissions

### `/delete` - Delete Message
Delete a message from the chat.
- **Usage:** Reply to a message with `/delete`
- **Emoji:** 🗑️
- **Effect:** Message is permanently removed
- **Requires:** Admin permissions

### `/pin` - Pin Message
Pin a message to the top of the group.
- **Usage:** Reply to a message with `/pin`
- **Emoji:** 📌
- **Effect:** Message stays visible at the top
- **Requires:** Admin permissions

### `/unpin` - Unpin Message
Unpin a previously pinned message.
- **Usage:** Reply to a message with `/unpin`
- **Emoji:** 📌
- **Requires:** Admin permissions

---

## ⚠️ Moderation Commands

Advanced moderation tools for managing group behavior.

### `/warn` - Warn User
Issue a warning to a user (3 warnings = automatic kick).
- **Usage:** Reply to a message with `/warn`
- **Emoji:** ⚠️
- **Tracking:** Automatic warning counter per user
- **Effect:** 3 warnings = automatic kick
- **Requires:** Admin permissions

### `/warnings` - Check Warnings
Check how many warnings a user has.
- **Usage:** Reply to a message with `/warnings`
- **Emoji:** 📊
- **Shows:** Current warning count (0-3)
- **Requires:** Admin permissions

### `/clearwarn` - Clear Warnings
Reset a user's warning count.
- **Usage:** Reply to a message with `/clearwarn`
- **Emoji:** 🧹
- **Effect:** Warnings reset to 0
- **Requires:** Admin permissions

### `/timeout [minutes]` - Timeout User
Mute a user for a specific duration.
- **Usage:** Reply to a message with `/timeout 30` (mutes for 30 minutes)
- **Emoji:** ⏱️
- **Duration:** Automatic unmute after time expires
- **Requires:** Admin permissions

### `/softban` - Softban User
Kick a user without permanent ban (they can rejoin with new invite).
- **Usage:** Reply to a message with `/softban`
- **Emoji:** 🔄
- **Effect:** User is kicked, can rejoin later
- **Requires:** Admin permissions

### `/setdesc [description]` - Set Group Description
Set or update the group description.
- **Usage:** `/setdesc Welcome to our amazing group!`
- **Emoji:** 📝
- **Effect:** Updates group description visible to all
- **Requires:** Admin permissions

---

## ⚙️ Settings Commands

Configure bot behavior and group settings.

### `/settings` - View Settings
View current group settings and configuration.
- **Usage:** `/settings`
- **Emoji:** 🎛️
- **Shows:** Prefix, language, anti-spam, welcome messages status
- **Requires:** Admin permissions

### `/setlang [language]` - Set Language
Change the bot's language for this group.
- **Usage:** `/setlang en` or `/setlang es`
- **Emoji:** 🌐
- **Note:** Currently supports English
- **Requires:** Admin permissions

### `/antispam on|off` - Toggle Anti-Spam
Enable or disable anti-spam protection for the group.
- **Usage:** `/antispam on` or `/antispam off`
- **Emoji:** 🛡️
- **Effect:** Prevents spam messages in the group
- **Requires:** Admin permissions

### `/togglewelcome` - Toggle Welcome Messages
Enable/disable automatic welcome messages for new members.
- **Usage:** `/togglewelcome`
- **Emoji:** 👋
- **Effect:** Toggles welcome message setting
- **Requires:** Admin permissions

### `/setrules [text]` - Set Group Rules
Set the official rules for the group.
- **Usage:** `/setrules Be respectful | No spam | Follow guidelines`
- **Emoji:** 📋
- **Effect:** Rules displayed when members use `/rules`
- **Requires:** Admin permissions

### `/rules` - View Group Rules
Display the group rules (if set by admin).
- **Usage:** `/rules`
- **Emoji:** 📋
- **Shows:** Group rules or "No rules set" message

---

## 📢 Channel Commands

Commands for posting to channels and broadcasting messages.

### `/post [message]` - Post to Channel
Send a message to the configured channel.
- **Usage:** `/post Hello everyone!`
- **Emoji:** 📝
- **Destination:** Configured channel ID
- **Requires:** Admin permissions

### `/testchannel` - Test Channel Connection
Test if the bot can connect to the configured channel.
- **Usage:** `/testchannel`
- **Emoji:** 🧪
- **Shows:** Connection status and channel info
- **Requires:** Admin permissions

### `/broadcast [message]` - Broadcast to Groups
Send a message to all tracked groups.
- **Usage:** `/broadcast Important announcement!`
- **Emoji:** 📡
- **Effect:** Message sent to all groups the bot is in
- **Requires:** Admin permissions

---

## 📅 Auto-Posting Commands

Manage automatic content posting schedules.

### `/autopost on` - Enable Auto-Posting
Enable automatic posting feature.
- **Usage:** `/autopost on`
- **Emoji:** ▶️
- **Effect:** Bot will automatically post scheduled content
- **Requires:** Admin permissions

### `/autopost off` - Disable Auto-Posting
Disable automatic posting.
- **Usage:** `/autopost off`
- **Emoji:** ⏹️
- **Effect:** Bot stops automatic posting
- **Requires:** Admin permissions

### `/autopost now` - Post Immediately
Trigger a scheduled post immediately.
- **Usage:** `/autopost now`
- **Emoji:** ⏰
- **Effect:** Sends the next scheduled content immediately
- **Requires:** Admin permissions

### `/autopost status` - Check Status
Check if auto-posting is enabled or disabled.
- **Usage:** `/autopost status`
- **Emoji:** 📊
- **Shows:** Current auto-posting status

---

## 👥 Group Management Commands

Manage group welcome/goodbye messages and member interactions.

### `/welcome on|off` - Toggle Welcome
Enable or disable welcome messages for new members.
- **Usage:** `/welcome on` or `/welcome off`
- **Emoji:** 👋
- **Customizable:** Messages can be edited in code
- **Requires:** Admin permissions

### `/goodbye on|off` - Toggle Goodbye
Enable or disable goodbye messages when members leave.
- **Usage:** `/goodbye on` or `/goodbye off`
- **Emoji:** 🌙
- **Customizable:** Messages can be edited in code
- **Requires:** Admin permissions

### `/testwelcome` - Test Welcome Message
Preview the welcome message that would be sent.
- **Usage:** `/testwelcome`
- **Emoji:** 🧪
- **Shows:** Welcome message with demo content
- **Group Only:** Only works in group chats

### `/testgoodbye` - Test Goodbye Message
Preview the goodbye message that would be sent.
- **Usage:** `/testgoodbye`
- **Emoji:** 🧪
- **Shows:** Goodbye message with demo content
- **Group Only:** Only works in group chats

---

## 🎯 System Commands

Core bot commands for navigation and information.

### `/menu` - Command Menu
Display the beautiful command menu with quick access buttons.
- **Usage:** `/menu`
- **Emoji:** 🗂️
- **Shows:** Bot info, uptime, command categories
- **Interactive:** Includes inline buttons for quick access

### `/start` - Start/Help
Display comprehensive help with all available commands.
- **Usage:** `/start`
- **Emoji:** 🚀
- **Shows:** All commands organized by category
- **First Use:** Automatically shown when starting conversation

### `/help` - Help & Support
Get help information and command categories overview.
- **Usage:** `/help`
- **Emoji:** 📚
- **Shows:** Command categories and general support
- **Tips:** Tells you how to get full help

### `/admin list` - List Admins
Show all configured administrators.
- **Usage:** `/admin list`
- **Emoji:** 👮
- **Shows:** List of bot admin IDs
- **Requires:** Admin permissions in group

---

## Command Usage Tips

1. **Reply Commands:** For commands that say "(reply)", simply reply to a message and send the command
2. **Admin Commands:** Only users with admin permissions can execute admin commands
3. **Arguments:** Put required arguments in `[]` like `/echo [your text]`
4. **Optional Arguments:** Put optional arguments in `[brackets]` like `/roll [XdY]`
5. **Separators:** Use `|` to separate options in choice commands

---

## Keyboard Shortcuts

The `/menu` command provides quick-access buttons:
- 🏠 Start - Full command list
- 📚 Help - Help and support
- 👤 User Info - Get your ID
- 🏓 Ping - Check latency
- 🎮 Fun - Tell a joke
- ⚙️ Settings - View settings
- 👥 Group Info - Group details
- 📊 Members - Member count
- 🔧 Admin - Admin options
- 🗂️ Rules - View rules

---

## Statistics

- **Total Commands:** 50+
- **Categories:** 9
- **Admin Commands:** 12
- **User Commands:** 8
- **Fun Commands:** 9
- **Moderation Commands:** 5
- **Settings:** 6
- **Channel/Posting:** 3
- **Auto-Posting:** 4
- **Group Management:** 4

---

## Bot Features

✅ **Beautiful Formatting** - All messages use styled emojis and HTML formatting
✅ **Warning System** - Track user warnings with auto-kick at 3 warnings
✅ **Auto Moderation** - Automatic timeout, softban, and kick features
✅ **Group Settings** - Customize bot behavior per group
✅ **Live Uptime** - Bot displays its uptime in the menu
✅ **Interactive Menu** - Quick-access buttons in command menu
✅ **Welcome/Goodbye** - Custom messages for member join/leave
✅ **Channel Posting** - Post to channel and broadcast to all groups
✅ **Fun Commands** - Games, jokes, and text utilities

---

## Getting Help

- Type `/help` for general help
- Type `/start` for all commands
- Type `/commands` for detailed command list
- Type `/menu` for quick-access menu
- Reply to admin with issues

**Bot Version:** 3.0
**Last Updated:** 2026
**Creator:** T20
**Branding:** horla-pookie©

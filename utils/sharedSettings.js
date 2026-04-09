// Shared Settings System
// Centralized settings management for all plugins

// Store group settings
const groupSettings = {};

const getGroupSettings = (chatId) => {
    if (!groupSettings[chatId]) {
        groupSettings[chatId] = {
            prefix: '/',
            language: 'en',
            antiSpam: false,
            welcomeMsg: true,
            chatbot: true
        };
    }
    return groupSettings[chatId];
};

const setGroupSetting = (chatId, setting, value) => {
    const settings = getGroupSettings(chatId);
    settings[setting] = value;
    return settings;
};

const getAllSettings = () => {
    return groupSettings;
};

const resetGroupSettings = (chatId) => {
    groupSettings[chatId] = {
        prefix: '/',
        language: 'en',
        antiSpam: false,
        welcomeMsg: true,
        chatbot: true
    };
    return groupSettings[chatId];
};

module.exports = {
    getGroupSettings,
    setGroupSetting,
    getAllSettings,
    resetGroupSettings
};
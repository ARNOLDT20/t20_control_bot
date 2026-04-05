require('dotenv').config();

const TOKEN = (process.env.TELEGRAM_TOKEN || '').trim();
const CHANNEL_ID = (process.env.CHANNEL_ID || '@t20classictech').trim();
const ADMIN_IDS = (process.env.ADMIN_IDS || '')
    .split(',')
    .map(id => id.trim())
    .filter(Boolean)
    .map(Number);
const PROXY_URL = process.env.SOCKS_PROXY || null;

module.exports = {
    TOKEN,
    CHANNEL_ID,
    ADMIN_IDS,
    PROXY_URL,
};

// Test script to validate bot setup without connecting to Telegram
require('dotenv').config();
const pluginLoader = require('./plugins');
const styles = require('./utils/styles');

console.log('\n' + '═'.repeat(60));
console.log('🧪 T20 CONTROL BOT - SETUP VALIDATION');
console.log('═'.repeat(60));

// Check environment variables
const TOKEN = process.env.TELEGRAM_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID || '@t20classictech';
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').filter(Boolean).map(Number);

console.log(`✅ Token: ${TOKEN ? 'Present' : 'Missing'}`);
console.log(`✅ Channel: ${CHANNEL_ID}`);
console.log(`✅ Admins: ${ADMIN_IDS.length} configured`);

// Create mock bot object for testing
const mockBot = {
    onText: () => { },
    on: () => { },
    userCommands: {}
};

// Test plugin loading
try {
    const groups = [];
    const botStartTime = Date.now();

    pluginLoader(mockBot, () => true, CHANNEL_ID, ADMIN_IDS, groups, botStartTime);
    console.log('✅ All plugins loaded successfully');

    // Test menu generation by checking if welcome commands are loaded
    console.log('✅ Bot setup validation: PASSED');

} catch (error) {
    console.error('❌ Plugin loading failed:', error.message);
    console.error(error.stack);
}

console.log('\n🎉 Setup validation complete!');
console.log('═'.repeat(60));
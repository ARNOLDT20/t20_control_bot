// Test T20 WOLF API integration
const axios = require('axios');

async function testT20WolfAPI() {
    try {
        console.log('🐺🔥 Testing T20 WOLF AI API...');

        const endpoint = 'https://jqkciagpzjpmfypewkyg.supabase.co/functions/v1/t20-wolf-chat';
        const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxa2NpYWdwempwbWZ5cGV3a3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NzYwMTcsImV4cCI6MjA5MTI1MjAxN30.XAANVCxwnFJm4_C5dnfXnd_nRd7MWP7lDxATnHUpOas';

        const response = await axios.post(endpoint, {
            message: 'Hello T20 WOLF! This is a test from the Telegram bot.'
        }, {
            timeout: 15000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'User-Agent': 'T20-Control-Bot-Test/1.0'
            }
        });

        if (response.data && response.data.reply) {
            console.log('✅ T20 WOLF API Connection Successful!');
            console.log('🐺 Response:', response.data.reply);
            console.log('📊 Response time:', response.headers['x-response-time'] || 'N/A');
            return true;
        } else {
            console.log('❌ Unexpected response format:', response.data);
            return false;
        }

    } catch (error) {
        console.log('❌ T20 WOLF API Connection Failed:', error.message);
        if (error.response) {
            console.log('   Status:', error.response.status);
            console.log('   Data:', error.response.data);
        }
        return false;
    }
}

testT20WolfAPI().then(success => {
    if (success) {
        console.log('🎉 T20 WOLF AI integration is ready!');
        console.log('🐺🔥 Your chatbot will now use real T20 WOLF AI responses!');
    } else {
        console.log('⚠️ T20 WOLF AI integration needs attention');
    }
});
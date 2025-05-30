"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = __importDefault(require("dotenv"));
const add_group_1 = require("../api/add-group");
// Load environment variables
dotenv_1.default.config();
// Initialize bot with token
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
    console.error('TELEGRAM_BOT_TOKEN is not set in .env file');
    process.exit(1);
}
console.log('Initializing bot with token:', token.substring(0, 10) + '...');
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// Handle /start command
bot.onText(/\/start/, (msg) => {
    console.log('Received /start command from:', msg.chat.id);
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Bot active. I can help you schedule messages for your group.')
        .then(() => console.log('Start message sent successfully'))
        .catch((error) => console.error('Error sending start message:', error));
});
// Handle when bot is added to a group
bot.on('new_chat_members', async (msg) => {
    if (!msg.new_chat_members)
        return;
    const newMembers = msg.new_chat_members;
    const botInfo = await bot.getMe();
    // Check if bot was added
    const botWasAdded = newMembers.some(member => member.id === botInfo.id);
    if (botWasAdded) {
        console.log('Bot was added to group:', {
            groupId: msg.chat.id,
            groupName: msg.chat.title,
            groupType: msg.chat.type
        });
        try {
            // Add group to Supabase
            // Note: For now, we're using the first user who added the bot as admin
            // In a real app, you might want to implement a proper admin selection process
            const adminId = msg.from?.id.toString();
            if (!adminId) {
                throw new Error('Could not determine admin ID');
            }
            await (0, add_group_1.addGroup)(msg.chat.id.toString(), msg.chat.title || 'Unnamed Group', adminId);
            // Send welcome message
            bot.sendMessage(msg.chat.id, 'Thanks for adding me! I can help schedule messages for this group. Use /start to learn more.');
        }
        catch (error) {
            console.error('Error adding group to database:', error);
            bot.sendMessage(msg.chat.id, 'Sorry, there was an error setting up the group. Please try removing and adding me again.');
        }
    }
});
// Log all messages for debugging
bot.on('message', (msg) => {
    console.log('Received message:', {
        chatId: msg.chat.id,
        text: msg.text,
        type: msg.chat.type
    });
});
// Log when bot starts
console.log('Bot is running...');

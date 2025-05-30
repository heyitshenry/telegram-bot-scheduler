import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { handleStart } from './handlers/startHandler';
import { handleGroupJoin } from './handlers/groupJoinHandler';
import { handleSetMessage } from './handlers/setMessageHandler';
import { handleSetInterval } from './handlers/setIntervalHandler';
import { handleStatus } from './handlers/statusHandler';
import { handleToggle } from './handlers/toggleHandler';
import { startScheduler } from './scheduler';
import { startHealthServer } from './health';

// Load environment variables
config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!token) throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
if (!supabaseUrl) throw new Error('SUPABASE_URL must be provided!');
if (!supabaseKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY must be provided!');

// Initialize bot with error handling
const bot = new TelegramBot(token, { polling: true });

// Handle bot errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

// Register command handlers
bot.onText(/\/start/, (msg) => handleStart(msg, bot));
bot.onText(/\/setmessage (.+)/, (msg, match) => handleSetMessage(msg, match, bot));
bot.onText(/\/setinterval (\d+)/, (msg, match) => handleSetInterval(msg, match, bot));
bot.onText(/\/status/, (msg) => handleStatus(msg, bot));
bot.onText(/\/toggle/, (msg) => handleToggle(msg, bot));

// Register event handlers
bot.on('new_chat_members', (msg) => handleGroupJoin(msg, bot));

// Handle process termination
process.on('SIGINT', async () => {
  console.log('Shutting down bot...');
  await bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down bot...');
  await bot.stopPolling();
  process.exit(0);
});

// Start the scheduler
startScheduler().catch((error) => {
  console.error('Failed to start scheduler:', error);
  process.exit(1);
});

// Start the health check server
startHealthServer();

console.log('Bot is running...'); 
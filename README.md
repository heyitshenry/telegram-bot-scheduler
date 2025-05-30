# Telegram Bot Scheduler

A Telegram bot that allows you to schedule periodic messages in groups.

## Features

- Schedule periodic messages in Telegram groups
- Set custom message intervals
- Admin-only commands for security
- Automatic message scheduling
- Status checking for current settings

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   TELEGRAM_BOT_TOKEN=your_bot_token
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. Build the TypeScript code:
   ```bash
   npm run build
   ```

5. Start the bot:
   ```bash
   npm start
   ```

## Bot Commands

- `/start` - Show help message
- `/setmessage <text>` - Set the message to be sent periodically
- `/setinterval <minutes>` - Set the interval between messages
- `/status` - Show current settings and next message time

## Development

- `npm run dev` - Start the bot in development mode with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Start the production bot

## Architecture

The bot is built with:
- TypeScript for type safety
- node-telegram-bot-api for Telegram integration
- Supabase for data storage
- dotenv for environment management

## Security

- Only group admins can use commands
- Messages are stored securely in Supabase
- Environment variables for sensitive data

## License

MIT 
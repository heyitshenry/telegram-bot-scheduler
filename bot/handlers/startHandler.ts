import TelegramBot from 'node-telegram-bot-api';

export const handleStart = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

  const message = isGroup
    ? `Welcome to the group! Here are the available commands:

/setmessage <text> - Set the message to be sent periodically
/setinterval <minutes> - Set how often to send the message (in minutes)
/status - Check current message and interval settings

Note: Only group administrators can use these commands.`
    : `Hi! I'm a message scheduler bot. Add me to a group to get started.

In groups, I can help you schedule periodic messages. Group administrators can use these commands:

/setmessage <text> - Set the message to be sent periodically
/setinterval <minutes> - Set how often to send the message (in minutes)
/status - Check current message and interval settings`;

  await bot.sendMessage(chatId, message);
}; 
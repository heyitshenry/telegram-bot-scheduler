import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleSetMessage = async (
  msg: TelegramBot.Message,
  match: RegExpExecArray | null,
  bot: TelegramBot
) => {
  const chatId = msg.chat.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

  if (!isGroup) {
    await bot.sendMessage(chatId, 'This command can only be used in groups.');
    return;
  }

  // Check if user is admin
  const chatMember = await bot.getChatMember(chatId, msg.from!.id);
  if (!['creator', 'administrator'].includes(chatMember.status)) {
    await bot.sendMessage(chatId, 'Only group administrators can use this command.');
    return;
  }

  if (!match) {
    await bot.sendMessage(chatId, 'Please provide a message. Example: /setmessage Hello world!');
    return;
  }

  const message = match[1];

  try {
    const { error } = await supabase
      .from('groups')
      .update({ message })
      .eq('group_id', chatId.toString());

    if (error) throw error;

    await bot.sendMessage(
      chatId,
      `Message updated successfully! The new message will be:\n\n${message}`
    );
  } catch (error) {
    console.error('Error updating message:', error);
    await bot.sendMessage(
      chatId,
      'Sorry, there was an error updating the message. Please try again.'
    );
  }
}; 
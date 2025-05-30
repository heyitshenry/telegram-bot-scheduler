import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleSetInterval = async (
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
    await bot.sendMessage(chatId, 'Please provide an interval in minutes. Example: /setinterval 60');
    return;
  }

  const interval = parseInt(match[1], 10);

  if (isNaN(interval) || interval < 1) {
    await bot.sendMessage(chatId, 'Please provide a valid interval in minutes (minimum 1 minute).');
    return;
  }

  try {
    const { error } = await supabase
      .from('groups')
      .update({ interval_minutes: interval })
      .eq('group_id', chatId.toString());

    if (error) throw error;

    await bot.sendMessage(
      chatId,
      `Interval updated successfully! Messages will be sent every ${interval} minutes.`
    );
  } catch (error) {
    console.error('Error updating interval:', error);
    await bot.sendMessage(
      chatId,
      'Sorry, there was an error updating the interval. Please try again.'
    );
  }
}; 
import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleToggle = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

  if (!isGroup) {
    await bot.sendMessage(chatId, 'This command can only be used in groups.');
    return;
  }

  try {
    // Get current status
    const { data: group, error: fetchError } = await supabase
      .from('groups')
      .select('is_active')
      .eq('group_id', chatId.toString())
      .single();

    if (fetchError) throw fetchError;

    if (!group) {
      await bot.sendMessage(
        chatId,
        'This group is not set up for message scheduling. Add me to the group again to set it up.'
      );
      return;
    }

    // Toggle the status
    const { error: updateError } = await supabase
      .from('groups')
      .update({ is_active: !group.is_active })
      .eq('group_id', chatId.toString());

    if (updateError) throw updateError;

    const newStatus = !group.is_active;
    await bot.sendMessage(
      chatId,
      `Message scheduling has been ${newStatus ? 'resumed' : 'paused'}.`
    );
  } catch (error) {
    console.error('Error toggling message scheduling:', error);
    await bot.sendMessage(
      chatId,
      'Sorry, there was an error updating the message scheduling status. Please try again.'
    );
  }
}; 
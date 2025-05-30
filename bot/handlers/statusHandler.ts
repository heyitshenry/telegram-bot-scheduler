import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleStatus = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  const chatId = msg.chat.id;
  const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

  if (!isGroup) {
    await bot.sendMessage(chatId, 'This command can only be used in groups.');
    return;
  }

  try {
    const { data, error } = await supabase
      .from('groups')
      .select('message, interval_minutes, last_sent_at')
      .eq('group_id', chatId.toString())
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      await bot.sendMessage(
        chatId,
        'This group is not set up for message scheduling. Add me to the group again to set it up.'
      );
      return;
    }

    const nextMessageTime = data.last_sent_at
      ? new Date(new Date(data.last_sent_at).getTime() + data.interval_minutes * 60000)
      : new Date();

    const statusMessage = `📊 Current Settings:

📝 Message:
${data.message}

⏰ Interval: Every ${data.interval_minutes} minutes

🕒 Next message: ${nextMessageTime.toLocaleString()}

To change these settings, use:
/setmessage <text> - Change the message
/setinterval <minutes> - Change the interval`;

    await bot.sendMessage(chatId, statusMessage);
  } catch (error) {
    console.error('Error fetching status:', error);
    await bot.sendMessage(
      chatId,
      'Sorry, there was an error fetching the status. Please try again.'
    );
  }
}; 
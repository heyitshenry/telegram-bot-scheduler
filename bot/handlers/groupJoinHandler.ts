import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const handleGroupJoin = async (msg: TelegramBot.Message, bot: TelegramBot) => {
  if (!msg.new_chat_members) return;
  
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
      // Get admin info (first user who added the bot)
      const adminId = msg.from?.id.toString();
      if (!adminId) {
        throw new Error('Could not determine admin ID');
      }

      // Add group to Supabase
      const { error } = await supabase
        .from('groups')
        .insert({
          group_id: msg.chat.id.toString(),
          group_name: msg.chat.title || 'Unnamed Group',
          admin_id: adminId,
          interval_minutes: 60, // Default interval
          message: 'Welcome to the group!', // Default message
        });

      if (error) throw error;

      // Send welcome message
      await bot.sendMessage(
        msg.chat.id,
        'Thanks for adding me! I can help schedule messages for this group. Use /start to learn more.'
      );
    } catch (error) {
      console.error('Error adding group to database:', error);
      await bot.sendMessage(
        msg.chat.id,
        'Sorry, there was an error setting up the group. Please try removing and adding me again.'
      );
    }
  }
}; 
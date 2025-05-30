import TelegramBot from 'node-telegram-bot-api';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Health check state
let lastHealthCheck = new Date();
let isHealthy = true;
let lastError: Error | null = null;

export const getHealthStatus = () => ({
  isHealthy,
  lastHealthCheck,
  lastError: lastError?.message || null,
  uptime: process.uptime()
});

export const startScheduler = async () => {
  console.log('Starting message scheduler...');
  
  setInterval(async () => {
    try {
      console.log('Checking for messages to send...');
      
      const { data: groups, error } = await supabase
        .from('groups')
        .select('*')
        .not('message', 'is', null)
        .eq('is_active', true);  // Only get active groups

      if (error) {
        console.error('Error fetching groups:', error);
        isHealthy = false;
        lastError = error;
        return;
      }

      if (!groups || groups.length === 0) {
        console.log('No active groups found with messages set');
        return;
      }

      console.log(`Found ${groups.length} active groups to check`);

      for (const group of groups) {
        try {
          const now = new Date();
          const lastSent = group.last_sent_at ? new Date(group.last_sent_at) : null;
          const intervalMs = group.interval_minutes * 60000;

          const shouldSend = !lastSent || (now.getTime() - lastSent.getTime() >= intervalMs);

          if (shouldSend) {
            console.log(`Sending message to group ${group.group_name} (${group.group_id})`);
            
            await bot.sendMessage(group.group_id, group.message);
            
            const { error: updateError } = await supabase
              .from('groups')
              .update({ last_sent_at: now.toISOString() })
              .eq('id', group.id);

            if (updateError) {
              console.error('Error updating last_sent_at:', updateError);
              isHealthy = false;
              lastError = updateError;
            } else {
              console.log(`Updated last_sent_at for group ${group.group_id}`);
            }
          } else {
            console.log(`Group ${group.group_id} not ready for next message yet`);
          }
        } catch (groupError) {
          console.error(`Error processing group ${group.group_id}:`, groupError);
          isHealthy = false;
          lastError = groupError as Error;
        }
      }

      // Update health check status
      lastHealthCheck = new Date();
      isHealthy = true;
      lastError = null;
    } catch (error) {
      console.error('Scheduler error:', error);
      isHealthy = false;
      lastError = error as Error;
    }
  }, 60000); // Check every minute
}; 
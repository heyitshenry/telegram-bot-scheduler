import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addGroup(groupId: string, groupName: string, adminId: string) {
  try {
    // First, get or create the user in auth.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', adminId)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking user:', userError);
      throw userError;
    }

    let userId: string;
    if (!userData) {
      // Create new user if doesn't exist
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            telegram_id: adminId,
            role: 'user'
          }
        ])
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }
      userId = newUser.id;
    } else {
      userId = userData.id;
    }

    // Now add the group with the correct user ID
    const { data, error } = await supabase
      .from('groups')
      .insert([
        {
          group_id: groupId,
          group_name: groupName,
          admin_id: userId,
          message: 'Welcome to the group!', // Default message
          interval_minutes: 60 // Default interval
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding group:', error);
      throw error;
    }

    console.log('Group added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in addGroup:', error);
    throw error;
  }
} 
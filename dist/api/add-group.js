"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGroup = addGroup;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Supabase client with service role key
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function addGroup(groupId, groupName, adminId) {
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
        let userId;
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
        }
        else {
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
    }
    catch (error) {
        console.error('Error in addGroup:', error);
        throw error;
    }
}

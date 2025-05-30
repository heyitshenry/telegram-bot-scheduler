import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to your Telegram Bot Scheduler dashboard. Here you can manage your scheduled messages.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Group cards will be added here */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-2">No Groups Yet</h2>
          <p className="text-gray-600">
            Add the bot to a Telegram group to get started.
          </p>
        </div>
      </div>
    </div>
  );
} 
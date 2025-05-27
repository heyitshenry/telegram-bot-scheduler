# 🧩 MVP Build Plan – Telegram Bot Scheduler

This plan breaks down the entire MVP into atomic, testable tasks. Each task focuses on **one concern**, with clear start and end conditions.

## 🔹 PHASE 1: Supabase Backend Setup

### ✅ Task 1: Initialize Supabase project
- **Start:** Go to [https://app.supabase.com](https://app.supabase.com), create new project  
- **End:** Project created with credentials for DB + Auth

### ✅ Task 2: Create `groups` table in Supabase
- **Start:** Open Supabase SQL editor  
- **End:** Run this SQL:
  ```sql
  create table groups (
    id uuid primary key default uuid_generate_v4(),
    group_id text not null,
    group_name text,
    admin_id uuid references auth.users(id) on delete cascade,
    message text,
    interval_minutes int default 60,
    last_sent_at timestamp,
    created_at timestamp default now()
  );
  ```

### ✅ Task 3: Enable RLS and define policies for groups
- **Start:** In Supabase UI → Auth → Policies
- **End:** Add:
  ```sql
  -- SELECT: only for group owner
  create policy "Admin can read own groups"
  on groups for select using (auth.uid() = admin_id);

  -- UPDATE: only group owner can update
  create policy "Admin can update own groups"
  on groups for update using (auth.uid() = admin_id);
  ```

### ✅ Task 4: Set up Supabase service role key (for bot)
- **Start:** Go to Supabase project settings → API
- **End:** Copy service role key

## 🔹 PHASE 2: Telegram Bot Base Setup

### ✅ Task 5: Create new bot with BotFather
- **Start:** Message @BotFather on Telegram
- **End:** Get bot token and name (store as TELEGRAM_BOT_TOKEN)

### ✅ Task 6: Initialize bot/ folder with index.ts
- **Start:** Create bot/index.ts
- **End:** Basic bot responding to /start
  ```typescript
  import TelegramBot from 'node-telegram-bot-api';
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });
  bot.onText(/\/start/, (msg) => bot.sendMessage(msg.chat.id, 'Bot active.'));
  ```

### ✅ Task 7: Add handler when bot is added to a group
- **Start:** Add bot.on('new_chat_members') logic
- **End:** Print/log the group ID and group name

### ✅ Task 8: Create API route /api/add-group.ts
- **Start:** Create file in /api/add-group.ts
- **End:** Accept POST with group_id, group_name, admin_id, inserts into Supabase

### ✅ Task 9: Update bot to call /api/add-group.ts
- **Start:** On group join, call POST to above endpoint
- **End:** Group added to Supabase with correct info

## 🔹 PHASE 3: Next.js Frontend (Auth + Group View)

### ✅ Task 10: Initialize Next.js project in /web
- **Start:** npx create-next-app@latest
- **End:** Project scaffolding complete

### ✅ Task 11: Integrate Supabase client in lib/supabaseClient.ts
- **Start:** Add Supabase URL + anon key
- **End:** Client initialized

### ✅ Task 12: Set up Supabase Auth (email login)
- **Start:** Use @supabase/auth-helpers-nextjs
- **End:** Users can log in and get user.id

### ✅ Task 13: Create protected route /dashboard
- **Start:** Page checks auth via Supabase session
- **End:** Redirects if user not logged in

### ✅ Task 14: Fetch groups belonging to logged-in user
- **Start:** Fetch from Supabase groups table where admin_id = user.id
- **End:** List of groups rendered

## 🔹 PHASE 4: Message + Interval Configuration

### ✅ Task 15: Create MessageForm component
- **Start:** Form with:
  - Textarea for message
  - Number input for interval (minutes)
- **End:** On submit, POSTs to /api/update-config.ts

### ✅ Task 16: Create /api/update-config.ts route
- **Start:** Receives group ID + message + interval
- **End:** Updates record in Supabase

### ✅ Task 17: Link form to API + test saving config
- **Start:** Submit new values from frontend
- **End:** Values update in DB

## 🔹 PHASE 5: Scheduler for Message Delivery

### ✅ Task 18: Create scheduler.ts with sendScheduledMessages() fn
- **Start:** Function does:
  - Get all groups
  - Filter by interval_minutes and last_sent_at
  - Send messages via Telegram API
  - Update last_sent_at
- **End:** Message sent + timestamp updated

### ✅ Task 19: Create /api/trigger-messages.ts route
- **Start:** Expose sendScheduledMessages() via route
- **End:** Visiting this runs the scheduler

### ✅ Task 20: Test end-to-end message flow
- **Start:** Group added → config set → /trigger-messages hit
- **End:** Message sent to Telegram group

### ✅ Task 21: Set up CRON job (every 5 mins)
- **Start:** Use Vercel CRON, Supabase Edge Functions, or external CRON
- **End:** Scheduler runs automatically


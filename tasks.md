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
    admin_id text not null,  -- Telegram user ID of admin
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
  -- SELECT: only for group admin
  create policy "Admin can read own groups"
  on groups for select using (admin_id = auth.uid());

  -- UPDATE: only group admin can update
  create policy "Admin can update own groups"
  on groups for update using (admin_id = auth.uid());
  ```

### ✅ Task 4: Set up Supabase service role key (for bot)
- **Start:** Go to Supabase project settings → API
- **End:** Copy service role key

## 🔹 PHASE 2: Telegram Bot Setup

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

### ✅ Task 8: Create group join handler
- **Start:** Create bot/handlers/groupJoinHandler.ts
- **End:** When bot joins group:
  1. Get group info
  2. Get admin info
  3. Insert into Supabase groups table

## 🔹 PHASE 3: Bot Commands

### Task 9: Implement /setmessage command
- **Start:** Create bot/handlers/setMessageHandler.ts
- **End:** Command:
  - Only works in groups
  - Only group admin can use
  - Updates message in Supabase
  - Confirms with preview

### Task 10: Implement /setinterval command
- **Start:** Create bot/handlers/setIntervalHandler.ts
- **End:** Command:
  - Only works in groups
  - Only group admin can use
  - Updates interval in Supabase
  - Confirms with new schedule

### Task 11: Implement /status command
- **Start:** Create bot/handlers/statusHandler.ts
- **End:** Command:
  - Shows current message
  - Shows current interval
  - Shows next scheduled message time

## 🔹 PHASE 4: Message Scheduler

### Task 12: Create scheduler.ts
- **Start:** Create bot/scheduler.ts
- **End:** Function that:
  1. Gets all groups from Supabase
  2. Checks which need messages sent
  3. Sends messages via Telegram API
  4. Updates last_sent_at

### Task 13: Set up periodic scheduler
- **Start:** Add scheduler to bot/index.ts
- **End:** Runs every minute to check for messages to send

### Task 14: Test end-to-end flow
- **Start:** Add bot to group
- **End:** Verify:
  1. Group added to DB
  2. Commands work
  3. Messages sent on schedule


/telegram-bot-scheduler/
│
├── /bot/                         # Telegram bot logic
│   ├── index.ts                  # Main bot entrypoint
│   ├── handlers/                 # Command + event handlers
│   │   ├── startHandler.ts       # /start command
│   │   ├── setMessageHandler.ts  # /setmessage command
│   │   ├── setIntervalHandler.ts # /setinterval command
│   │   └── groupJoinHandler.ts   # Bot added to group
│   └── scheduler.ts              # Core scheduler logic
│
├── /supabase/                    # DB & RLS schema
│   ├── schema.sql               # Database schema
│   └── policies.sql             # Row Level Security policies
│
├── /utils/
│   ├── types.ts                 # Shared types/interfaces
│   ├── constants.ts             # Default values, limits
│   └── telegram.ts              # Telegram API helpers
│
├── .env                         # Environment variables
├── package.json
└── README.md
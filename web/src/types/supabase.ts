export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          group_id: string
          group_name: string | null
          admin_id: string
          message: string | null
          interval_minutes: number
          last_sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          group_name?: string | null
          admin_id: string
          message?: string | null
          interval_minutes?: number
          last_sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          group_name?: string | null
          admin_id?: string
          message?: string | null
          interval_minutes?: number
          last_sent_at?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          telegram_id: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          telegram_id: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          telegram_id?: string
          role?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
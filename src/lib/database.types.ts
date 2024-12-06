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
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          user_id: string
          completed: boolean
          timer_duration: number | null
          timer_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          user_id: string
          completed?: boolean
          timer_duration?: number | null
          timer_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          user_id?: string
          completed?: boolean
          timer_duration?: number | null
          timer_active?: boolean
        }
      }
    }
  }
}
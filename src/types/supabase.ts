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
      audience_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          problems: Json | null
          product_solutions: Json | null
          attraction_channels: string[] | null
          engagement_channels: string[] | null
          most_valuable_segments: string[] | null
          common_objections: Json | null
          common_channels: string[] | null
          trusted_platforms: string[] | null
          complementary_problems: string[] | null
          voice_of_customer: Json | null
          notes: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          problems?: Json | null
          product_solutions?: Json | null
          attraction_channels?: string[] | null
          engagement_channels?: string[] | null
          most_valuable_segments?: string[] | null
          common_objections?: Json | null
          common_channels?: string[] | null
          trusted_platforms?: string[] | null
          complementary_problems?: string[] | null
          voice_of_customer?: Json | null
          notes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          problems?: Json | null
          product_solutions?: Json | null
          attraction_channels?: string[] | null
          engagement_channels?: string[] | null
          most_valuable_segments?: string[] | null
          common_objections?: Json | null
          common_channels?: string[] | null
          trusted_platforms?: string[] | null
          complementary_problems?: string[] | null
          voice_of_customer?: Json | null
          notes?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      growth_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: string
          goals: Json[]
          metrics: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          goals?: Json[]
          metrics?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          goals?: Json[]
          metrics?: Json[]
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: string
          stage: string
          tactic_id: string | null
          custom_tactic: string | null
          growth_plan_id: string
          user_id: string
          frequency: string | null
          distribution_channels: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          stage: string
          tactic_id?: string | null
          custom_tactic?: string | null
          growth_plan_id: string
          user_id: string
          frequency?: string | null
          distribution_channels?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          stage?: string
          tactic_id?: string | null
          custom_tactic?: string | null
          growth_plan_id?: string
          user_id?: string
          frequency?: string | null
          distribution_channels?: string[] | null
        }
      }
      projects: {
        Row: {
          id: string
          campaign_id: string | null
          user_id: string
          name: string
          description: string | null
          start_date: string | null
          end_date: string | null
          status: string
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id?: string | null
          user_id: string
          name: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string | null
          user_id?: string
          name?: string
          description?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          priority?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          project_id: string | null
          assigned_to: string | null
          user_id: string
          name: string
          description: string | null
          due_date: string | null
          status: string
          priority: string
          estimated_hours: number | null
          actual_hours: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          assigned_to?: string | null
          user_id: string
          name: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          assigned_to?: string | null
          user_id?: string
          name?: string
          description?: string | null
          due_date?: string | null
          status?: string
          priority?: string
          estimated_hours?: number | null
          actual_hours?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_notes: {
        Row: {
          id: string
          campaign_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          campaign_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      tactics: {
        Row: {
          id: string
          name: string
          description: string | null
          stage: string
          audience_types: string[] | null
          product_types: string[] | null
          channels: string[] | null
          budget_range: string | null
          keywords: string[] | null
          example: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          stage: string
          audience_types?: string[] | null
          product_types?: string[] | null
          channels?: string[] | null
          budget_range?: string | null
          keywords?: string[] | null
          example?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          stage?: string
          audience_types?: string[] | null
          product_types?: string[] | null
          channels?: string[] | null
          budget_range?: string | null
          keywords?: string[] | null
          example?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company: string | null
          role: string | null
          updated_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company?: string | null
          role?: string | null
          updated_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company?: string | null
          role?: string | null
          updated_at?: string | null
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          created_at: string | null
          id: string
          log_date: string
          user_id: string
          ux_version: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_date: string
          user_id: string
          ux_version?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          log_date?: string
          user_id?: string
          ux_version?: string | null
        }
        Relationships: []
      }
      feature_suggestions: {
        Row: {
          created_at: string | null
          id: string
          link_key: string
          suggestion_text: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link_key: string
          suggestion_text?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link_key?: string
          suggestion_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      invite_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          id: string
          is_universal: boolean | null
          owner_user_id: string | null
          used: boolean | null
          used_at: string | null
          used_by_user_id: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          id?: string
          is_universal?: boolean | null
          owner_user_id?: string | null
          used?: boolean | null
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          id?: string
          is_universal?: boolean | null
          owner_user_id?: string | null
          used?: boolean | null
          used_at?: string | null
          used_by_user_id?: string | null
        }
        Relationships: []
      }
      metric_responses: {
        Row: {
          created_at: string | null
          daily_log_id: string | null
          id: string
          metric_id: string
          updated_at: string | null
          user_id: string
          value_bool: boolean | null
          value_date: string | null
          value_int: number | null
          value_text: string | null
          value_time: string | null
        }
        Insert: {
          created_at?: string | null
          daily_log_id?: string | null
          id?: string
          metric_id: string
          updated_at?: string | null
          user_id: string
          value_bool?: boolean | null
          value_date?: string | null
          value_int?: number | null
          value_text?: string | null
          value_time?: string | null
        }
        Update: {
          created_at?: string | null
          daily_log_id?: string | null
          id?: string
          metric_id?: string
          updated_at?: string | null
          user_id?: string
          value_bool?: boolean | null
          value_date?: string | null
          value_int?: number | null
          value_text?: string | null
          value_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "metric_responses_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "metric_responses_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          active: boolean | null
          created_at: string | null
          day_specific: boolean | null
          id: string
          key: string
          label: string
          sequence_key: string | null
          type: Database["public"]["Enums"]["metric_type"]
          ux_version: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          day_specific?: boolean | null
          id?: string
          key: string
          label: string
          sequence_key?: string | null
          type: Database["public"]["Enums"]["metric_type"]
          ux_version?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          day_specific?: boolean | null
          id?: string
          key?: string
          label?: string
          sequence_key?: string | null
          type?: Database["public"]["Enums"]["metric_type"]
          ux_version?: string | null
        }
        Relationships: []
      }
      page_events: {
        Row: {
          created_at: string | null
          daily_log_id: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          metadata: Json | null
          page_id: string | null
          page_key: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_log_id?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          page_id?: string | null
          page_key?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_log_id?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          metadata?: Json | null
          page_id?: string | null
          page_key?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "page_events_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_events_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          branch_logic: Json | null
          collects_metric_key: string | null
          content: Json | null
          created_at: string | null
          display_order: number
          id: string
          key: string
          sequence_id: string
        }
        Insert: {
          branch_logic?: Json | null
          collects_metric_key?: string | null
          content?: Json | null
          created_at?: string | null
          display_order: number
          id?: string
          key: string
          sequence_id: string
        }
        Update: {
          branch_logic?: Json | null
          collects_metric_key?: string | null
          content?: Json | null
          created_at?: string | null
          display_order?: number
          id?: string
          key?: string
          sequence_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_page_id: string | null
          current_page_key: string | null
          daily_log_id: string | null
          id: string
          path_choices: Json | null
          sequence_id: string
          started_at: string | null
          status: Database["public"]["Enums"]["progress_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_page_id?: string | null
          current_page_key?: string | null
          daily_log_id?: string | null
          id?: string
          path_choices?: Json | null
          sequence_id: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_page_id?: string | null
          current_page_key?: string | null
          daily_log_id?: string | null
          id?: string
          path_choices?: Json | null
          sequence_id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["progress_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequence_progress_current_page_id_fkey"
            columns: ["current_page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_progress_daily_log_id_fkey"
            columns: ["daily_log_id"]
            isOneToOne: false
            referencedRelation: "daily_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_progress_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequences: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          key: string
          name: string
          ux_version: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          key: string
          name: string
          ux_version?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          key?: string
          name?: string
          ux_version?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: string
          invite_code_id: string | null
          last_execution_flow_day: string | null
          name: string | null
          onboarded: boolean | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          invite_code_id?: string | null
          last_execution_flow_day?: string | null
          name?: string | null
          onboarded?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          invite_code_id?: string | null
          last_execution_flow_day?: string | null
          name?: string | null
          onboarded?: boolean | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_invite_code_id_fkey"
            columns: ["invite_code_id"]
            isOneToOne: false
            referencedRelation: "invite_codes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_referral_codes: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      generate_referral_code: { Args: never; Returns: string }
      get_or_create_daily_log: {
        Args: { p_date: string; p_user_id: string }
        Returns: string
      }
      get_or_create_sequence_progress: {
        Args: {
          p_daily_log_id?: string
          p_sequence_key: string
          p_user_id: string
        }
        Returns: string
      }
      log_feature_suggestion: {
        Args: {
          p_link_key: string
          p_suggestion_text?: string
          p_user_id: string
        }
        Returns: string
      }
      log_page_event: {
        Args: {
          p_daily_log_id?: string
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_metadata?: Json
          p_page_key: string
          p_user_id: string
        }
        Returns: string
      }
      save_metric_response: {
        Args: {
          p_daily_log_id?: string
          p_metric_key: string
          p_user_id: string
          p_value_bool?: boolean
          p_value_date?: string
          p_value_int?: number
          p_value_text?: string
          p_value_time?: string
        }
        Returns: string
      }
      use_invite_code: {
        Args: { p_code: string; p_user_id: string }
        Returns: string
      }
      validate_invite_code: { Args: { p_code: string }; Returns: boolean }
    }
    Enums: {
      event_type:
        | "page_view"
        | "page_complete"
        | "page_abandon"
        | "help_click"
        | "error_click"
        | "stuck_click"
        | "link_click"
        | "audio_play"
        | "audio_pause"
        | "audio_complete"
      metric_type:
        | "text"
        | "integer"
        | "date"
        | "time"
        | "boolean"
        | "scale_1_10"
        | "choice"
      progress_status: "not_started" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      event_type: [
        "page_view",
        "page_complete",
        "page_abandon",
        "help_click",
        "error_click",
        "stuck_click",
        "link_click",
        "audio_play",
        "audio_pause",
        "audio_complete",
      ],
      metric_type: [
        "text",
        "integer",
        "date",
        "time",
        "boolean",
        "scale_1_10",
        "choice",
      ],
      progress_status: ["not_started", "in_progress", "completed"],
    },
  },
} as const

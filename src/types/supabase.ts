export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      material_prices: {
        Row: {
          category: string
          id: number
          last_updated: string | null
          location: string | null
          name: string
          price: number | null
          source: string | null
          unit: string
        }
        Insert: {
          category: string
          id?: number
          last_updated?: string | null
          location?: string | null
          name: string
          price?: number | null
          source?: string | null
          unit: string
        }
        Update: {
          category?: string
          id?: number
          last_updated?: string | null
          location?: string | null
          name?: string
          price?: number | null
          source?: string | null
          unit?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          alert_type: string | null
          created_at: string | null
          id: number
          material_id: number | null
          notified: boolean | null
          price_threshold: number | null
        }
        Insert: {
          alert_type?: string | null
          created_at?: string | null
          id?: number
          material_id?: number | null
          notified?: boolean | null
          price_threshold?: number | null
        }
        Update: {
          alert_type?: string | null
          created_at?: string | null
          id?: number
          material_id?: number | null
          notified?: boolean | null
          price_threshold?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: number
          material_id: number | null
          price: number | null
          recorded_at: string | null
        }
        Insert: {
          id?: number
          material_id?: number | null
          price?: number | null
          recorded_at?: string | null
        }
        Update: {
          id?: number
          material_id?: number | null
          price?: number | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      retailer_prices: {
        Row: {
          id: number
          in_stock: boolean | null
          last_scraped: string | null
          material_id: number | null
          price: number | null
          retailer: string | null
          url: string | null
        }
        Insert: {
          id?: number
          in_stock?: boolean | null
          last_scraped?: string | null
          material_id?: number | null
          price?: number | null
          retailer?: string | null
          url?: string | null
        }
        Update: {
          id?: number
          in_stock?: boolean | null
          last_scraped?: string | null
          material_id?: number | null
          price?: number | null
          retailer?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "retailer_prices_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_prices"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          errors: string | null
          id: number
          materials_updated: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          errors?: string | null
          id?: number
          materials_updated?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          errors?: string | null
          id?: number
          materials_updated?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      user_custom_prices: {
        Row: {
          created_at: string | null
          custom_price: number | null
          id: number
          material_id: number | null
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custom_price?: number | null
          id?: number
          material_id?: number | null
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custom_price?: number | null
          id?: number
          material_id?: number | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_custom_prices_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "material_prices"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

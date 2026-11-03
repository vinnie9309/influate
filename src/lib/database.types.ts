
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "connections": {
                  Row: {
                    "created_at": string,"from_id": string,"id": string,"note": string,"status": Database["public"]['Enums']["connection_status"],"to_id": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"from_id": string,"id"?: string,"note"?: string,"status"?: Database["public"]['Enums']["connection_status"],"to_id": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"from_id"?: string,"id"?: string,"note"?: string,"status"?: Database["public"]['Enums']["connection_status"],"to_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "connections_from_id_fkey"
      columns: ["from_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "connections_to_id_fkey"
      columns: ["to_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"contacts": {
                  Row: {
                    "email": string,"id": string,"links": string,"phone": string
                  }
                  ComputedFields: never
                  Insert: {
                    "email"?: string,"id": string,"links"?: string,"phone"?: string
                  }
                  Update: {
                    "email"?: string,"id"?: string,"links"?: string,"phone"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "contacts_id_fkey"
      columns: ["id"]
isOneToOne: true
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"partnerships": {
                  Row: {
                    "brand_id": string | null,"code": string,"created_at": string,"created_by": string | null,"creator_id": string | null,"id": string,"status": Database["public"]['Enums']["partnership_status"],"terms": string,"title": string
                  }
                  ComputedFields: never
                  Insert: {
                    "brand_id"?: string | null,"code": string,"created_at"?: string,"created_by"?: string | null,"creator_id"?: string | null,"id"?: string,"status"?: Database["public"]['Enums']["partnership_status"],"terms"?: string,"title": string
                  }
                  Update: {
                    "brand_id"?: string | null,"code"?: string,"created_at"?: string,"created_by"?: string | null,"creator_id"?: string | null,"id"?: string,"status"?: Database["public"]['Enums']["partnership_status"],"terms"?: string,"title"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "partnerships_brand_id_fkey"
      columns: ["brand_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "partnerships_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "partnerships_creator_id_fkey"
      columns: ["creator_id"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
                  ]
                },"profiles": {
                  Row: {
                    "audience_age": string,"bio": string,"categories": (string)[],"city": string,"created_at": string,"display_name": string,"followers": string,"headline": string,"id": string,"platforms": (string)[],"role": Database["public"]['Enums']["role"],"target_audience": string,"updated_at": string,"website": string
                  }
                  ComputedFields: never
                  Insert: {
                    "audience_age"?: string,"bio"?: string,"categories"?: (string)[],"city"?: string,"created_at"?: string,"display_name": string,"followers"?: string,"headline"?: string,"id": string,"platforms"?: (string)[],"role": Database["public"]['Enums']["role"],"target_audience"?: string,"updated_at"?: string,"website"?: string
                  }
                  Update: {
                    "audience_age"?: string,"bio"?: string,"categories"?: (string)[],"city"?: string,"created_at"?: string,"display_name"?: string,"followers"?: string,"headline"?: string,"id"?: string,"platforms"?: (string)[],"role"?: Database["public"]['Enums']["role"],"target_audience"?: string,"updated_at"?: string,"website"?: string
                  }
                  Relationships: [
                    
                  ]
                },"results": {
                  Row: {
                    "created_at": string,"created_by": string | null,"date": string,"earnings": number,"id": string,"note": string,"partnership_id": string,"revenue": number,"sales": number
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"created_by"?: string | null,"date": string,"earnings": number,"id"?: string,"note"?: string,"partnership_id": string,"revenue": number,"sales": number
                  }
                  Update: {
                    "created_at"?: string,"created_by"?: string | null,"date"?: string,"earnings"?: number,"id"?: string,"note"?: string,"partnership_id"?: string,"revenue"?: number,"sales"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "results_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "results_partnership_id_fkey"
      columns: ["partnership_id"]
isOneToOne: false
      referencedRelation: "partnerships"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "create_my_profile":
{ Args: { "p_display_name": string,"p_role": Database["public"]['Enums']["role"] }; Returns: undefined
                           },
"delete_my_account":
{ Args: Record<PropertyKey, never>; Returns: undefined
                           },
"export_my_data":
{ Args: Record<PropertyKey, never>; Returns: Json
                           },
"is_connected":
{ Args: { "other": string }; Returns: boolean
                           },
"is_partner":
{ Args: { "partnership": string }; Returns: boolean
                           },
"role_of":
{ Args: { "uid": string }; Returns: Database["public"]['Enums']["role"]
                           }
          }
          Enums: {
            "connection_status": "pending"|"accepted"|"declined","partnership_status": "active"|"ended","role": "creator"|"brand"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "connection_status": ["pending", "accepted", "declined"],"partnership_status": ["active", "ended"],"role": ["creator", "brand"]
          }
        }
} as const

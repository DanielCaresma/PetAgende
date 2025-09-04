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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          data_agendamento: string
          establishment_id: string
          horario_fim: string
          horario_inicio: string
          id: string
          observacoes: string | null
          pet_id: string
          preco_final: number | null
          service_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_agendamento: string
          establishment_id: string
          horario_fim: string
          horario_inicio: string
          id?: string
          observacoes?: string | null
          pet_id: string
          preco_final?: number | null
          service_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_agendamento?: string
          establishment_id?: string
          horario_fim?: string
          horario_inicio?: string
          id?: string
          observacoes?: string | null
          pet_id?: string
          preco_final?: number | null
          service_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          avaliacao_media: number | null
          cnpj: string | null
          created_at: string
          descricao: string | null
          email: string | null
          endereco: Json | null
          fotos: Json | null
          horario_funcionamento: Json | null
          id: string
          nome: string
          status: string | null
          telefone: string | null
          total_avaliacoes: number | null
          updated_at: string
        }
        Insert: {
          avaliacao_media?: number | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: Json | null
          fotos?: Json | null
          horario_funcionamento?: Json | null
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          total_avaliacoes?: number | null
          updated_at?: string
        }
        Update: {
          avaliacao_media?: number | null
          cnpj?: string | null
          created_at?: string
          descricao?: string | null
          email?: string | null
          endereco?: Json | null
          fotos?: Json | null
          horario_funcionamento?: Json | null
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          total_avaliacoes?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      pets: {
        Row: {
          cor: string | null
          created_at: string
          especie: string
          foto: string | null
          id: string
          idade: number | null
          nome: string
          observacoes: string | null
          peso: number | null
          raca: string | null
          sexo: string | null
          updated_at: string
          user_id: string
          vacinacao_em_dia: boolean | null
        }
        Insert: {
          cor?: string | null
          created_at?: string
          especie: string
          foto?: string | null
          id?: string
          idade?: number | null
          nome: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          updated_at?: string
          user_id: string
          vacinacao_em_dia?: boolean | null
        }
        Update: {
          cor?: string | null
          created_at?: string
          especie?: string
          foto?: string | null
          id?: string
          idade?: number | null
          nome?: string
          observacoes?: string | null
          peso?: number | null
          raca?: string | null
          sexo?: string | null
          updated_at?: string
          user_id?: string
          vacinacao_em_dia?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          endereco: Json | null
          foto_perfil: string | null
          id: string
          nome: string
          status: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          endereco?: Json | null
          foto_perfil?: string | null
          id?: string
          nome: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          endereco?: Json | null
          foto_perfil?: string | null
          id?: string
          nome?: string
          status?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appointment_id: string
          comentario: string | null
          created_at: string
          establishment_id: string
          id: string
          nota: number
          user_id: string
        }
        Insert: {
          appointment_id: string
          comentario?: string | null
          created_at?: string
          establishment_id: string
          id?: string
          nota: number
          user_id: string
        }
        Update: {
          appointment_id?: string
          comentario?: string | null
          created_at?: string
          establishment_id?: string
          id?: string
          nota?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          categoria: string
          created_at: string
          descricao: string | null
          duracao: number
          especies_atendidas: Json | null
          establishment_id: string
          id: string
          nome: string
          preco: number
          status: string | null
          updated_at: string
        }
        Insert: {
          categoria: string
          created_at?: string
          descricao?: string | null
          duracao: number
          especies_atendidas?: Json | null
          establishment_id: string
          id?: string
          nome: string
          preco: number
          status?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          descricao?: string | null
          duracao?: number
          especies_atendidas?: Json | null
          establishment_id?: string
          id?: string
          nome?: string
          preco?: number
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
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
  public: {
    Enums: {},
  },
} as const

export type JSON =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSON }
  | JSON[]

export interface Database {
  public: {
    Tables: {
      "spicey-la-vicey": {
        Row: {
          id: number
          timestamp: number | null
          title: string | null
          update: boolean | null
        }
        Insert: {
          id?: number
          timestamp?: number | null
          title?: string | null
          update?: boolean | null
        }
        Update: {
          id?: number
          timestamp?: number | null
          title?: string | null
          update?: boolean | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

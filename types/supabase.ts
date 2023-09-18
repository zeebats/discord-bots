export type JSON =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSON | undefined }
  | JSON[]

export interface Database {
  public: {
    Tables: {
      "spicey-la-vicey": {
        Row: {
          id: number
          timestamp: number | null
          title: string | null
          updatedThisWeek: boolean | null
        }
        Insert: {
          id?: number
          timestamp?: number | null
          title?: string | null
          updatedThisWeek?: boolean | null
        }
        Update: {
          id?: number
          timestamp?: number | null
          title?: string | null
          updatedThisWeek?: boolean | null
        }
        Relationships: []
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

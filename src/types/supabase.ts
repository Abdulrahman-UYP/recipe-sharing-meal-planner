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
            profiles: {
                Row: {
                    id: string
                    username: string | null
                    full_name: string | null
                    avatar_url: string | null
                    updated_at: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    username?: string | null
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                    created_at?: string
                }
            }
            recipes: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    ingredients: Json
                    instructions: string
                    image_url: string | null
                    category: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    ingredients: Json
                    instructions: string
                    image_url?: string | null
                    category?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    ingredients?: Json
                    instructions?: string
                    image_url?: string | null
                    category?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            favorites: {
                Row: {
                    id: string
                    user_id: string
                    recipe_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    recipe_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    recipe_id?: string
                    created_at?: string
                }
            }
            meal_plans: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    recipe_id: string | null
                    title: string | null
                    meal_type: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date: string
                    recipe_id?: string | null
                    title?: string | null
                    meal_type: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    recipe_id?: string | null
                    title?: string | null
                    meal_type?: string
                    created_at?: string
                }
            }
        }
    }
}

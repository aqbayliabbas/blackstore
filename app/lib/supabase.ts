import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log a warning if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase credentials are missing. Check your .env.local file.")
}

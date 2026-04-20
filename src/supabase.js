import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bbnnmmgmkygqtvzaldmr.supabase.co'
const supabaseAnonKey = 'sb_publishable_wzgvYyfcYWPoGSOXsR9Grg_V9BOvrja'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
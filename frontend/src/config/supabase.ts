
import { createClient } from '@supabase/supabase-js';

const env = import.meta.env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || (env.MODE === 'test' ? 'https://test.supabase.co' : '');
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || (env.MODE === 'test' ? 'test-anon-key' : '');

if (!supabaseUrl || !supabaseAnonKey) {
    // Warn or throw depending on strictness. 
    // For migration, we log logic error.
    console.error("Missing Supabase Environment Variables");
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key');

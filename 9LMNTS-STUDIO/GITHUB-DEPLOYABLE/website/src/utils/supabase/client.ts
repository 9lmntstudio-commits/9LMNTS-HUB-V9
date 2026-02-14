import { createClient } from '@supabase/supabase-js';

// Create a singleton Supabase client to avoid multiple instances
let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vfrxxfviaykafzbxpehw.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcnh4ZnZpYXlrYWZ6YnhwZWh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMTc1NTQsImV4cCI6MjA4MjU5MzU1NH0.BE4miINNQTVCL20piFzAVZTqtHvuWCe58MpfQ_M8SU0';
    
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseClient;
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dtrlrsrmizglyozueoeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cmxyc3JtaXpnbHlvenVlb2V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ0NTMzNjgsImV4cCI6MjA0MDAyOTM2OH0.fBmH_quemgX6K9zyhbShHh3TOjlSHCje5RqU7Ug4JyQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
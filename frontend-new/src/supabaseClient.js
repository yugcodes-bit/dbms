// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwcesrbjppppxswokwqz.supabase.co';    // Paste your Project URL here
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13Y2VzcmJqcHBwcHhzd29rd3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MjMwMjEsImV4cCI6MjA3NDE5OTAyMX0.6JDqu7xs6fpjjxS5C-7e2nAQ_Tzf-WM3wDdDUF2kPmo'; // Paste your anon key here

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

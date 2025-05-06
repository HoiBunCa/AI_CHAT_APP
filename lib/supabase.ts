import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || "https://cbuoshbrlqtdfvrruggb.supabase.co"; 
const SUPABSE_SECRET_KEY = process.env.SUPABSE_SECRET_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNidW9zaGJybHF0ZGZ2cnJ1Z2diIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjQwODY3OSwiZXhwIjoyMDYxOTg0Njc5fQ.JnjOS-IZCoZBuDTG--erv5OIuMP4wUPRU74jYCX5uWY"; 

export const supabase = createClient(SUPABASE_URL, SUPABSE_SECRET_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
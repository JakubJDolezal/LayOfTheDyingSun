import { createClient } from "@supabase/supabase-js";

import {
  PUBLIC_SUPABASE_ANON_KEY as PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL as PUBLIC_SUPABASE_URL,
} from "$env/static/public"
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
    {
    auth: {
      persistSession: true, // ✅ Enable session persistence
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);

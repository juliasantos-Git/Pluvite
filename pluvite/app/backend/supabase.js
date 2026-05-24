import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://qhughmeaxbyupuglpvud.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodWdobWVheGJ5dXB1Z2xwdnVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTAyNzgzMCwiZXhwIjoyMDk0NjAzODMwfQ.LbYDKH9U7IfKfJEbo_RAd4xkQPWBHzoFKLD5ADzdVyc";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

console.log("SUPABASE CONECTADO");
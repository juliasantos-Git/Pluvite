import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "supabaseurl";

const supabaseKey =
  "supabasekey";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

console.log("SUPABASE CONECTADO");
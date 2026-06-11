import { createClient } from "@supabase/supabase-js";

// Lendo com o prefixo correto exigido pelo Next.js para o ambiente do navegador
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl!, supabaseKey!);
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Buscando os dados das variáveis de ambiente protegidas
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // USE A ANON KEY AQUI!

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO: Variáveis de ambiente do Supabase não foram encontradas!");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Evita o erro de múltiplas instâncias no ambiente Node.js
    autoRefreshToken: false,
  },
});

console.log("SUPABASE CONFIGURADO COM SUCESSO");
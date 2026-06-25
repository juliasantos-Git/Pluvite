import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ← mudou aqui

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO: Variáveis de ambiente não encontradas!");
  process.exit(1);
}
// Definição das credenciais diretamente no código para evitar o erro de ambiente
const supabaseUrl = "https://qhughmeaxbyupuglpvud.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodWdobWVheGJ5dXB1Z2xwdnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjc4MzAsImV4cCI6MjA5NDYwMzgzMH0.lrvg087MamSPfBkhfwt0bkFuBtdZOVWO7lOq1OKrQg8";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

console.log("Supabase configurado com sucesso");
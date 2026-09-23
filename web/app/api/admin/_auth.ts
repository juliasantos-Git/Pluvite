import { createClient } from "@supabase/supabase-js";

// Helper compartilhado pelas rotas admin (web/app/api/admin/*) — mesmo padrão
// já usado em web/app/api/criar-servidor/route.ts. Confere se quem está
// chamando a rota está logado E cadastrado na tabela "admin" (equipe Pluvite).
// Não é uma rota (não exporta GET/POST/etc), então o Next não a expõe como
// endpoint — só pode ser importada por outras rotas dentro de app/api.

export function supabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

type ResultadoAuth =
  | { ok: true }
  | { ok: false; status: number; mensagem: string };

export async function exigirAdmin(request: Request): Promise<ResultadoAuth> {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return { ok: false, status: 401, mensagem: "Não autenticado." };
  }

  const supabaseAdmin = supabaseAdminClient();

  const { data: usuarioData, error: erroUsuario } =
    await supabaseAdmin.auth.getUser(token);

  if (erroUsuario || !usuarioData.user) {
    return { ok: false, status: 401, mensagem: "Sessão inválida." };
  }

  const { data: adminRow, error: erroAdmin } = await supabaseAdmin
    .from("admin")
    .select("id")
    .eq("auth_id", usuarioData.user.id)
    .maybeSingle();

  if (erroAdmin || !adminRow) {
    return {
      ok: false,
      status: 403,
      mensagem: "Essa conta não tem acesso ao painel de administração.",
    };
  }

  return { ok: true };
}
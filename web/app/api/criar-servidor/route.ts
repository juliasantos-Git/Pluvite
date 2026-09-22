import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Rota ADMIN — só quem está logado com uma conta cadastrada na tabela "admin"
// (equipe Pluvite) pode usar. O front manda o token de acesso da sessão logada
// no header Authorization; aqui a gente confirma esse token e confere se o
// usuário é mesmo um admin antes de deixar ler ou criar servidores.
async function exigirAdmin(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return { ok: false as const, status: 401, mensagem: "Não autenticado." };
  }

  const supabaseAdmin = supabaseAdminClient();

  const { data: usuarioData, error: erroUsuario } =
    await supabaseAdmin.auth.getUser(token);

  if (erroUsuario || !usuarioData.user) {
    return { ok: false as const, status: 401, mensagem: "Sessão inválida." };
  }

  const { data: adminRow, error: erroAdmin } = await supabaseAdmin
    .from("admin")
    .select("id")
    .eq("auth_id", usuarioData.user.id)
    .maybeSingle();

  if (erroAdmin || !adminRow) {
    return {
      ok: false as const,
      status: 403,
      mensagem: "Essa conta não tem acesso ao painel de administração.",
    };
  }

  return { ok: true as const };
}

function supabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

// Lista os servidores já cadastrados
export async function GET(request: Request) {
  const verificacao = await exigirAdmin(request);
  if (!verificacao.ok) {
    return NextResponse.json(
      { error: verificacao.mensagem },
      { status: verificacao.status },
    );
  }

  try {
    const supabaseAdmin = supabaseAdminClient();

    const { data, error } = await supabaseAdmin
      .from("servidor")
      .select("id, nome_completo, email, municipio, criado_em")
      .order("criado_em", { ascending: false });

    if (error) {
      console.error("Erro ao listar servidores:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro inesperado ao listar servidores:", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const verificacao = await exigirAdmin(request);
  if (!verificacao.ok) {
    return NextResponse.json(
      { error: verificacao.mensagem },
      { status: verificacao.status },
    );
  }

  try {
    const { nome, email, senha, municipio } = await request.json();

    if (!nome || !email || !senha || !municipio) {
      return NextResponse.json(
        { error: "Preencha nome, e-mail, senha e município." },
        { status: 400 },
      );
    }

    const supabaseAdmin = supabaseAdminClient();

    // Cria o usuário já com e-mail confirmado (loga direto com email+senha,
    // pela mesma tela de login que os cidadãos usam)
    const { data: usuarioCriado, error: erroCriacao } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: senha,
        email_confirm: true,
        user_metadata: { nome_completo: nome, tipo: "servidor" },
      });

    if (erroCriacao || !usuarioCriado.user) {
      console.error("Erro ao criar usuário servidor:", erroCriacao);
      return NextResponse.json(
        { error: erroCriacao?.message || "Não foi possível criar o usuário." },
        { status: 500 },
      );
    }

    const { error: erroInsercao } = await supabaseAdmin.from("servidor").insert({
      auth_id: usuarioCriado.user.id,
      nome_completo: nome,
      email,
      municipio,
    });

    if (erroInsercao) {
      console.error("Erro ao inserir servidor:", erroInsercao);
      // Desfaz a criação do usuário no Auth pra não deixar conta órfã sem linha em "servidor"
      await supabaseAdmin.auth.admin.deleteUser(usuarioCriado.user.id);
      return NextResponse.json({ error: erroInsercao.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: usuarioCriado.user.id });
  } catch (error) {
    console.error("Erro inesperado ao criar servidor:", error);
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
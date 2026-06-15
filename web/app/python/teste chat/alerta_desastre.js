/** * alerta-desastres.js
* =====================================================
* Inclua este script em qualquer página HTML do site.
* Ele conecta automaticamente ao backend via SSE e
* exibe o pop-up de alerta quando o servidor enviar.
*
* Uso:
*   <script src="alerta-desastres.js"></script>
*
* Funciona em qualquer site HTML/CSS/JS, React, Vue, etc.
* No futuro, a mesma lógica pode ser portada para o app.
* =====================================================
*/

(function () {
    "use strict";

    // ── Configuração ──────────────────────────────────────────
    const BACKEND_URL = "http://localhost:5000"; // troque pelo URL do servidor em produção
    const RECONNECT_MS = 5000;                   // tenta reconectar após 5s se cair

    // ── Cores por nível de risco ──────────────────────────────
    const ESTILOS = {
        vermelho: { fundo: "#b91c1c", icone: "🚨", titulo: "ALERTA VERMELHO — Perigo Extremo" },
        laranja: { fundo: "#c2410c", icone: "🔶", titulo: "ALERTA LARANJA — Alto Risco" },
        amarelo: { fundo: "#a16207", icone: "⚠️", titulo: "ATENÇÃO — Risco Moderado" },
    };

    // ── Injeta o CSS do pop-up uma única vez ──────────────────
    function injetarEstilos() {
        if (document.getElementById("_alerta-style")) return;
        const style = document.createElement("style");
        style.id = "_alerta-style";
        style.textContent = `
      #_alerta-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        z-index: 99998;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding-top: 32px;
        animation: _alerta-fade-in 0.25s ease;
      }
      @keyframes _alerta-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      #_alerta-box {
        background: #fff;
        border-radius: 12px;
        max-width: 420px;
        width: 90%;
        overflow: hidden;
        box-shadow: 0 8px 40px rgba(0,0,0,0.35);
        animation: _alerta-slide-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
      }
      @keyframes _alerta-slide-in {
        from { transform: translateY(-24px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
      }
      #_alerta-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 16px 20px;
        color: #fff;
        font-family: system-ui, sans-serif;
        font-weight: 700;
        font-size: 15px;
        letter-spacing: 0.01em;
      }
      #_alerta-header span { font-size: 22px; }
      #_alerta-body {
        padding: 18px 20px 20px;
        font-family: system-ui, sans-serif;
        font-size: 14px;
        color: #1f1f1f;
        line-height: 1.6;
      }
      #_alerta-bairro {
        font-weight: 700;
        font-size: 15px;
        margin-bottom: 6px;
        color: #111;
      }
      #_alerta-msg {
        color: #444;
        margin-bottom: 16px;
      }
      #_alerta-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #888;
      }
      #_alerta-fechar {
        background: #111;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 8px 18px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.15s;
      }
      #_alerta-fechar:hover { background: #333; }
    `;
        document.head.appendChild(style);
    }

    // ── Exibe o pop-up ────────────────────────────────────────
    function exibirPopup(alerta) {
        // Remove pop-up anterior se ainda estiver na tela
        const anterior = document.getElementById("_alerta-overlay");
        if (anterior) anterior.remove();

        const estilo = ESTILOS[alerta.nivel] || ESTILOS.amarelo;
        const hora = new Date(alerta.timestamp || Date.now())
            .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        const overlay = document.createElement("div");
        overlay.id = "_alerta-overlay";
        overlay.setAttribute("role", "alertdialog");
        overlay.setAttribute("aria-modal", "true");
        overlay.setAttribute("aria-label", estilo.titulo);

        overlay.innerHTML = `
      <div id="_alerta-box">
        <div id="_alerta-header" style="background:${estilo.fundo}">
          <span aria-hidden="true">${estilo.icone}</span>
          ${estilo.titulo}
        </div>
        <div id="_alerta-body">
          <div id="_alerta-bairro">📍 ${alerta.bairro || "Taubaté"}</div>
          <div id="_alerta-msg">${alerta.mensagem || alerta.evento}</div>
          <div id="_alerta-footer">
            <span>Defesa Civil Taubaté · ${hora}</span>
            <button id="_alerta-fechar">Entendi</button>
          </div>
        </div>
      </div>
    `;

        document.body.appendChild(overlay);

        // Fechar ao clicar no botão
        document.getElementById("_alerta-fechar")
            .addEventListener("click", () => overlay.remove());

        // Fechar ao clicar fora do box
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Fechar com ESC
        document.addEventListener("keydown", function fecharEsc(e) {
            if (e.key === "Escape") {
                overlay.remove();
                document.removeEventListener("keydown", fecharEsc);
            }
        });
    }

    // ── Conexão SSE ───────────────────────────────────────────
    function conectarSSE() {
        const url = `${BACKEND_URL}/alertas/stream`;
        const src = new EventSource(url);

        src.onopen = () => {
            console.info("[Alertas Taubaté] Conectado ao servidor de alertas.");
        };

        src.onmessage = (evento) => {
            try {
                const dados = JSON.parse(evento.data);

                // Ignora heartbeats e mensagem de conexão
                if (dados.tipo !== "alerta") return;

                console.warn("[Alertas Taubaté] Alerta recebido:", dados);
                exibirPopup(dados);

            } catch (e) {
                console.error("[Alertas Taubaté] Erro ao processar evento:", e);
            }
        };

        src.onerror = () => {
            console.warn(`[Alertas Taubaté] Conexão perdida. Tentando em ${RECONNECT_MS / 1000}s...`);
            src.close();
            setTimeout(conectarSSE, RECONNECT_MS);
        };
    }

    // ── Carrega alertas ativos ao abrir a página ──────────────
    // Se já existe um alerta ativo quando o usuário abre o site,
    // ele aparece imediatamente sem precisar esperar o próximo ciclo.
    async function carregarAlertaAtivo() {
        try {
            const resp = await fetch(`${BACKEND_URL}/alertas/ativos`);
            if (!resp.ok) return;
            const alertas = await resp.json();
            if (alertas.length > 0) {
                // Exibe o alerta mais recente
                const mais_recente = alertas[0];
                exibirPopup({
                    tipo: "alerta",
                    nivel: mais_recente.nivel_risco,
                    bairro: mais_recente.bairro,
                    evento: mais_recente.tipo_evento,
                    mensagem: mais_recente.descricao || `Alerta de ${mais_recente.tipo_evento} em ${mais_recente.bairro}.`,
                    timestamp: mais_recente.criado_em,
                });
            }
        } catch (e) {
            // Backend pode estar offline — silencia o erro
        }
    }

    // ── Inicialização ─────────────────────────────────────────
    function init() {
        injetarEstilos();
        carregarAlertaAtivo(); // verifica se já tem alerta ao abrir a página
        conectarSSE();         // escuta novos alertas em tempo real
    }

    // Aguarda o DOM estar pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
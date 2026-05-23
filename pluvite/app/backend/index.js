const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Função auxiliar para deixar apenas números
const apenasNumeros = (str) => str ? str.replace(/\D/g, '') : '';

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    // No Postgres, usamos $1, $2 e nomes de tabelas entre aspas se tiverem maiúsculas
    const sql = 'SELECT id_usuario, tipo_usuario FROM "Usuarios" WHERE email = $1 AND senha = $2';

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error("Erro no Login:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        // No driver 'pg', os resultados ficam dentro de results.rows
        if (results.rows.length > 0) {
            res.json({ tipo: results.rows[0].tipo_usuario, id: results.rows[0].id_usuario });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    });
});

// --- ROTA CADASTRO PREFEITURA ---
app.post('/cadastro-prefeitura', (req, res) => {
    const { nome, email, senha, cargo, re } = req.body;
    
    // O RETURNING id_usuario é necessário para o Postgres nos devolver o ID criado
    const sqlUser = 'INSERT INTO "Usuarios" (email, senha, tipo_usuario) VALUES ($1, $2, \'prefeitura\') RETURNING id_usuario';

    db.query(sqlUser, [email, senha], (err, result) => {
        if (err) {
            console.error("Erro ao criar Usuário Prefeitura:", err);
            return res.status(500).json({ error: "E-mail já cadastrado ou erro de conexão." });
        }
        
        const novoUsuarioId = result.rows[0].id_usuario;
        const sqlPerfil = 'INSERT INTO "Prefeitura" (nome_completo, cargo, re, usuario_id) VALUES ($1, $2, $3, $4)';
        
        db.query(sqlPerfil, [nome, cargo, re, novoUsuarioId], (err2) => {
            if (err2) {
                console.error("Erro ao criar Perfil Prefeitura:", err2);
                return res.status(500).json({ error: "Erro nos dados técnicos (RE já existe?)" });
            }
            res.status(201).json({ message: "Prefeitura cadastrada!" });
        });
    });
});

// --- ROTA CADASTRO CIDADÃO ---    
app.post('/cadastrar-cidadao', (req, res) => {
    const { nome, email, senha, cpf, telefone, bairro, pcd } = req.body;

    const cpfLimpo = apenasNumeros(cpf);
    const telefoneLimpo = apenasNumeros(telefone);

    if (cpfLimpo.length !== 11) {
        return res.status(400).json({ error: "O CPF deve conter exatamente 11 números." });
    }

    const sqlUser = 'INSERT INTO "Usuarios" (email, senha, tipo_usuario) VALUES ($1, $2, \'cidadao\') RETURNING id_usuario';

    db.query(sqlUser, [email, senha], (err, result) => {
        if (err) {
            console.error("Erro ao criar Usuário Cidadão:", err);
            return res.status(500).json({ error: "Este e-mail já está em uso." });
        }

        const novoUsuarioId = result.rows[0].id_usuario;
        const sqlPerfil = 'INSERT INTO "Cidadao" (nome_completo, cpf, telefone, bairro, pcd, usuario_id) VALUES ($1, $2, $3, $4, $5, $6)';
        
        // No Postgres, BOOLEAN aceita true/false diretamente
        db.query(sqlPerfil, [nome, cpfLimpo, telefoneLimpo, bairro, pcd, novoUsuarioId], (err2) => {
            if (err2) {
                console.error("Erro ao criar Perfil Cidadão:", err2);
                return res.status(500).json({ error: "Dados inválidos. Verifique se o CPF já está cadastrado." });
            }
            res.status(201).json({ message: "Cidadão cadastrado!" });
        });
    });
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001 (PostgreSQL)"));
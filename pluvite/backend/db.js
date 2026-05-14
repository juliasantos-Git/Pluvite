const { Pool } = require('pg');

// Configurações do seu novo banco
const db = new Pool({
  user: 'postgres',           // usuário padrão do postgres
  host: 'localhost',          // seu computador
  database: 'ProjetoIntegrador', // o nome que você criou no pgAdmin
  password: 'root',   // coloque aqui a senha que você usa no pgAdmin
  port: 5432,                 // porta padrão do postgres
});

// Testa a conexão assim que o servidor ligar
db.connect()
  .then(() => console.log('✅ Conectado ao PostgreSQL com sucesso!'))
  .catch(err => console.error('❌ Erro ao conectar ao banco:', err));

module.exports = db;
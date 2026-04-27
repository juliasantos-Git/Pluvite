const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // <--- A senha do MySQL deste computador!
  database: 'ProjetoIntegrador'
});

db.connect((err) => {
  if (err) {
      console.error('Erro ao conectar: ' + err.stack);
      return;
  }
  console.log('Conectado ao banco de dados!');
});

module.exports = db;
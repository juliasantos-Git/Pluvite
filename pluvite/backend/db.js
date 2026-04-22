const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sava1t3m', // Coloque a senha do seu MySQL aqui
  database: 'ProjetoIntegrador'
});

connection.connect((err) => {
  if (err) {
      console.error('Erro ao conectar: ' + err.stack);
      return;
  }
  console.log('Conectado ao banco de dados!');
});

module.exports = connection;
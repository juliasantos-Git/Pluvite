USE `ProjetoIntegrador`;

-- Agora podemos apagar tudo sem erros
DROP TABLE IF EXISTS `Alerta`;
DROP TABLE IF EXISTS `Ocorrencia`;
DROP TABLE IF EXISTS `Governo`; -- Tabela antiga
DROP TABLE IF EXISTS `Prefeitura`;
DROP TABLE IF EXISTS `Cidadao`;
DROP TABLE IF EXISTS `Usuarios`;

-- Criar a estrutura inteligente
CREATE TABLE `Usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL UNIQUE,
  `senha` varchar(255) NOT NULL,
  `tipo_usuario` ENUM('cidadao', 'prefeitura') NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Prefeitura` (
  `id_prefeitura` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `re` varchar(20) NOT NULL UNIQUE,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id_prefeitura`),
  CONSTRAINT `fk_prefeitura_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Cidadao` (
  `id_cidadao` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `cpf` char(11) NOT NULL UNIQUE,
  `telefone` varchar(15) NOT NULL,
  `bairro` varchar(50) NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id_cidadao`),
  CONSTRAINT `fk_cidadao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Reativar a segurança
SET FOREIGN_KEY_CHECKS = 1;
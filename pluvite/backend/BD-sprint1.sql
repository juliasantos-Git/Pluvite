-- Tabela principal de Usuários (Login)
CREATE TABLE IF NOT EXISTS `Usuarios` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `tipo_usuario` ENUM('cidadao', 'prefeitura') NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Perfil do Cidadão
CREATE TABLE IF NOT EXISTS `Cidadao` (
  `id_cidadao` INT NOT NULL AUTO_INCREMENT,
  `nome_completo` VARCHAR(150) NOT NULL,
  `cpf` VARCHAR(14) NOT NULL UNIQUE,
  `telefone` VARCHAR(15),
  `bairro` VARCHAR(100),
  `pcd` TINYINT(1) NOT NULL DEFAULT 0,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id_cidadao`),
  CONSTRAINT `fk_cidadao_usuario` FOREIGN KEY (`usuario_id`) 
    REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Perfil da Prefeitura (Servidores)
CREATE TABLE IF NOT EXISTS `Prefeitura` (
  `id_servidor` INT NOT NULL AUTO_INCREMENT,
  `nome_completo` VARCHAR(150) NOT NULL,
  `cargo` VARCHAR(100),
  `re` VARCHAR(20) NOT NULL UNIQUE,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id_servidor`),
  CONSTRAINT `fk_prefeitura_usuario` FOREIGN KEY (`usuario_id`) 
    REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
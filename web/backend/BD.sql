-- Criar Tabela de Usuários
CREATE TABLE "Usuarios" (
  "id_usuario" SERIAL PRIMARY KEY,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "senha" VARCHAR(255) NOT NULL,
  "tipo_usuario" VARCHAR(20) NOT NULL
);

-- Criar Tabela de Cidadão
CREATE TABLE "Cidadao" (
  "id_cidadao" SERIAL PRIMARY KEY,
  "nome_completo" VARCHAR(150) NOT NULL,
  "cpf" VARCHAR(14) NOT NULL UNIQUE,
  "telefone" VARCHAR(15),
  "bairro" VARCHAR(100),
  "pcd" BOOLEAN NOT NULL DEFAULT FALSE,
  "usuario_id" INTEGER NOT NULL,
  CONSTRAINT fk_cidadao_usuario FOREIGN KEY ("usuario_id") 
    REFERENCES "Usuarios" ("id_usuario") ON DELETE CASCADE
);

-- Criar Tabela de Prefeitura
CREATE TABLE "Prefeitura" (
  "id_servidor" SERIAL PRIMARY KEY,
  "nome_completo" VARCHAR(150) NOT NULL,
  "cargo" VARCHAR(100),
  "re" VARCHAR(20) NOT NULL UNIQUE,
  "usuario_id" INTEGER NOT NULL,
  CONSTRAINT fk_prefeitura_usuario FOREIGN KEY ("usuario_id") 
    REFERENCES "Usuarios" ("id_usuario") ON DELETE CASCADE
);
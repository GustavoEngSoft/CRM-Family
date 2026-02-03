-- Habilita extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Pessoas
CREATE TABLE IF NOT EXISTS pessoas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  data_nascimento DATE,
  tags TEXT[],
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Comunicação
CREATE TABLE IF NOT EXISTS comunicacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pessoa_id UUID NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- email, sms, chamada, mensagem
  assunto VARCHAR(255),
  mensagem TEXT,
  data_comunicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  proxima_acao DATE,
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, realizada, cancelada
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Acompanhamento
CREATE TABLE IF NOT EXISTS acompanhamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pessoa_id UUID NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'aberto', -- aberto, em_progresso, fechado
  prioridade VARCHAR(20) DEFAULT 'media', -- baixa, media, alta
  data_inicio DATE,
  data_fim DATE,
  responsavel VARCHAR(255),
  resultado TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Usuários (para Login)
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(50) DEFAULT 'user', -- admin, gerente, user
  ativo BOOLEAN DEFAULT true,
  ultimo_acesso TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Relatórios
CREATE TABLE IF NOT EXISTS relatorios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL, -- pessoas, comunicacoes, acompanhamentos
  parametros JSONB,
  usuario_id UUID REFERENCES usuarios(id),
  data_geracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_pessoas_email ON pessoas(email);
CREATE INDEX idx_pessoas_cpf ON pessoas(cpf);
CREATE INDEX idx_comunicacoes_pessoa ON comunicacoes(pessoa_id);
CREATE INDEX idx_acompanhamentos_pessoa ON acompanhamentos(pessoa_id);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- Adiciona coluna tipo à tabela acompanhamentos
ALTER TABLE acompanhamentos 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'geral';

-- Atualiza comentário da coluna
COMMENT ON COLUMN acompanhamentos.tipo IS 'Tipo de acompanhamento: visita, reuniao, contato, geral, etc';

-- Cria índice para melhorar performance de queries filtradas por tipo
CREATE INDEX IF NOT EXISTS idx_acompanhamentos_tipo ON acompanhamentos(tipo);

-- Cria índice composto para queries de dashboard (tipo + status + data)
CREATE INDEX IF NOT EXISTS idx_acompanhamentos_tipo_status_data 
ON acompanhamentos(tipo, status, created_at);

# Como Aplicar a Migração - Tipo de Acompanhamento

## Passo a Passo

### 1. Execute a migração no banco de dados

Conecte-se ao seu banco PostgreSQL e execute o arquivo de migração:

```sql
-- Execute este SQL no seu banco de dados PostgreSQL
-- Arquivo: backend/src/database/migrations/add_tipo_to_acompanhamentos.sql

ALTER TABLE acompanhamentos 
ADD COLUMN IF NOT EXISTS tipo VARCHAR(50) DEFAULT 'geral';

COMMENT ON COLUMN acompanhamentos.tipo IS 'Tipo de acompanhamento: visita, reuniao, contato, geral, etc';

CREATE INDEX IF NOT EXISTS idx_acompanhamentos_tipo ON acompanhamentos(tipo);

CREATE INDEX IF NOT EXISTS idx_acompanhamentos_tipo_status_data 
ON acompanhamentos(tipo, status, created_at);
```

### 2. Reinicie o backend

Após executar a migração, reinicie o servidor backend para que as alterações sejam aplicadas.

### 3. Como usar

Agora, quando você criar ou editar uma tarefa na tela de Acompanhamento:

1. Você verá um novo campo **"Tipo de Tarefa"** com as seguintes opções:
   - 📋 Geral (padrão)
   - 🏠 Visita
   - 👥 Reunião
   - 📞 Contato
   - 📊 Acompanhamento

2. Quando uma tarefa do tipo **Visita** for arrastada para a coluna **Concluído**, ela automaticamente contará no card "Visitas Realizadas" no Dashboard

3. O card do Dashboard mostrará:
   - Total de visitas realizadas **no mês atual**
   - Crescimento em relação ao mês anterior

### 4. Verificação

Para verificar se a migração foi aplicada corretamente:

```sql
-- Verifique se a coluna foi adicionada
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'acompanhamentos' AND column_name = 'tipo';
```

### Exemplo de uso via psql

```bash
# Conecte ao banco
psql -U seu_usuario -d nome_do_banco

# Execute a migração
\i backend/src/database/migrations/add_tipo_to_acompanhamentos.sql

# Verifique
\d acompanhamentos
```

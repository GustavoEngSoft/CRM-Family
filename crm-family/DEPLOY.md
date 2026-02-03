# CRM Family - Instruções de Deploy

## 🚀 Deploy do Projeto Completo

### Pré-requisitos
- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local)

### 1. Iniciar o Projeto

```bash
# Clone o repositório (se necessário)
cd C:\Users\cdf09\CRM-Family\crm-family

# Configure o arquivo .env na raiz (opcional, usa valores padrão)
cp .env.example .env

# Inicie os containers (Backend + PostgreSQL)
docker-compose up -d

# Aguarde os containers subirem (10-15 segundos)
docker-compose logs -f backend
# Aguarde ver: "🚀 Servidor rodando na porta 3001"
```

### 2. Popular o Banco de Dados (Opcional)

```bash
# Seed com dados de exemplo
docker-compose exec backend npm run db:seed
```

### 3. Instalar dependências do Frontend

```bash
# Se ainda não instalou
npm install
```

### 4. Iniciar o Frontend

```bash
npm start
```

Acesse: http://localhost:3000

### 5. Primeiro Acesso

**Criar usuário via API:**

```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3002/api/login/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"nome":"Admin CRM","email":"admin@crm.com","senha":"admin123"}'
```

Ou use qualquer cliente HTTP (Postman, Insomnia, etc.)

**Fazer Login:**
- Email: `admin@crm.com`
- Senha: `admin123`

## 📊 Acessando o Banco de Dados

### Via DBeaver
- Host: `localhost`
- Porta: `5433`
- Database: `crm_family`
- Username: `crm_user`
- Password: `crm_password_secure`

### Via Terminal (psql)

```bash
docker-compose exec postgres psql -U crm_user -d crm_family

# Comandos úteis:
\dt              # Listar tabelas
\d pessoas       # Descrever tabela pessoas
SELECT * FROM pessoas LIMIT 10;
SELECT * FROM usuarios;
```

## 🛠️ Comandos Úteis

### Docker

```bash
# Ver logs do backend
docker-compose logs -f backend

# Ver logs do banco
docker-compose logs -f postgres

# Restart dos serviços
docker-compose restart

# Parar tudo
docker-compose down

# Parar e remover volumes (⚠️ APAGA DADOS)
docker-compose down -v

# Rebuild das imagens
docker-compose up --build
```

### Backend

```bash
# Executar comando no container
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed

# Entrar no container
docker-compose exec backend sh
```

### Desenvolvimento

```bash
# Frontend (modo desenvolvimento)
npm start

# Build para produção
npm run build

# Instalar dependências do backend (dentro do container)
docker-compose exec backend npm install <pacote>
```

## 🔍 Testando as APIs

### Health Check

```bash
curl http://localhost:3002/health
```

### Criar Usuário

```bash
curl -X POST http://localhost:3002/api/login/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456"}'
```

### Login

```bash
curl -X POST http://localhost:3002/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@email.com","senha":"123456"}'
```

Copie o `token` da resposta.

### Listar Pessoas (com autenticação)

```bash
curl http://localhost:3002/api/pessoas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Pessoa

```bash
curl -X POST http://localhost:3002/api/pessoas \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"João Silva",
    "email":"joao@email.com",
    "telefone":"(11) 98765-4321",
    "tags":["Membro","Voluntário"]
  }'
```

## ⚡ Performance e Monitoramento

### Ver uso de recursos

```bash
docker stats
```

### Ver espaço em disco

```bash
docker system df
```

### Limpar recursos não usados

```bash
docker system prune
```

## 🐛 Troubleshooting

### Porta 3002 já em uso

```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Ou mude a porta no docker-compose.yml
```

### Erro de conexão com banco

```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps

# Veja os logs
docker-compose logs postgres

# Restart
docker-compose restart postgres
```

### Frontend não conecta ao backend

Verifique se a URL da API está correta em `src/services/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';
```

### Erro "Token inválido"

O token JWT expira em 7 dias. Faça login novamente.

```javascript
// No console do navegador
localStorage.clear();
// Faça login novamente
```

## 📦 Estrutura de Volumes Docker

```
volumes/
└── postgres_data/     # Dados do PostgreSQL persistentes
```

Os dados do banco são persistidos mesmo após `docker-compose down`.

Para apagar tudo e começar do zero:

```bash
docker-compose down -v
docker-compose up -d
```

## 🔐 Segurança em Produção

**⚠️ IMPORTANTE: Antes de fazer deploy em produção:**

1. Mude as senhas no `.env`:
```env
DB_PASSWORD=senha_forte_aqui
JWT_SECRET=chave_secreta_forte_aqui
```

2. Configure HTTPS

3. Use um reverse proxy (nginx)

4. Configure CORS adequadamente

5. Ative rate limiting

6. Configure backups automáticos do banco

7. Use secrets management (AWS Secrets, Azure Key Vault, etc.)

## 📞 Suporte

Para problemas ou dúvidas, verifique:
1. Logs do Docker: `docker-compose logs`
2. Console do navegador (F12)
3. Network tab do DevTools
4. README_BACKEND.md para detalhes do backend
5. INTEGRACAO.md para detalhes das APIs

---

**Última atualização**: 02/02/2026

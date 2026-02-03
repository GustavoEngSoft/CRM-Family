# CRM Family - Backend

Backend profissional dockerizado para o CRM Family, construído com Node.js, Express e PostgreSQL.

## 🚀 Tecnologias

- **Node.js 20** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL 16** - Banco de dados
- **Docker & Docker Compose** - Containerização
- **UUID** - Identificadores únicos
- **CORS** - Controle de acesso

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/          # Lógica de negócios
│   │   ├── pessoas.controller.js
│   │   ├── comunicacao.controller.js
│   │   ├── acompanhamento.controller.js
│   │   ├── login.controller.js
│   │   └── relatorios.controller.js
│   ├── routes/              # Definição de rotas
│   │   ├── pessoas.routes.js
│   │   ├── comunicacao.routes.js
│   │   ├── acompanhamento.routes.js
│   │   ├── login.routes.js
│   │   └── relatorios.routes.js
│   ├── database/            # Configuração do banco
│   │   ├── connection.js    # Pool de conexões
│   │   ├── init.sql         # Schema inicial
│   │   ├── migrations/      # Scripts de migração
│   │   └── seeds/           # Dados iniciais
│   └── server.js            # Entrada da aplicação
├── Dockerfile               # Imagem Docker
├── docker-compose.yml       # Orquestração
├── .env.example             # Variáveis de ambiente
└── package.json             # Dependências
```

## 🛠️ Instalação e Execução

### Com Docker (Recomendado)

1. **Clone o repositório**
```bash
cd crm-family
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

3. **Inicie os containers**
```bash
docker-compose up -d
```

4. **Execute as migrations (opcional)**
```bash
docker-compose exec backend npm run db:migrate
```

5. **Populate dados iniciais (opcional)**
```bash
docker-compose exec backend npm run db:seed
```

6. **Acesse a API**
```
http://localhost:3001
```

### Sem Docker (Desenvolvimento Local)

1. **Instale as dependências**
```bash
cd backend
npm install
```

2. **Configure PostgreSQL**
- Crie um banco de dados chamado `crm_family`
- Configure as credenciais no `.env`

3. **Configure variáveis de ambiente**
```bash
cp .env.example .env
# Edite o .env com suas configurações locais
```

4. **Execute as migrations**
```bash
npm run db:migrate
```

5. **Inicie o servidor**
```bash
npm run dev  # Com nodemon (desenvolvimento)
npm start    # Produção
```

## 📚 Endpoints da API

### Health Check
```
GET /health
```

### Pessoas
```
GET    /api/pessoas                      # Listar pessoas (com paginação)
GET    /api/pessoas/:id                  # Obter pessoa específica
GET    /api/pessoas/tag/:tag             # Obter pessoas por tag
POST   /api/pessoas                      # Criar pessoa
PUT    /api/pessoas/:id                  # Atualizar pessoa
DELETE /api/pessoas/:id                  # Deletar pessoa (soft delete)
```

### Comunicação
```
GET    /api/comunicacao                  # Listar comunicações
GET    /api/comunicacao/:id              # Obter comunicação específica
GET    /api/comunicacao/pessoa/:pessoaId # Obter comunicações de uma pessoa
POST   /api/comunicacao                  # Criar comunicação
PUT    /api/comunicacao/:id              # Atualizar comunicação
DELETE /api/comunicacao/:id              # Deletar comunicação
```

### Acompanhamento
```
GET    /api/acompanhamento               # Listar acompanhamentos
GET    /api/acompanhamento/:id           # Obter acompanhamento específico
GET    /api/acompanhamento/pessoa/:pessoaId # Acompanhamentos de uma pessoa
POST   /api/acompanhamento               # Criar acompanhamento
PUT    /api/acompanhamento/:id           # Atualizar acompanhamento
DELETE /api/acompanhamento/:id           # Deletar acompanhamento
```

### Login/Autenticação
```
POST   /api/login                        # Realizar login
POST   /api/login/register               # Registrar novo usuário
GET    /api/login/:id                    # Obter dados do usuário
PUT    /api/login/:id                    # Atualizar usuário
```

### Relatórios
```
GET    /api/relatorios                   # Listar relatórios
GET    /api/relatorios/:id               # Obter relatório específico
POST   /api/relatorios                   # Criar relatório
POST   /api/relatorios/generate/pessoas  # Gerar relatório de pessoas
POST   /api/relatorios/generate/comunicacoes # Gerar relatório de comunicações
POST   /api/relatorios/generate/acompanhamentos # Gerar relatório de acompanhamentos
DELETE /api/relatorios/:id               # Deletar relatório
```

## 📊 Modelo de Dados

### Tabelas

#### pessoas
- id (UUID)
- nome (VARCHAR)
- email (VARCHAR)
- telefone (VARCHAR)
- cpf (VARCHAR)
- endereco (TEXT)
- cidade (VARCHAR)
- estado (VARCHAR)
- cep (VARCHAR)
- data_nascimento (DATE)
- tags (TEXT[])
- observacoes (TEXT)
- ativo (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

#### comunicacoes
- id (UUID)
- pessoa_id (FK)
- tipo (VARCHAR) - email, sms, chamada, mensagem
- assunto (VARCHAR)
- mensagem (TEXT)
- data_comunicacao (TIMESTAMP)
- proxima_acao (DATE)
- status (VARCHAR) - pendente, realizada, cancelada
- created_at, updated_at (TIMESTAMP)

#### acompanhamentos
- id (UUID)
- pessoa_id (FK)
- titulo (VARCHAR)
- descricao (TEXT)
- status (VARCHAR) - aberto, em_progresso, fechado
- prioridade (VARCHAR) - baixa, media, alta
- data_inicio (DATE)
- data_fim (DATE)
- responsavel (VARCHAR)
- resultado (TEXT)
- created_at, updated_at (TIMESTAMP)

#### usuarios
- id (UUID)
- nome (VARCHAR)
- email (VARCHAR)
- senha (VARCHAR)
- perfil (VARCHAR) - admin, gerente, user
- ativo (BOOLEAN)
- ultimo_acesso (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)

#### relatorios
- id (UUID)
- titulo (VARCHAR)
- descricao (TEXT)
- tipo (VARCHAR)
- parametros (JSONB)
- usuario_id (FK)
- data_geracao (TIMESTAMP)
- created_at (TIMESTAMP)

## 🔐 Segurança (TODO)

- [ ] Implementar autenticação JWT
- [ ] Hash de senhas com bcrypt
- [ ] Validação de entrada
- [ ] Rate limiting
- [ ] HTTPS em produção
- [ ] Variáveis de ambiente para secrets
- [ ] CORS configurável por ambiente

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
```bash
# Verifique se os containers estão rodando
docker-compose ps

# Veja os logs
docker-compose logs postgres
docker-compose logs backend
```

### Porta já em uso
```bash
# Mude as portas no docker-compose.yml
# ou mate o processo
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

### Rebuild da imagem
```bash
docker-compose up --build
```

## 📝 Comandos Úteis

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Ver logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Executar comando no backend
docker-compose exec backend npm run db:migrate

# Entrar no container do banco
docker-compose exec postgres psql -U crm_user -d crm_family

# Remover volumes (cuidado!)
docker-compose down -v
```

## 🚀 Deploy em Produção

1. Atualize as variáveis de ambiente em `.env`
2. Configure HTTPS
3. Implemente autenticação JWT
4. Use um reverse proxy (nginx)
5. Configure backups automáticos do banco
6. Monitore logs e performance

## 📧 Próximos Passos

- Adicionar autenticação JWT
- Implementar validação de dados robusta
- Adicionar testes automatizados
- Configurar CI/CD
- Documentação OpenAPI/Swagger
- Implementar caching com Redis (opcional)
- Logs estruturados com Winston/Pino

---

**Desenvolvido com ❤️ para CRM Family**

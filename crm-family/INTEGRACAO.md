# Integração Frontend-Backend - CRM Family

## ✅ Implementações Concluídas

### 1. Backend com Autenticação
- ✅ JWT e bcrypt implementados
- ✅ Middleware de autenticação criado
- ✅ Login retorna token JWT
- ✅ Todas as rotas protegidas (exceto login/register)

### 2. Frontend - Serviços API
- ✅ Arquivo `src/services/api.js` criado com todos os endpoints
- ✅ Gerenciamento automático de tokens (localStorage)
- ✅ Headers de autenticação automáticos
- ✅ Tratamento de erros padronizado

### 3. Context de Autenticação
- ✅ `src/contexts/AuthContext.js` criado
- ✅ Hooks `useAuth()` disponível em toda aplicação
- ✅ Gerenciamento de estado do usuário logado

### 4. Telas Integradas
- ✅ **Login**: Autenticação funcional com backend
- ✅ **Pessoas**: Lista pessoas do banco, contagem de tags dinâmica
- ✅ **PessoasPorTag**: Filtra pessoas por tag, edição via API

### 5. Telas Parcialmente Integradas (próximos passos)
- 🔄 **Comunicação**: Estrutura pronta, precisa conectar aos endpoints
- 🔄 **Acompanhamento**: Estrutura pronta, precisa conectar aos endpoints
- 🔄 **Relatórios**: Estrutura pronta, precisa conectar aos endpoints

## 📝 Como Usar as APIs

### Autenticação

```javascript
import { useAuth } from '../contexts/AuthContext';

function MeuComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login('email@example.com', 'senha123');
    if (result.success) {
      // Login bem sucedido
      navigate('/dashboard');
    } else {
      // Erro no login
      alert(result.error);
    }
  };

  return (
    <div>
      {isAuthenticated() ? (
        <p>Olá, {user.nome}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Pessoas API

```javascript
import { PessoasAPI } from '../services/api';

// Listar pessoas (com paginação)
const response = await PessoasAPI.list(page, limit);
// response = { data: [], pagination: { page, limit, total, pages } }

// Buscar por tag
const pessoas = await PessoasAPI.getByTag('Membros');

// Criar pessoa
const novaPessoa = await PessoasAPI.create({
  nome: 'João Silva',
  email: 'joao@email.com',
  telefone: '(11) 98765-4321',
  tags: ['Membro', 'Voluntário']
});

// Atualizar pessoa
await PessoasAPI.update(id, { telefone: 'novo telefone' });

// Deletar pessoa (soft delete)
await PessoasAPI.delete(id);
```

### Comunicação API

```javascript
import { ComunicacaoAPI } from '../services/api';

// Criar comunicação
const comunicacao = await ComunicacaoAPI.create({
  pessoa_id: 'uuid-da-pessoa',
  tipo: 'email',
  assunto: 'Bem-vindo',
  mensagem: 'Olá! Bem-vindo à nossa comunidade',
  status: 'pendente'
});

// Listar comunicações de uma pessoa
const historico = await ComunicacaoAPI.getByPessoa(pessoaId);

// Atualizar status
await ComunicacaoAPI.update(id, { status: 'enviado' });
```

### Acompanhamento API

```javascript
import { AcompanhamentoAPI } from '../services/api';

// Criar acompanhamento
const acomp = await AcompanhamentoAPI.create({
  pessoa_id: 'uuid-da-pessoa',
  titulo: 'Visita inicial',
  descricao: 'Primeira visita à família',
  status: 'aberto',
  prioridade: 'alta'
});

// Listar todos
const acompanhamentos = await AcompanhamentoAPI.list();

// Atualizar status
await AcompanhamentoAPI.update(id, { 
  status: 'concluído',
  resultado: 'Visita realizada com sucesso'
});
```

### Relatórios API

```javascript
import { RelatoriosAPI } from '../services/api';

// Gerar relatório de pessoas
const relatorio = await RelatoriosAPI.generatePessoas({
  tags: 'Membros'
});
// Retorna: { id, tipo: 'pessoas', total, data: [...] }

// Gerar relatório de comunicações
const relCom = await RelatoriosAPI.generateComunicacoes({
  status: 'enviado',
  tipo: 'email'
});

// Gerar relatório de acompanhamentos
const relAcomp = await RelatoriosAPI.generateAcompanhamentos({
  status: 'concluído'
});
```

## 🔧 Próximos Passos para Completar Integração

### 1. Comunicação Component

```javascript
// No useEffect, carregar dados do backend
useEffect(() => {
  loadComunicacoes();
}, []);

const loadComunicacoes = async () => {
  const response = await ComunicacaoAPI.list();
  setHistorico(response.data);
};

// No handleEnviarMensagem
const handleEnviarMensagem = async () => {
  try {
    await ComunicacaoAPI.create({
      pessoa_id: pessoaId, // precisa selecionar pessoa
      tipo: mensagem.tipo,
      assunto: mensagem.assunto,
      mensagem: mensagem.conteudo
    });
    alert('Mensagem enviada!');
    loadComunicacoes();
  } catch (err) {
    alert('Erro: ' + err.message);
  }
};
```

### 2. Acompanhamento Component

```javascript
// Carregar do banco
useEffect(() => {
  loadAcompanhamentos();
}, []);

const loadAcompanhamentos = async () => {
  const response = await AcompanhamentoAPI.list();
  // Organizar por status em colunas
  const todo = response.data.filter(a => a.status === 'aberto');
  const doing = response.data.filter(a => a.status === 'em_progresso');
  const done = response.data.filter(a => a.status === 'fechado');
  setColumns({ todo: { items: todo }, doing: { items: doing }, done: { items: done } });
};

// Ao mover card, atualizar no backend
const handleDrop = async (toColumn, item) => {
  const statusMap = {
    todo: 'aberto',
    doing: 'em_progresso',
    done: 'fechado'
  };
  await AcompanhamentoAPI.update(item.id, { status: statusMap[toColumn] });
};
```

### 3. Relatórios Component

```javascript
// Ao mudar de tab, gerar relatório
useEffect(() => {
  generateReport();
}, [activeTab]);

const generateReport = async () => {
  setLoading(true);
  try {
    let data;
    if (activeTab === 'membros') {
      data = await RelatoriosAPI.generatePessoas({ tags: 'Membros' });
      setMembros(data.data);
    } else if (activeTab === 'visitantes') {
      data = await RelatoriosAPI.generatePessoas({ tags: 'Visitantes' });
      setVisitantes(data.data);
    }
    // ... etc
  } finally {
    setLoading(false);
  }
};
```

## 🚀 Como Testar

### 1. Inicie o Backend
```bash
docker-compose up -d
```

### 2. Crie um Usuário de Teste (via terminal no container)
```bash
docker-compose exec backend npm run db:seed
```

Ou via API diretamente:
```bash
curl -X POST http://localhost:3002/api/login/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@crm.com","senha":"123456"}'
```

### 3. Inicie o Frontend
```bash
npm start
```

### 4. Faça Login
- Email: `admin@crm.com`
- Senha: `123456`

### 5. Teste as Funcionalidades
- ✅ Login funciona
- ✅ Navegar para Pessoas/Tags
- ✅ Ver contagem dinâmica
- ✅ Clicar em uma tag para ver pessoas
- ✅ Editar uma pessoa

## 📡 Endpoints Disponíveis

### Autenticação
- `POST /api/login` - Login
- `POST /api/login/register` - Registro

### Pessoas
- `GET /api/pessoas` - Listar (paginado)
- `GET /api/pessoas/:id` - Buscar por ID
- `GET /api/pessoas/tag/:tag` - Buscar por tag
- `POST /api/pessoas` - Criar
- `PUT /api/pessoas/:id` - Atualizar
- `DELETE /api/pessoas/:id` - Deletar

### Comunicação
- `GET /api/comunicacao` - Listar
- `GET /api/comunicacao/pessoa/:pessoaId` - Por pessoa
- `POST /api/comunicacao` - Criar
- `PUT /api/comunicacao/:id` - Atualizar
- `DELETE /api/comunicacao/:id` - Deletar

### Acompanhamento
- `GET /api/acompanhamento` - Listar
- `GET /api/acompanhamento/pessoa/:pessoaId` - Por pessoa
- `POST /api/acompanhamento` - Criar
- `PUT /api/acompanhamento/:id` - Atualizar
- `DELETE /api/acompanhamento/:id` - Deletar

### Relatórios
- `POST /api/relatorios/generate/pessoas` - Gerar relatório de pessoas
- `POST /api/relatorios/generate/comunicacoes` - Gerar relatório de comunicações
- `POST /api/relatorios/generate/acompanhamentos` - Gerar relatório de acompanhamentos

## 🔒 Segurança

- Todas as rotas (exceto login/register) requerem token JWT
- Token é enviado automaticamente no header `Authorization: Bearer <token>`
- Token expira em 7 dias
- Senhas são hasheadas com bcrypt (10 rounds)

## 🎯 Estrutura Final

```
src/
├── services/
│   └── api.js                 # ✅ Todos os endpoints
├── contexts/
│   └── AuthContext.js         # ✅ Gerenciamento de auth
├── componentes/
│   ├── Login/
│   │   └── login.js           # ✅ Integrado
│   ├── Pessoas/
│   │   └── pessoas.js         # ✅ Integrado
│   ├── PessoasPorTag/
│   │   └── pessoasPorTag.js   # ✅ Integrado
│   ├── Comunicacao/
│   │   └── comunicacao.js     # 🔄 Pronto para integrar
│   ├── Acompanhamento/
│   │   └── acompanhamento.js  # 🔄 Pronto para integrar
│   └── Relatorios/
│       └── relatorios.js      # 🔄 Pronto para integrar
```

---

**Status**: Backend 100% funcional, Frontend com 3 telas integradas + estrutura completa para integrar as demais.

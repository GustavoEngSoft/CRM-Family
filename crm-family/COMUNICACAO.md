# 📧 Configuração da Tela de Comunicação

## Visão Geral

A tela de **Comunicação** foi completamente implementada com suporte para:
- ✉️ **Email** - Envio de emails via SMTP
- 💬 **WhatsApp** - Envio de mensagens via Twilio
- 📝 **Modelos** - Criação e reutilização de templates
- 📊 **Histórico** - Registro de todas as mensagens enviadas

## Arquitetura

### Frontend (`src/componentes/Comunicacao/`)

#### `comunicacao.js` (471 linhas)
Componente React com funcionalidade completa:

**Tabs:**
1. **Enviar Mensagem**
   - Seletor de tipo (Email/WhatsApp)
   - Dropdown de pessoas (carregado da API)
   - Campos condicionais:
     - Email: Assunto + Corpo
     - WhatsApp: Telefone + Corpo
   - Integração com APIs de envio

2. **Modelos**
   - Criar novos modelos
   - Aplicar modelo ao formulário
   - Deletar modelos

3. **Histórico**
   - Tabela com todas as mensagens
   - Tipo, destinatário, assunto, data, status
   - Ação de deletar

**Estado:**
```javascript
const [mensagem, setMensagem] = useState({
  pessoa_id: '',
  tipo: 'email',        // 'email' ou 'whatsapp'
  assunto: '',          // Apenas para email
  corpo: '',
  telefone: ''          // Apenas para WhatsApp
});
```

**Integração API:**
```javascript
// Enviar Email
await fetch('http://localhost:3002/api/email/enviar', {
  method: 'POST',
  body: JSON.stringify({
    para: emailPessoa,
    assunto: mensagem.assunto,
    corpo: mensagem.corpo
  })
});

// Enviar WhatsApp
await fetch('http://localhost:3002/api/whatsapp/enviar', {
  method: 'POST',
  body: JSON.stringify({
    telefone: mensagem.telefone,
    mensagem: mensagem.corpo
  })
});

// Salvar no histórico
await ComunicacaoAPI.create({
  pessoa_id: mensagem.pessoa_id,
  tipo: mensagem.tipo,
  assunto: mensagem.assunto,
  corpo: mensagem.corpo,
  status: 'enviado'
});
```

#### `comunicacao.css` (900+ linhas)
Estilos completos com:
- Layout responsivo
- Animações suaves
- Cores consistentes (tema laranja #ff7a45)
- Tabelas e grids
- States de loading/sucesso/erro

### Backend

#### Rotas Novas

**`routes/email.routes.js`**
```
POST /api/email/enviar
├── Requer: autenticação JWT
├── Body: { para, assunto, corpo }
└── Response: { success, messageId }
```

**`routes/whatsapp.routes.js`**
```
POST /api/whatsapp/enviar
├── Requer: autenticação JWT
├── Body: { telefone, mensagem }
└── Response: { success, messageSid }
```

#### Controllers Novos

**`controllers/email.controller.js`**
- Usa `nodemailer` para envio de emails
- Suporta SMTP configurável
- Modo simulação se SMTP não estiver configurado
- HTML templates automáticos

**`controllers/whatsapp.controller.js`**
- Usa `twilio` SDK para envio de WhatsApp
- Modo simulação se Twilio não estiver configurado
- Formatação automática de números de telefone

## Configuração

### 1. Backend - Dependências

As novas dependências foram adicionadas ao `backend/package.json`:

```json
{
  "dependencies": {
    "nodemailer": "^6.9.7",
    "twilio": "^4.10.0"
  }
}
```

Para instalar:
```bash
cd backend
npm install
```

### 2. Variáveis de Ambiente

Adicione ao arquivo `.env` do backend:

#### Email (SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app
SMTP_FROM=seu_email@gmail.com
```

**Como obter credenciais do Gmail:**
1. Acesse [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecione "Mail" e "Windows Computer" (ou seu device)
3. Copie a senha gerada e cole em `SMTP_PASSWORD`

#### WhatsApp (Twilio)
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=auth_token_aqui
TWILIO_PHONE_NUMBER=+1234567890
```

**Como obter credenciais do Twilio:**
1. Acesse [https://console.twilio.com](https://console.twilio.com)
2. Crie uma conta ou faça login
3. Vá para "Messaging" > "Services"
4. Crie um novo serviço WhatsApp
5. Copie o Account SID e Auth Token
6. Configure um número de telefone

### 3. Database

A tabela `comunicacoes` já está criada:

```sql
CREATE TABLE comunicacoes (
  id UUID PRIMARY KEY,
  pessoa_id UUID REFERENCES pessoas(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- 'email' ou 'whatsapp'
  assunto VARCHAR(255),
  corpo TEXT,
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'enviado', 'erro'
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_comunicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Fluxo de Uso

### 1. Enviar Email

**Frontend:**
```javascript
const [mensagem, setMensagem] = useState({
  pessoa_id: '123',
  tipo: 'email',
  assunto: 'Olá',
  corpo: 'Conteúdo do email'
});

await handleEnviarMensagem();
```

**Backend:**
1. `POST /api/email/enviar`
2. Nodemailer conecta ao SMTP
3. Email é enviado
4. Resposta sucesso/erro é retornada

**Database:**
- Registro criado em `comunicacoes` com `status: 'enviado'`

### 2. Enviar WhatsApp

**Frontend:**
```javascript
const [mensagem, setMensagem] = useState({
  pessoa_id: '123',
  tipo: 'whatsapp',
  telefone: '+5585987654321',
  corpo: 'Olá!'
});

await handleEnviarMensagem();
```

**Backend:**
1. `POST /api/whatsapp/enviar`
2. Twilio SDK envia mensagem
3. Resposta com SID é retornada

**Database:**
- Registro criado em `comunicacoes` com `status: 'enviado'`

## Modo Simulação

Se as credenciais não estiverem configuradas:

✅ **Email sem SMTP configurado:**
```
⚠️ SMTP não configurado. Modo simulação ativado.
```
- Mensagem é logada no console
- Retorna sucesso (para testes)

✅ **WhatsApp sem Twilio configurado:**
```
⚠️ Twilio não configurado. Modo simulação ativado.
```
- Mensagem é logada no console
- Retorna sucesso (para testes)

Isso permite desenvolver e testar sem configurar credenciais reais!

## Testando

### 1. Com Docker

```bash
# Instalar novas dependências
docker-compose exec backend npm install

# Reiniciar container
docker-compose restart backend
```

### 2. Acessar a Interface

```
http://localhost:3000/comunicacao
```

### 3. Testar Envio

1. Acesse a aba "Enviar mensagem"
2. Selecione o tipo (Email ou WhatsApp)
3. Escolha um destinatário
4. Preencha os campos específicos
5. Clique em "Enviar"
6. Verifique o histórico

### 4. Verificar Logs

```bash
# Ver logs do backend
docker-compose logs -f backend

# Procurar por:
# ✉️ Email enviado com sucesso
# 💬 WhatsApp enviado com sucesso
# ⚠️ Modo simulação
```

## Tratamento de Erros

### Email

| Erro | Causa | Solução |
|------|-------|---------|
| SMTP not configured | Variáveis não definidas | Adicionar ao .env |
| Authentication failed | Credenciais incorretas | Verificar Gmail app password |
| Invalid email | Email inválido | Validar formato |
| Timeout | Rede lenta | Aumentar timeout |

### WhatsApp

| Erro | Causa | Solução |
|------|-------|---------|
| Twilio not configured | Variáveis não definidas | Adicionar ao .env |
| Invalid phone number | Formato errado | Usar +55XXXXXXXXXXX |
| Quota exceeded | Limite do Twilio | Verificar plano |
| Invalid credentials | SID/Token errado | Copiar do console Twilio |

## Recurso em Destaque: Modelos

A tela inclui um sistema de templates reutilizáveis:

1. **Criar Modelo:**
   - Nome: "Boas-vindas"
   - Conteúdo: "Olá {{nome}}, bem-vindo ao CRM Family!"

2. **Aplicar Modelo:**
   - Clique em "Usar" no modelo
   - Conteúdo é carregado no formulário
   - Edite conforme necessário

3. **Deletar Modelo:**
   - Clique no ícone de lixo
   - Modelo é removido (apenas frontend por enquanto)

## Próximos Passos

1. **Variáveis Dinâmicas:**
   - Implementar {{pessoa.nome}}, {{data}}, etc.

2. **Agendamento:**
   - Agendar envios para horário específico

3. **Análise:**
   - Relatório de emails/mensagens por tipo
   - Taxa de entrega
   - Rastreamento de leitura

4. **Integração com IA:**
   - Geração automática de conteúdo
   - Tradução de mensagens

## Suporte

Para dúvidas ou problemas:

1. Verifique os logs: `docker-compose logs backend`
2. Confirme variáveis de ambiente: `.env`
3. Teste credenciais manualmente
4. Consulte documentação oficial:
   - [Nodemailer](https://nodemailer.com/)
   - [Twilio](https://www.twilio.com/docs)

---

**Status:** ✅ Implementado e pronto para uso!

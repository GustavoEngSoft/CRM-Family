# 🚀 Guia de Configuração Rápida - Comunicação

## Resumo do que foi implementado

✅ **Frontend Comunicacao Component**
- Componente React completo (471 linhas)
- 3 abas: Enviar, Modelos, Histórico
- Suporte para Email e WhatsApp
- Integração com base de dados
- Estilos profissionais (900+ linhas CSS)

✅ **Backend Email & WhatsApp**
- Rotas: `/api/email/enviar` e `/api/whatsapp/enviar`
- Controllers com suporte a SMTP (nodemailer) e Twilio
- Modo simulação automático se credenciais não estiverem configuradas
- Tratamento de erros robusto

✅ **Documentação Completa**
- `COMUNICACAO.md` - Documentação técnica detalhada
- `.env.example` - Atualizado com todas as variáveis

## 1️⃣ Instalação Rápida (5 minutos)

### Passo 1: Instalar dependências do backend

```bash
cd backend
npm install nodemailer twilio
```

Ou atualize o package.json e execute:
```bash
npm install
```

### Passo 2: Configurar variáveis de ambiente

Crie/atualize o arquivo `.env` na pasta `backend/`:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=crm_family
DB_USER=crm_user
DB_PASSWORD=crm_password_secure

# Server
PORT=3002
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (opcional - funciona sem)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app
SMTP_FROM=seu_email@gmail.com

# WhatsApp (opcional - funciona sem)
TWILIO_ACCOUNT_SID=seu_account_sid
TWILIO_AUTH_TOKEN=seu_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Passo 3: Reiniciar o backend

Se estiver usando Docker:
```bash
docker-compose restart backend
```

Se estiver rodando localmente:
```bash
npm run dev
```

## 2️⃣ Testar a Implementação

### Sem Configurar Email/WhatsApp (Modo Simulação)

1. Abra http://localhost:3000/comunicacao
2. Clique em "Enviar mensagem"
3. Escolha "Email" ou "WhatsApp"
4. Preencha os campos
5. Clique em "Enviar"
6. ✅ Mensagem será registrada (modo simulação)
7. Acesse o histórico para ver o registro

### Com Email Configurado

1. Configure as variáveis SMTP_* no `.env`
2. Repita os passos acima
3. ✉️ Email será enviado para o cliente SMTP

### Com WhatsApp Configurado

1. Configure as variáveis TWILIO_* no `.env`
2. Selecione "WhatsApp" no formulário
3. Insira um telefone válido (+55 + DDD + número)
4. Clique em "Enviar"
5. 💬 Mensagem será enviada via Twilio

## 3️⃣ Configuração de Email (Gmail)

### Obter Senha de App do Gmail

1. Acesse: https://myaccount.google.com/apppasswords
2. Autentique-se com sua conta Google
3. Selecione:
   - App: **Mail**
   - Device: **Windows Computer** (ou seu device)
4. Google gera uma senha de 16 caracteres
5. Cole em `SMTP_PASSWORD` no `.env`

### Exemplo de Configuração:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM=seu_email@gmail.com
```

## 4️⃣ Configuração de WhatsApp (Twilio)

### Obter Credenciais do Twilio

1. Acesse: https://console.twilio.com/
2. Crie conta ou faça login
3. Anote seu **Account SID** e **Auth Token**
4. Vá para "Messaging" > "Services" > "Whatsapp"
5. Configure um número de telefone (número do Twilio ou número pessoal verificado)
6. Cole em `.env`:

```env
TWILIO_ACCOUNT_SID=AC1234567890abcdef
TWILIO_AUTH_TOKEN=abcd1234efgh5678ijkl
TWILIO_PHONE_NUMBER=+15551234567
```

## 5️⃣ Verificar se Está Funcionando

### Logs do Backend

```bash
docker-compose logs backend
```

Procure por:
- ✉️ `Email enviado com sucesso`
- 💬 `WhatsApp enviado com sucesso`
- ⚠️ `Modo simulação ativado`

### Histórico no Frontend

1. Vá para http://localhost:3000/comunicacao
2. Clique em "Histórico"
3. Veja todas as mensagens enviadas
4. Verifique o status de cada uma

## 6️⃣ Estrutura de Arquivos

```
backend/
├── src/
│   ├── controllers/
│   │   ├── email.controller.js (NOVO)
│   │   └── whatsapp.controller.js (NOVO)
│   └── routes/
│       ├── email.routes.js (NOVO)
│       └── whatsapp.routes.js (NOVO)
├── .env.example (ATUALIZADO)
└── package.json (ATUALIZADO)

src/
└── componentes/
    └── Comunicacao/
        ├── comunicacao.js (471 linhas)
        └── comunicacao.css (900+ linhas)

COMUNICACAO.md (NOVO)
```

## 7️⃣ API Endpoints Disponíveis

### Email
```bash
POST /api/email/enviar
Content-Type: application/json
Authorization: Bearer {token}

{
  "para": "usuario@email.com",
  "assunto": "Título",
  "corpo": "Conteúdo do email"
}
```

### WhatsApp
```bash
POST /api/whatsapp/enviar
Content-Type: application/json
Authorization: Bearer {token}

{
  "telefone": "+5585987654321",
  "mensagem": "Olá!"
}
```

## 8️⃣ Troubleshooting

| Problema | Solução |
|----------|---------|
| "Cannot find module nodemailer" | `npm install nodemailer` |
| "Cannot find module twilio" | `npm install twilio` |
| "SMTP not configured" | Adicionar SMTP_* ao .env |
| "Email not sending" | Verificar credenciais Gmail |
| "WhatsApp not sending" | Verificar Account SID/Token Twilio |
| Frontend não conecta ao backend | Verificar CORS_ORIGIN no .env |

## 9️⃣ Próximas Features Sugeridas

1. **Agendamento:** Enviar emails/WhatsApp em horário futuro
2. **Templates Dinâmicos:** Usar {{nome}}, {{data}}, etc.
3. **Análise:** Dashboard com estatísticas de envios
4. **Notificações:** Alertar quando mensagem for entregue
5. **Integração com IA:** Gerar conteúdo automaticamente

---

✅ **Pronto para usar!**

Qualquer dúvida, consulte o arquivo `COMUNICACAO.md` para documentação técnica completa.

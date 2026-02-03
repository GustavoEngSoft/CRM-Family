import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import pessoasRoutes from './routes/pessoas.routes.js';
import comunicacaoRoutes from './routes/comunicacao.routes.js';
import acompanhamentoRoutes from './routes/acompanhamento.routes.js';
import loginRoutes from './routes/login.routes.js';
import relatoriosRoutes from './routes/relatorios.routes.js';
import emailRoutes from './routes/email.routes.js';
import whatsappRoutes from './routes/whatsapp.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/pessoas', pessoasRoutes);
app.use('/api/comunicacao', comunicacaoRoutes);
app.use('/api/acompanhamento', acompanhamentoRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      status: 404
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Banco de dados conectado`);
});

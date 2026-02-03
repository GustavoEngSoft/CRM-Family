import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = express.Router();

// GET - Obter estatísticas gerais
router.get('/stats', dashboardController.getStats);

// GET - Obter categorias/tags com crescimento
router.get('/categories', dashboardController.getCategories);

// GET - Obter crescimento mensal
router.get('/crescimento-mensal', dashboardController.getCrescimentoMensal);

// GET - Obter acompanhamentos diários
router.get('/acompanhamentos-diarios', dashboardController.getAcompanhamentosDiarios);

// GET - Obter atividade de pessoas
router.get('/atividade', dashboardController.getAtividade);

export default router;

import express from 'express';
import * as relatoriosController from '../controllers/relatorios.controller.js';

const router = express.Router();

// GET - Listar todos os relatórios
router.get('/', relatoriosController.list);

// GET - Obter membros (dados reais)
router.get('/membros', relatoriosController.getMembros);

// GET - Obter visitantes (dados reais)
router.get('/visitantes', relatoriosController.getVisitantes);

// GET - Obter obreiros (dados reais)
router.get('/obreiros', relatoriosController.getObreiros);

// GET - Obter comunicações (dados reais)
router.get('/comunicacoes', relatoriosController.getComunicacoes);

// GET - Obter acompanhamentos (dados reais)
router.get('/acompanhamentos', relatoriosController.getAcompanhamentos);

// GET - Obter um relatório específico
router.get('/:id', relatoriosController.getById);

// POST - Gerar novo relatório
router.post('/', relatoriosController.create);

// POST - Gerar relatório de pessoas
router.post('/generate/pessoas', relatoriosController.generatePessoas);

// POST - Gerar relatório de comunicações
router.post('/generate/comunicacoes', relatoriosController.generateComunicacoes);

// POST - Gerar relatório de acompanhamentos
router.post('/generate/acompanhamentos', relatoriosController.generateAcompanhamentos);

// DELETE - Deletar relatório
router.delete('/:id', relatoriosController.delete);

export default router;

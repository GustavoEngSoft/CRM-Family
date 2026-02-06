import express from 'express';
import * as eventosController from '../controllers/eventos.controller.js';

const router = express.Router();

// ==================== INSCRIÇÕES ====================

// GET - Listar inscrições de um evento
router.get('/:eventoId/inscricoes/list', eventosController.listInscricoes);

// GET - Obter uma inscrição específica
router.get('/inscricoes/:id', eventosController.getInscricaoById);

// POST - Criar nova inscrição
router.post('/:eventoId/inscricoes', eventosController.createInscricao);

// PUT - Atualizar inscrição
router.put('/inscricoes/:id', eventosController.updateInscricao);

// DELETE - Deletar inscrição
router.delete('/inscricoes/:id', eventosController.deleteInscricao);

// ==================== EVENTOS ====================

// GET - Obter evento com suas inscrições
router.get('/:id/inscricoes', eventosController.getEventoWithInscricoes);

// GET - Listar todos os eventos
router.get('/', eventosController.listEventos);

// GET - Obter um evento específico
router.get('/:id', eventosController.getEventoById);

// POST - Criar novo evento
router.post('/', eventosController.createEvento);

// PUT - Atualizar evento
router.put('/:id', eventosController.updateEvento);

// DELETE - Deletar evento
router.delete('/:id', eventosController.deleteEvento);

export default router;

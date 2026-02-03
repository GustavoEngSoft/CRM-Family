import express from 'express';
import * as acompanhamentoController from '../controllers/acompanhamento.controller.js';

const router = express.Router();

// GET - Listar todos os acompanhamentos
router.get('/', acompanhamentoController.list);

// GET - Obter acompanhamentos de uma pessoa
router.get('/pessoa/:pessoaId', acompanhamentoController.getByPessoa);

// GET - Obter um acompanhamento específico
router.get('/:id', acompanhamentoController.getById);

// POST - Criar novo acompanhamento
router.post('/', acompanhamentoController.create);

// PUT - Atualizar acompanhamento
router.put('/:id', acompanhamentoController.update);

// DELETE - Deletar acompanhamento
router.delete('/:id', acompanhamentoController.delete);

export default router;

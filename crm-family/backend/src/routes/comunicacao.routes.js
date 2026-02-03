import express from 'express';
import * as comunicacaoController from '../controllers/comunicacao.controller.js';

const router = express.Router();

// GET - Listar todas as comunicações
router.get('/', comunicacaoController.list);

// GET - Obter comunicações de uma pessoa
router.get('/pessoa/:pessoaId', comunicacaoController.getByPessoa);

// GET - Obter uma comunicação específica
router.get('/:id', comunicacaoController.getById);

// POST - Criar nova comunicação
router.post('/', comunicacaoController.create);

// PUT - Atualizar comunicação
router.put('/:id', comunicacaoController.update);

// DELETE - Deletar comunicação
router.delete('/:id', comunicacaoController.delete);

export default router;

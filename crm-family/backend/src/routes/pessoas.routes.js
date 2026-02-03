import express from 'express';
import * as pessoasController from '../controllers/pessoas.controller.js';

const router = express.Router();

// GET - Listar todas as pessoas com paginação
router.get('/', pessoasController.list);

// GET - Obter pessoas por tag
router.get('/tag/:tag', pessoasController.getByTag);

// GET - Obter uma pessoa específica
router.get('/:id', pessoasController.getById);

// POST - Criar nova pessoa
router.post('/', pessoasController.create);

// PUT - Atualizar pessoa
router.put('/:id', pessoasController.update);

// DELETE - Deletar pessoa
router.delete('/:id', pessoasController.delete);

export default router;

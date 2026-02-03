import express from 'express';
import * as loginController from '../controllers/login.controller.js';

const router = express.Router();

// POST - Login
router.post('/', loginController.login);

// POST - Register
router.post('/register', loginController.register);

// GET - Obter usuário por ID
router.get('/:id', loginController.getById);

// PUT - Atualizar usuário
router.put('/:id', loginController.update);

export default router;

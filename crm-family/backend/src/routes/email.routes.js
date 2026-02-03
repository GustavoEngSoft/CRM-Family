import express from 'express';
import * as emailController from '../controllers/email.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST - Enviar email
router.post('/enviar', verifyToken, emailController.enviarEmail);

export default router;


import express from 'express';
import * as whatsappController from '../controllers/whatsapp.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// POST - Enviar mensagem WhatsApp
router.post('/enviar', verifyToken, whatsappController.enviarWhatsapp);

export default router;


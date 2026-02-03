/**
 * Controlador para envio de mensagens WhatsApp via Twilio
 * Requer configuração de variáveis de ambiente:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */

export async function enviarWhatsapp(req, res) {
  try {
    const { telefone, mensagem } = req.body;

    // Validações
    if (!telefone || !mensagem) {
      return res.status(400).json({ 
        error: 'telefone e mensagem são obrigatórios' 
      });
    }

    // Verificar se Twilio está configurado
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.warn('⚠️  Twilio não configurado. Modo simulação ativado.');
      console.log('WhatsApp que seria enviado:', { telefone, mensagem });
      
      return res.json({ 
        success: true,
        message: 'Mensagem WhatsApp registrada com sucesso (modo simulação)',
        data: { telefone, mensagem }
      });
    }

    try {
      // Importar Twilio apenas se configurado
      const twilio = await import('twilio').then(m => m.default);
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      // Formatar número de telefone (adicionar +55 se não tiver)
      let telefoneFinal = telefone.replace(/\D/g, '');
      if (!telefoneFinal.startsWith('55')) {
        telefoneFinal = '55' + telefoneFinal;
      }
      const numberId = `whatsapp:+${telefoneFinal}`;
      const fromId = `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`;

      // Enviar mensagem via Twilio
      const message = await client.messages.create({
        from: fromId,
        to: numberId,
        body: mensagem
      });

      console.log('💬 WhatsApp enviado com sucesso:', message.sid);

      res.json({ 
        success: true,
        message: 'Mensagem WhatsApp enviada com sucesso',
        messageSid: message.sid
      });
    } catch (twilioError) {
      // Se Twilio falhar, retornar modo simulação
      console.warn('⚠️  Erro ao usar Twilio, modo simulação:', twilioError.message);
      
      res.json({ 
        success: true,
        message: 'Mensagem WhatsApp registrada (modo simulação)',
        data: { telefone, mensagem }
      });
    }
  } catch (error) {
    console.error('❌ Erro ao enviar WhatsApp:', error.message);
    
    res.status(500).json({ 
      error: 'Erro ao enviar WhatsApp: ' + error.message 
    });
  }
}

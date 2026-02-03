import nodemailer from 'nodemailer';

// Configurar o transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Enviar email
 * @param {Object} req - Request
 * @param {string} req.body.para - Email destinatário
 * @param {string} req.body.assunto - Assunto do email
 * @param {string} req.body.corpo - Corpo do email
 */
export async function enviarEmail(req, res) {
  try {
    const { para, assunto, corpo } = req.body;

    // Validações
    if (!para || !assunto || !corpo) {
      return res.status(400).json({ 
        error: 'para, assunto e corpo são obrigatórios' 
      });
    }

    // Verificar se SMTP está configurado
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('⚠️  SMTP não configurado. Modo simulação ativado.');
      console.log('Email que seria enviado:', { para, assunto, corpo });
      
      return res.json({ 
        success: true,
        message: 'Email registrado com sucesso (modo simulação)',
        data: { para, assunto, corpo }
      });
    }

    // Enviar email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: para,
      subject: assunto,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              ${corpo.replace(/\n/g, '<br>')}
              <hr style="border: 1px solid #ddd; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                Este é um email automático. Não responda este email.
              </p>
            </div>
          </body>
        </html>
      `,
      text: corpo
    });

    console.log('✉️  Email enviado com sucesso:', info.messageId);

    res.json({ 
      success: true,
      message: 'Email enviado com sucesso',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    
    res.status(500).json({ 
      error: 'Erro ao enviar email: ' + error.message 
    });
  }
}

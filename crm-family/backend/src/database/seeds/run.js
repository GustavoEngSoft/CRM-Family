import { query } from '../connection.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Insert de usuários
    const userId = uuidv4();
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await query(
      `INSERT INTO usuarios (id, nome, email, senha, perfil) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [userId, 'Admin CRM', 'admin@crm.com', senhaHash, 'admin']
    );

    console.log('✅ Usuário admin criado (email: admin@crm.com, senha: admin123)');

    // Insert de pessoas
    const pessoaIds = [];
    const pessoasData = [
      { nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 98765-4321', tags: ['Membros', 'Líderes'] },
      { nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 97654-3210', tags: ['Membros', 'Voluntários'] },
      { nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 96543-2109', tags: ['Obreiros'] },
      { nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 95432-1098', tags: ['Visitantes', 'Novo Convertido'] },
      { nome: 'Carlos Ferreira', email: 'carlos@email.com', telefone: '(11) 94321-0987', tags: ['Membros'] },
      { nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(11) 93210-9876', tags: ['Voluntários', 'Discipulado'] },
      { nome: 'Rafael Gomes', email: 'rafael@email.com', telefone: '(11) 92109-8765', tags: ['Visitantes'] },
      { nome: 'Juliana Rocha', email: 'juliana@email.com', telefone: '(11) 91098-7654', tags: ['Membros', 'Obreiros'] },
      { nome: 'Lucas Alves', email: 'lucas@email.com', telefone: '(11) 90987-6543', tags: ['Novo Convertido', 'Precisa de Visita'] },
      { nome: 'Camila Souza', email: 'camila@email.com', telefone: '(11) 89876-5432', tags: ['Líderes', 'Membros'] }
    ];

    for (const pessoa of pessoasData) {
      const pessoaId = uuidv4();
      pessoaIds.push(pessoaId);
      await query(
        `INSERT INTO pessoas (id, nome, email, telefone, cidade, estado, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [pessoaId, pessoa.nome, pessoa.email, pessoa.telefone, 'São Paulo', 'SP', pessoa.tags]
      );
    }

    console.log(`✅ ${pessoasData.length} pessoas criadas`);

    // Insert de comunicações
    const tiposComunicacao = ['email', 'sms', 'whatsapp', 'chamada'];
    const statusComunicacao = ['pendente', 'realizada', 'cancelada'];

    for (let i = 0; i < pessoaIds.length; i++) {
      const tipo = tiposComunicacao[i % tiposComunicacao.length];
      const status = statusComunicacao[i % statusComunicacao.length];
      
      await query(
        `INSERT INTO comunicacoes (pessoa_id, tipo, assunto, mensagem, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          pessoaIds[i],
          tipo,
          `${tipo === 'email' ? 'Email' : tipo === 'sms' ? 'SMS' : 'Mensagem'} para ${pessoasData[i].nome}`,
          `Conteúdo da comunicação via ${tipo}`,
          status
        ]
      );
    }

    console.log(`✅ ${pessoaIds.length} comunicações criadas`);

    // Insert de acompanhamentos
    const statusAcomp = ['aberto', 'em_progresso', 'fechado'];
    const prioridades = ['baixa', 'media', 'alta'];

    for (let i = 0; i < pessoaIds.length; i++) {
      const status = statusAcomp[i % statusAcomp.length];
      const prioridade = prioridades[i % prioridades.length];
      
      await query(
        `INSERT INTO acompanhamentos (pessoa_id, titulo, descricao, status, prioridade, responsavel)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          pessoaIds[i],
          `Acompanhamento de ${pessoasData[i].nome}`,
          `Descrição do acompanhamento - ${status}`,
          status,
          prioridade,
          'Admin CRM'
        ]
      );
    }

    console.log(`✅ ${pessoaIds.length} acompanhamentos criados`);

    console.log('\n✨ Seed executado com sucesso!');
    console.log('\n📝 Credenciais de acesso:');
    console.log('   Email: admin@crm.com');
    console.log('   Senha: admin123');
    console.log('\n🌐 Acesse: http://localhost:3000\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
}

seedDatabase();

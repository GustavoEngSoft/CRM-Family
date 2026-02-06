import { query } from '../database/connection.js';

export async function getStats(req, res) {
  try {
    // Total de pessoas ativas
    const pessoasAtivas = await query(
      'SELECT COUNT(*) as total FROM pessoas WHERE ativo = true'
    );

    // Membros novos (últimos 30 dias)
    const membrosNovos = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE created_at >= NOW() - INTERVAL '30 days' AND ativo = true`
    );

    // Membros criados antes de 30 dias para comparação
    const membrosAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE created_at >= NOW() - INTERVAL '60 days' 
       AND created_at < NOW() - INTERVAL '30 days' AND ativo = true`
    );

    // Total de mensagens enviadas
    const mensagensEnviadas = await query(
      'SELECT COUNT(*) as total FROM comunicacoes WHERE status = $1',
      ['enviado']
    );

    const mensagensUltimos30 = await query(
      `SELECT COUNT(*) as total FROM comunicacoes
       WHERE status = $1 AND data_comunicacao >= NOW() - INTERVAL '30 days'`,
      ['enviado']
    );

    const mensagensAnteriores30 = await query(
      `SELECT COUNT(*) as total FROM comunicacoes
       WHERE status = $1 AND data_comunicacao >= NOW() - INTERVAL '60 days'
       AND data_comunicacao < NOW() - INTERVAL '30 days'`,
      ['enviado']
    );

    // Visitantes (pessoas com tag 'visitante')
    const visitantes = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE 'visitante' = ANY(tags)"
    );

    // Visitantes antes de 30 dias
    const visitantesAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE 'visitante' = ANY(tags) AND created_at < NOW() - INTERVAL '30 days'`
    );

    const crescimentoVisitantes = parseInt(visitantes.rows[0].total) - parseInt(visitantesAnteriores.rows[0].total);
    const crescimentoMembros = parseInt(membrosNovos.rows[0].total) - parseInt(membrosAnteriores.rows[0].total);
    const mensagensAtual = parseInt(mensagensUltimos30.rows[0].total);
    const mensagensAnterior = parseInt(mensagensAnteriores30.rows[0].total);
    const crescimentoMensagens = mensagensAtual - mensagensAnterior;
    const crescimentoMensagensPercent = mensagensAnterior > 0
      ? Math.round((crescimentoMensagens / mensagensAnterior) * 100)
      : mensagensAtual > 0
        ? 100
        : 0;

    res.json({
      pessoasAtivas: parseInt(pessoasAtivas.rows[0].total),
      membrosNovos: parseInt(membrosNovos.rows[0].total),
      crescimentoMembros: crescimentoMembros,
      mensagensEnviadas: parseInt(mensagensEnviadas.rows[0].total),
      crescimentoMensagensPercent: crescimentoMensagensPercent,
      visitantesRealizadas: parseInt(visitantes.rows[0].total),
      crescimentoVisitantes: crescimentoVisitantes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategories(req, res) {
  try {
    // Líderes (pessoas com tag 'lider')
    const lideres = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE 'lider' = ANY(tags) AND ativo = true"
    );

    // Obreiros (pessoas com tag 'obreiro')
    const obreiros = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE 'obreiro' = ANY(tags) AND ativo = true"
    );

    // Voluntários (pessoas com tag 'voluntario')
    const voluntarios = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE 'voluntario' = ANY(tags) AND ativo = true"
    );

    // Membros (pessoas ativas)
    const membros = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE ativo = true"
    );

    // Visitantes (pessoas com tag 'visitante')
    const visitantes = await query(
      "SELECT COUNT(*) as total FROM pessoas WHERE 'visitante' = ANY(tags)"
    );

    // Calcular crescimento de líderes
    const lideresAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE 'lider' = ANY(tags) AND ativo = true AND created_at < NOW() - INTERVAL '30 days'`
    );
    const crescimentoLideres = parseInt(lideres.rows[0].total) - parseInt(lideresAnteriores.rows[0].total);

    // Calcular crescimento de obreiros
    const obreirosAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE 'obreiro' = ANY(tags) AND ativo = true AND created_at < NOW() - INTERVAL '30 days'`
    );
    const crescimentoObreiros = parseInt(obreiros.rows[0].total) - parseInt(obreirosAnteriores.rows[0].total);

    // Calcular crescimento de voluntários
    const voluntariosAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE 'voluntario' = ANY(tags) AND ativo = true AND created_at < NOW() - INTERVAL '30 days'`
    );
    const crescimentoVoluntarios = parseInt(voluntarios.rows[0].total) - parseInt(voluntariosAnteriores.rows[0].total);

    // Calcular crescimento de membros
    const membrosAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE ativo = true AND created_at < NOW() - INTERVAL '30 days'`
    );
    const crescimentoMembros = parseInt(membros.rows[0].total) - parseInt(membrosAnteriores.rows[0].total);

    // Calcular crescimento de visitantes
    const visitantesAnteriores = await query(
      `SELECT COUNT(*) as total FROM pessoas 
       WHERE 'visitante' = ANY(tags) AND created_at < NOW() - INTERVAL '30 days'`
    );
    const crescimentoVisitantes = parseInt(visitantes.rows[0].total) - parseInt(visitantesAnteriores.rows[0].total);

    res.json({
      lideres: {
        total: parseInt(lideres.rows[0].total),
        crescimento: crescimentoLideres
      },
      obreiros: {
        total: parseInt(obreiros.rows[0].total),
        crescimento: crescimentoObreiros
      },
      voluntarios: {
        total: parseInt(voluntarios.rows[0].total),
        crescimento: crescimentoVoluntarios
      },
      membros: {
        total: parseInt(membros.rows[0].total),
        crescimento: crescimentoMembros
      },
      visitantes: {
        total: parseInt(visitantes.rows[0].total),
        crescimento: crescimentoVisitantes
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCrescimentoMensal(req, res) {
  try {
    const result = await query(`
      SELECT 
        TO_CHAR(created_at, 'Month') as mes,
        EXTRACT(MONTH FROM created_at) as mes_num,
        COUNT(*) as total
      FROM pessoas
      WHERE created_at >= NOW() - INTERVAL '7 months'
      GROUP BY mes, mes_num
      ORDER BY mes_num ASC
    `);

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 
      'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 
      'Novembro', 'Dezembro'
    ];

    const data = result.rows.map(row => ({
      month: meses[parseInt(row.mes_num) - 1],
      value: parseInt(row.total)
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAcompanhamentosDiarios(req, res) {
  try {
    const result = await query(`
      SELECT 
        TO_CHAR(created_at, 'DD/MM/YY') as data,
        COUNT(*) as total
      FROM acompanhamentos
      WHERE created_at >= NOW() - INTERVAL '10 days'
      GROUP BY data, created_at
      ORDER BY created_at ASC
    `);

    const data = result.rows.map(row => ({
      date: row.data,
      value: parseInt(row.total)
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAtividade(req, res) {
  try {
    // Total de pessoas
    const totalPessoas = await query('SELECT COUNT(*) as total FROM pessoas');
    
    // Pessoas ativas nos últimos 30 dias (com comunicações ou acompanhamentos)
    const pessoasAtivas30Dias = await query(`
      SELECT COUNT(DISTINCT pessoa_id) as total
      FROM (
        SELECT pessoa_id FROM comunicacoes 
        WHERE data_comunicacao >= NOW() - INTERVAL '30 days'
        UNION
        SELECT pessoa_id FROM acompanhamentos 
        WHERE created_at >= NOW() - INTERVAL '30 days'
      ) as pessoas_ativas
    `);

    const total = parseInt(totalPessoas.rows[0].total);
    const ativas = parseInt(pessoasAtivas30Dias.rows[0].total);
    const percentual = total > 0 ? Math.round((ativas / total) * 100) : 0;

    res.json({
      total: total,
      ativas: ativas,
      percentual: percentual
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

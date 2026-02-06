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

    // Visitas realizadas (acompanhamentos do tipo 'visita' concluídos no mês)
    const visitasRealizadas = await query(
      `SELECT COUNT(*) as total FROM acompanhamentos 
       WHERE tipo = $1 AND status = $2 
       AND updated_at >= DATE_TRUNC('month', CURRENT_DATE)`,
      ['visita', 'concluido']
    );

    // Visitas realizadas no mês anterior
    const visitasAnteriores = await query(
      `SELECT COUNT(*) as total FROM acompanhamentos 
       WHERE tipo = $1 AND status = $2 
       AND updated_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
       AND updated_at < DATE_TRUNC('month', CURRENT_DATE)`,
      ['visita', 'concluido']
    );

    const crescimentoVisitas = parseInt(visitasRealizadas.rows[0].total) - parseInt(visitasAnteriores.rows[0].total);
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
      visitantesRealizadas: parseInt(visitasRealizadas.rows[0].total),
      crescimentoVisitantes: crescimentoVisitas
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
        DATE_TRUNC('month', created_at) as mes_data,
        EXTRACT(MONTH FROM created_at) as mes_num,
        EXTRACT(YEAR FROM created_at) as ano,
        COUNT(*) as total
      FROM pessoas
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '6 months'
      GROUP BY mes_data, mes_num, ano
      ORDER BY mes_data ASC
    `);

    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 
      'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 
      'Novembro', 'Dezembro'
    ];

    const data = result.rows.map(row => {
      const mesIndex = parseInt(row.mes_num) - 1;
      const anoCurto = String(row.ano).slice(2);
      return {
        month: `${meses[mesIndex].substring(0, 3)}/${anoCurto}`,
        value: parseInt(row.total)
      };
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getAcompanhamentosDiarios(req, res) {
  try {
    const result = await query(`
      SELECT 
        TO_CHAR((updated_at::timestamp - INTERVAL '3 hours')::date, 'DD/MM/YY') as data,
        COUNT(*) as total
      FROM acompanhamentos
      WHERE tipo = 'visita' 
        AND status = 'concluido'
        AND updated_at >= NOW() - INTERVAL '10 days'
      GROUP BY (updated_at::timestamp - INTERVAL '3 hours')::date
      ORDER BY (updated_at::timestamp - INTERVAL '3 hours')::date ASC
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
    const totalAtivas = await query('SELECT COUNT(*) as total FROM pessoas WHERE ativo = true');
    const totalInativas = await query('SELECT COUNT(*) as total FROM pessoas WHERE ativo = false');

    const ativas = parseInt(totalAtivas.rows[0].total);
    const inativas = parseInt(totalInativas.rows[0].total);
    const total = ativas + inativas;
    const percentual = total > 0 ? Math.round((ativas / total) * 100) : 0;

    res.json({
      total: total,
      ativas: ativas,
      inativas: inativas,
      percentual: percentual
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

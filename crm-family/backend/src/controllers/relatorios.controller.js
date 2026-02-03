import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export async function list(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM relatorios ORDER BY data_geracao DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM relatorios');
    const total = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM relatorios WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { titulo, descricao, tipo, parametros, usuario_id } = req.body;

    if (!titulo || !tipo) {
      return res.status(400).json({ error: 'Título e tipo são obrigatórios' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO relatorios (id, titulo, descricao, tipo, parametros, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, titulo, descricao, tipo, JSON.stringify(parametros) || null, usuario_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function generatePessoas(req, res) {
  try {
    const { filtro } = req.body;

    let sql = 'SELECT * FROM pessoas WHERE ativo = true';
    const params = [];

    if (filtro?.tags) {
      sql += ' AND $1 = ANY(tags)';
      params.push(filtro.tags);
    }

    const result = await query(sql, params);

    const id = uuidv4();
    await query(
      `INSERT INTO relatorios (id, titulo, descricao, tipo, parametros)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'Relatório de Pessoas', 'Relatório gerado automaticamente', 'pessoas', JSON.stringify(filtro)]
    );

    res.json({
      id,
      tipo: 'pessoas',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET - Buscar membros sem salvar
export async function getMembros(req, res) {
  try {
    const result = await query(
      'SELECT * FROM pessoas WHERE ativo = true ORDER BY nome ASC'
    );

    res.json({
      tipo: 'membros',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET - Buscar visitantes (pessoas com tag 'visitante')
export async function getVisitantes(req, res) {
  try {
    const result = await query(
      "SELECT * FROM pessoas WHERE 'visitante' = ANY(tags) ORDER BY created_at DESC"
    );

    res.json({
      tipo: 'visitantes',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET - Buscar obreiros (pessoas com tag 'obreiro')
export async function getObreiros(req, res) {
  try {
    const result = await query(
      "SELECT * FROM pessoas WHERE 'obreiro' = ANY(tags) ORDER BY nome ASC"
    );

    res.json({
      tipo: 'obreiros',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function generateComunicacoes(req, res) {
  try {
    const { filtro } = req.body;

    let sql = 'SELECT * FROM comunicacoes WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filtro?.status) {
      sql += ` AND status = $${paramCount}`;
      params.push(filtro.status);
      paramCount++;
    }

    if (filtro?.tipo) {
      sql += ` AND tipo = $${paramCount}`;
      params.push(filtro.tipo);
    }

    sql += ' ORDER BY data_comunicacao DESC';

    const result = await query(sql, params);

    const id = uuidv4();
    await query(
      `INSERT INTO relatorios (id, titulo, descricao, tipo, parametros)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'Relatório de Comunicações', 'Relatório gerado automaticamente', 'comunicacoes', JSON.stringify(filtro)]
    );

    res.json({
      id,
      tipo: 'comunicacoes',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET - Buscar comunicações sem salvar
export async function getComunicacoes(req, res) {
  try {
    const result = await query(
      'SELECT * FROM comunicacoes ORDER BY data_comunicacao DESC'
    );

    res.json({
      tipo: 'comunicacoes',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function generateAcompanhamentos(req, res) {
  try {
    const { filtro } = req.body;

    let sql = 'SELECT * FROM acompanhamentos WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (filtro?.status) {
      sql += ` AND status = $${paramCount}`;
      params.push(filtro.status);
      paramCount++;
    }

    if (filtro?.prioridade) {
      sql += ` AND prioridade = $${paramCount}`;
      params.push(filtro.prioridade);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);

    const id = uuidv4();
    await query(
      `INSERT INTO relatorios (id, titulo, descricao, tipo, parametros)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, 'Relatório de Acompanhamentos', 'Relatório gerado automaticamente', 'acompanhamentos', JSON.stringify(filtro)]
    );

    res.json({
      id,
      tipo: 'acompanhamentos',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// GET - Buscar acompanhamentos sem salvar
export async function getAcompanhamentos(req, res) {
  try {
    const result = await query(
      'SELECT * FROM acompanhamentos ORDER BY created_at DESC'
    );

    res.json({
      tipo: 'acompanhamentos',
      total: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function delete_(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM relatorios WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Relatório não encontrado' });
    }

    res.json({ message: 'Relatório deletado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { delete_ as delete };

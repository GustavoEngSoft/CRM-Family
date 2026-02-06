import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export async function list(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM acompanhamentos ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM acompanhamentos');
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
    const result = await query('SELECT * FROM acompanhamentos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getByPessoa(req, res) {
  try {
    const { pessoaId } = req.params;
    const result = await query(
      'SELECT * FROM acompanhamentos WHERE pessoa_id = $1 ORDER BY created_at DESC',
      [pessoaId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { pessoa_id, titulo, descricao, tipo, status, prioridade, data_inicio, data_fim, responsavel } = req.body;

    if (!pessoa_id || !titulo) {
      return res.status(400).json({ error: 'pessoa_id e titulo são obrigatórios' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO acompanhamentos (id, pessoa_id, titulo, descricao, tipo, status, prioridade, data_inicio, data_fim, responsavel)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, pessoa_id, titulo, descricao, tipo || 'geral', status || 'aberto', prioridade || 'media', data_inicio, data_fim, responsavel]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { titulo, descricao, tipo, status, prioridade, data_inicio, data_fim, responsavel, resultado } = req.body;

    const result = await query(
      `UPDATE acompanhamentos SET
        titulo = COALESCE($2, titulo),
        descricao = COALESCE($3, descricao),
        tipo = COALESCE($4, tipo),
        status = COALESCE($5, status),
        prioridade = COALESCE($6, prioridade),
        data_inicio = COALESCE($7, data_inicio),
        data_fim = COALESCE($8, data_fim),
        responsavel = COALESCE($9, responsavel),
        resultado = COALESCE($10, resultado),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, titulo, descricao, tipo, status, prioridade, data_inicio, data_fim, responsavel, resultado]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function delete_(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM acompanhamentos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Acompanhamento não encontrado' });
    }

    res.json({ message: 'Acompanhamento deletado com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { delete_ as delete };

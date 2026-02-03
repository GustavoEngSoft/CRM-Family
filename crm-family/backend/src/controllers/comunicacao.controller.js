import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export async function list(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM comunicacoes ORDER BY data_comunicacao DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM comunicacoes');
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
    const result = await query('SELECT * FROM comunicacoes WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comunicação não encontrada' });
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
      'SELECT * FROM comunicacoes WHERE pessoa_id = $1 ORDER BY data_comunicacao DESC',
      [pessoaId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { pessoa_id, tipo, assunto, mensagem, proxima_acao, status } = req.body;

    if (!pessoa_id || !tipo) {
      return res.status(400).json({ error: 'pessoa_id e tipo são obrigatórios' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO comunicacoes (id, pessoa_id, tipo, assunto, mensagem, proxima_acao, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, pessoa_id, tipo, assunto, mensagem, proxima_acao, status || 'pendente']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { tipo, assunto, mensagem, proxima_acao, status } = req.body;

    const result = await query(
      `UPDATE comunicacoes SET
        tipo = COALESCE($2, tipo),
        assunto = COALESCE($3, assunto),
        mensagem = COALESCE($4, mensagem),
        proxima_acao = COALESCE($5, proxima_acao),
        status = COALESCE($6, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, tipo, assunto, mensagem, proxima_acao, status]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comunicação não encontrada' });
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
      'DELETE FROM comunicacoes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comunicação não encontrada' });
    }

    res.json({ message: 'Comunicação deletada com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { delete_ as delete };

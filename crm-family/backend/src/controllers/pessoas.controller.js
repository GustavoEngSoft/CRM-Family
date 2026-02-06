import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

export async function list(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await query(
      'SELECT * FROM pessoas WHERE ativo = true ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await query('SELECT COUNT(*) FROM pessoas WHERE ativo = true');
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
    const result = await query('SELECT * FROM pessoas WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getByTag(req, res) {
  try {
    const { tag } = req.params;
    const result = await query(
      'SELECT * FROM pessoas WHERE $1 = ANY(tags) AND ativo = true ORDER BY created_at DESC',
      [tag]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req, res) {
  try {
    const { nome, email, telefone, cpf, endereco, cidade, estado, cep, data_nascimento, tags, observacoes } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO pessoas (id, nome, email, telefone, cpf, endereco, cidade, estado, cep, data_nascimento, tags, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [id, nome, email, telefone, cpf, endereco, cidade, estado, cep, data_nascimento, tags || [], observacoes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cpf, endereco, cidade, estado, cep, data_nascimento, tags, observacoes, ativo } = req.body;

    const result = await query(
      `UPDATE pessoas SET
        nome = COALESCE($2, nome),
        email = COALESCE($3, email),
        telefone = COALESCE($4, telefone),
        cpf = COALESCE($5, cpf),
        endereco = COALESCE($6, endereco),
        cidade = COALESCE($7, cidade),
        estado = COALESCE($8, estado),
        cep = COALESCE($9, cep),
        data_nascimento = COALESCE($10, data_nascimento),
        tags = COALESCE($11, tags),
        observacoes = COALESCE($12, observacoes),
        ativo = COALESCE($13, ativo),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, nome, email, telefone, cpf, endereco, cidade, estado, cep, data_nascimento, tags, observacoes, ativo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function delete_(req, res) {
  try {
    const { id } = req.params;

    // Soft delete
    const result = await query(
      'UPDATE pessoas SET ativo = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json({ message: 'Pessoa deletada com sucesso', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Renomeia a função para evitar conflito com palavra-chave
export { delete_ as delete };

export async function getTagStats(req, res) {
  try {
    // Lista de tags que queremos estatísticas
    const tagsToCheck = ['Líderes', 'Obreiros', 'Voluntários', 'Membros', 'Visitantes'];
    
    const stats = [];

    for (const tagName of tagsToCheck) {
      // Conta total de pessoas com essa tag
      const totalResult = await query(
        `SELECT COUNT(*) as total FROM pessoas 
         WHERE ativo = true AND $1 = ANY(tags)`,
        [tagName]
      );

      // Conta pessoas adicionadas no mês atual com essa tag
      const monthResult = await query(
        `SELECT COUNT(*) as count FROM pessoas 
         WHERE ativo = true 
         AND $1 = ANY(tags)
         AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_TIMESTAMP)`,
        [tagName]
      );

      const total = parseInt(totalResult.rows[0].total) || 0;
      const monthChange = parseInt(monthResult.rows[0].count) || 0;

      stats.push({
        tag: tagName.toLowerCase(),
        total: total,
        monthChange: monthChange
      });
    }

    res.json({ data: stats });
  } catch (error) {
    console.error('Erro ao obter estatísticas de tags:', error);
    res.status(500).json({ error: error.message });
  }
}

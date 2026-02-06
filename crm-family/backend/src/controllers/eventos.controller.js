import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';

// ==================== EVENTOS ====================

export async function listEventos(req, res) {
  try {
    const result = await query(
      'SELECT * FROM eventos WHERE ativo = true ORDER BY data DESC'
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getEventoById(req, res) {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM eventos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createEvento(req, res) {
  try {
    const { nome, data, horario, descricao, local } = req.body;

    if (!nome || !data || !horario) {
      return res.status(400).json({ error: 'Nome, data e horário são obrigatórios' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO eventos (id, nome, data, horario, descricao, local)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, nome, data, horario, descricao || null, local || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateEvento(req, res) {
  try {
    const { id } = req.params;
    const { nome, data, horario, descricao, local, ativo } = req.body;

    const result = await query(
      `UPDATE eventos SET
        nome = COALESCE($2, nome),
        data = COALESCE($3, data),
        horario = COALESCE($4, horario),
        descricao = COALESCE($5, descricao),
        local = COALESCE($6, local),
        ativo = COALESCE($7, ativo),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, nome, data, horario, descricao, local, ativo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteEvento(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE eventos SET ativo = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ==================== INSCRIÇÕES EM EVENTOS ====================

export async function listInscricoes(req, res) {
  try {
    const { eventoId } = req.params;

    const result = await query(
      'SELECT * FROM inscricoes_eventos WHERE evento_id = $1 AND ativo = true ORDER BY data_inscricao DESC',
      [eventoId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getInscricaoById(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM inscricoes_eventos WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createInscricao(req, res) {
  try {
    const { evento_id, nome, telefone, endereco, tipo } = req.body;

    if (!evento_id || !nome || !telefone || !endereco || !tipo) {
      return res.status(400).json({ 
        error: 'Evento ID, nome, telefone, endereço e tipo são obrigatórios' 
      });
    }

    if (tipo !== 'membro' && tipo !== 'visitante') {
      return res.status(400).json({ error: 'Tipo deve ser "membro" ou "visitante"' });
    }

    const id = uuidv4();
    const result = await query(
      `INSERT INTO inscricoes_eventos (id, evento_id, nome, telefone, endereco, tipo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, evento_id, nome, telefone, endereco, tipo]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateInscricao(req, res) {
  try {
    const { id } = req.params;
    const { nome, telefone, endereco, tipo, ativo } = req.body;

    if (tipo && tipo !== 'membro' && tipo !== 'visitante') {
      return res.status(400).json({ error: 'Tipo deve ser "membro" ou "visitante"' });
    }

    const result = await query(
      `UPDATE inscricoes_eventos SET
        nome = COALESCE($2, nome),
        telefone = COALESCE($3, telefone),
        endereco = COALESCE($4, endereco),
        tipo = COALESCE($5, tipo),
        ativo = COALESCE($6, ativo),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id, nome, telefone, endereco, tipo, ativo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteInscricao(req, res) {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE inscricoes_eventos SET ativo = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    res.json({ message: 'Inscrição removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getEventoWithInscricoes(req, res) {
  try {
    const { id } = req.params;

    const eventoResult = await query(
      'SELECT * FROM eventos WHERE id = $1',
      [id]
    );

    if (eventoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const inscricoesResult = await query(
      'SELECT * FROM inscricoes_eventos WHERE evento_id = $1 AND ativo = true ORDER BY data_inscricao DESC',
      [id]
    );

    res.json({
      evento: eventoResult.rows[0],
      inscricoes: inscricoesResult.rows,
      totalInscricoes: inscricoesResult.rows.length,
      totalMembros: inscricoesResult.rows.filter(i => i.tipo === 'membro').length,
      totalVisitantes: inscricoesResult.rows.filter(i => i.tipo === 'visitante').length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

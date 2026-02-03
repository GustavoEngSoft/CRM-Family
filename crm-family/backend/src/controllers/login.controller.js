import { query } from '../database/connection.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth.js';

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await query(
      'SELECT * FROM usuarios WHERE email = $1 AND ativo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const usuario = result.rows[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Atualizar último acesso
    await query(
      'UPDATE usuarios SET ultimo_acesso = CURRENT_TIMESTAMP WHERE id = $1',
      [usuario.id]
    );

    const token = generateToken(usuario.id, usuario.email, usuario.perfil);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function register(req, res) {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const id = uuidv4();
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await query(
      `INSERT INTO usuarios (id, nome, email, senha, perfil)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nome, email, perfil`,
      [id, nome, email, senhaHash, perfil || 'user']
    );

    const token = generateToken(result.rows[0].id, email, perfil || 'user');

    res.status(201).json({
      message: 'Usuário registrado com sucesso',
      token,
      user: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email já registrado' });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT id, nome, email, perfil, ativo, ultimo_acesso FROM usuarios WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, perfil, ativo } = req.body;

    const result = await query(
      `UPDATE usuarios SET
        nome = COALESCE($2, nome),
        email = COALESCE($3, email),
        perfil = COALESCE($4, perfil),
        ativo = COALESCE($5, ativo),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING id, nome, email, perfil, ativo`,
      [id, nome, email, perfil, ativo]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

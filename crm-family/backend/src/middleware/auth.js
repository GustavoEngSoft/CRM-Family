import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'crm_family_secret_key_change_in_production';

export function generateToken(userId, email, perfil) {
  return jwt.sign(
    { userId, email, perfil },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token mal formatado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userPerfil = decoded.perfil;
    return next();
  });
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return next();
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (!err) {
      req.userId = decoded.userId;
      req.userEmail = decoded.email;
      req.userPerfil = decoded.perfil;
    }
    return next();
  });
}

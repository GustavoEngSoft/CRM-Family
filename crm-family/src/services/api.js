const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

// Helper para gerenciar token
export const TokenService = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  removeToken: () => localStorage.removeItem('token'),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('user')
};

// Helper para headers com autenticação
const getHeaders = () => {
  const token = TokenService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper para tratar erros
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || `HTTP Error ${response.status}`);
  }
  return response.json();
};

// ==================== AUTENTICAÇÃO ====================

export const AuthAPI = {
  login: async (email, senha) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    const data = await handleResponse(response);
    if (data.token) {
      TokenService.setToken(data.token);
      TokenService.setUser(data.user);
    }
    return data;
  },

  register: async (nome, email, senha) => {
    const response = await fetch(`${API_URL}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    const data = await handleResponse(response);
    if (data.token) {
      TokenService.setToken(data.token);
      TokenService.setUser(data.user);
    }
    return data;
  },

  logout: () => {
    TokenService.removeToken();
    TokenService.removeUser();
  }
};

// ==================== PESSOAS ====================

export const PessoasAPI = {
  list: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/pessoas?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/pessoas/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getByTag: async (tag) => {
    const response = await fetch(`${API_URL}/pessoas/tag/${tag}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (pessoa) => {
    const response = await fetch(`${API_URL}/pessoas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(pessoa)
    });
    return handleResponse(response);
  },

  update: async (id, pessoa) => {
    const response = await fetch(`${API_URL}/pessoas/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(pessoa)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/pessoas/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== COMUNICAÇÃO ====================

export const ComunicacaoAPI = {
  list: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/comunicacao?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/comunicacao/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getByPessoa: async (pessoaId) => {
    const response = await fetch(`${API_URL}/comunicacao/pessoa/${pessoaId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (comunicacao) => {
    const response = await fetch(`${API_URL}/comunicacao`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(comunicacao)
    });
    return handleResponse(response);
  },

  update: async (id, comunicacao) => {
    const response = await fetch(`${API_URL}/comunicacao/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(comunicacao)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/comunicacao/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== ACOMPANHAMENTO ====================

export const AcompanhamentoAPI = {
  list: async (page = 1, limit = 100) => {
    const response = await fetch(`${API_URL}/acompanhamento?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/acompanhamento/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getByPessoa: async (pessoaId) => {
    const response = await fetch(`${API_URL}/acompanhamento/pessoa/${pessoaId}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  create: async (acompanhamento) => {
    const response = await fetch(`${API_URL}/acompanhamento`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(acompanhamento)
    });
    return handleResponse(response);
  },

  update: async (id, acompanhamento) => {
    const response = await fetch(`${API_URL}/acompanhamento/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(acompanhamento)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/acompanhamento/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== RELATÓRIOS ====================

export const RelatoriosAPI = {
  list: async (page = 1, limit = 10) => {
    const response = await fetch(`${API_URL}/relatorios?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/relatorios/${id}`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  generatePessoas: async (filtro = {}) => {
    const response = await fetch(`${API_URL}/relatorios/generate/pessoas`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filtro })
    });
    return handleResponse(response);
  },

  generateComunicacoes: async (filtro = {}) => {
    const response = await fetch(`${API_URL}/relatorios/generate/comunicacoes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filtro })
    });
    return handleResponse(response);
  },

  generateAcompanhamentos: async (filtro = {}) => {
    const response = await fetch(`${API_URL}/relatorios/generate/acompanhamentos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ filtro })
    });
    return handleResponse(response);
  },

  // GET - Buscar dados reais sem salvar
  getMembros: async () => {
    const response = await fetch(`${API_URL}/relatorios/membros`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getVisitantes: async () => {
    const response = await fetch(`${API_URL}/relatorios/visitantes`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getObreiros: async () => {
    const response = await fetch(`${API_URL}/relatorios/obreiros`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getComunicacoes: async () => {
    const response = await fetch(`${API_URL}/relatorios/comunicacoes`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAcompanhamentos: async () => {
    const response = await fetch(`${API_URL}/relatorios/acompanhamentos`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/relatorios/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

// ==================== DASHBOARD ====================

export const DashboardAPI = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_URL}/dashboard/categories`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCrescimentoMensal: async () => {
    const response = await fetch(`${API_URL}/dashboard/crescimento-mensal`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAcompanhamentosDiarios: async () => {
    const response = await fetch(`${API_URL}/dashboard/acompanhamentos-diarios`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAtividade: async () => {
    const response = await fetch(`${API_URL}/dashboard/atividade`, {
      headers: getHeaders()
    });
    return handleResponse(response);
  }
};

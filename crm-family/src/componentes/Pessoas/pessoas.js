import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PessoasAPI } from '../../services/api';
import MenuLateral from '../menuLateral/menuLateral';
import './pessoas.css';

function Pessoas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tagStats, setTagStats] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    tags: [],
    observacoes: ''
  });
  const [saving, setSaving] = useState(false);

  // Tags estáticas - podem ser movidas para o banco depois
  const categories = [
    { name: 'Líderes', count: 0, change: '+2 no mês', color: '#d95d39', icon: '★', tag: 'lideres' },
    { name: 'Obreiros', count: 0, change: '+2 no mês', color: '#5a7fdb', icon: '♥', tag: 'obreiros' },
    { name: 'Voluntários', count: 0, change: '+9 no mês', color: '#4caf50', icon: '⚒', tag: 'voluntarios' },
    { name: 'Membros', count: 0, change: '+20 no mês', color: '#26a69a', icon: '👤', tag: 'membros' },
    { name: 'Visitantes', count: 0, change: '+27 no mês', color: '#8e44ad', icon: '◆', tag: 'visitantes' }
  ];

  const tags = [
    { name: 'Novo Convertido', color: '#2d3e6f', slug: 'novo-convertido' },
    { name: 'Precisa de Visita', color: '#ff9933', slug: 'precisa-de-visita' },
    { name: 'Discipulado', color: '#4caf50', slug: 'discipulado' },
    { name: 'Voluntários', color: '#8e44ad', slug: 'voluntarios' },
    { name: 'Líderes', color: '#d32f2f', slug: 'lideres' },
    { name: 'Obreiros', color: '#00796b', slug: 'obreiros' },
    { name: 'Visitantes', color: '#2d3e6f', slug: 'visitantes' },
    { name: 'Membros', color: '#6d4c41', slug: 'membros' }
  ];

  useEffect(() => {
    loadPessoas();
    loadTagStats();
  }, []);

  const loadPessoas = async () => {
    try {
      setLoading(true);
      const response = await PessoasAPI.list(1, 1000);
      setPessoas(response.data || []);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pessoas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTagStats = async () => {
    try {
      const response = await PessoasAPI.getTagStats();
      setTagStats(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar estatísticas de tags:', err);
    }
  };

  const handleTagClick = (slug) => {
    navigate(`/tag/${slug}`);
  };

  // Calcular contagens reais das tags
  const getTagCount = (tagName) => {
    return pessoas.filter(p => 
      p.tags && p.tags.some(t => t.toLowerCase() === tagName.toLowerCase())
    ).length;
  };

  // Obter mudança mensal da tag a partir dos dados do banco
  const getTagChange = (tagName) => {
    const stat = tagStats.find(s => s.tag === tagName.toLowerCase());
    if (!stat || stat.monthChange === 0) {
      return 'sem mudanças';
    }
    return `+${stat.monthChange} no mês`;
  };

  const handleOpenModal = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      tags: [],
      observacoes: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      tags: [],
      observacoes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter(t => t !== tagName)
        : [...prev.tags, tagName]
    }));
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      alert('Por favor, preencha o nome');
      return;
    }

    try {
      setSaving(true);
      await PessoasAPI.create(formData);
      await loadPessoas(); // Recarregar lista
      await loadTagStats(); // Recarregar estatísticas
      handleCloseModal();
      alert('Pessoa adicionada com sucesso!');
    } catch (err) {
      alert('Erro ao salvar: ' + err.message);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pessoas-container">
      <MenuLateral />
      <div className="pessoas-content">
        <header className="pessoas-header">
          <h1 className="pessoas-title">Categorias/Tags</h1>
        </header>

        {error && <div className="error-message">{error}</div>}

        <div className="categorias-section">
          <h2 className="section-title">Categorias</h2>
          <div className="categorias-grid">
            {categories.map((cat, index) => (
              <div 
                key={index} 
                className="categoria-card"
                style={{ background: cat.color }}
                onClick={() => handleTagClick(cat.tag)}
              >
                <div className="categoria-header">
                  <span className="categoria-icon">{cat.icon}</span>
                  <span className="categoria-name">{cat.name}</span>
                </div>
                <div className="categoria-count">
                  {loading ? '...' : getTagCount(cat.name).toLocaleString('pt-BR')}
                </div>
                <div className="categoria-change">
                  <span className="change-icon"></span> {loading ? '...' : getTagChange(cat.name)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="tags-section">
          <div className="tags-header">
            <h2 className="section-title">Tags</h2>
            <div className="tags-actions">
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              <button className="nova-tag-btn" onClick={handleOpenModal}>
                Adicionar Membro <span className="plus-icon">+</span>
              </button>
            </div>
          </div>

          <div className="tags-grid">
            {tags.filter(tag => 
              tag.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map((tag, index) => (
              <div 
                key={index} 
                className="tag-item"
                onClick={() => handleTagClick(tag.slug)}
                role="button"
                tabIndex={0}
              >
                <div className="tag-left">
                  <span 
                    className="tag-color-circle" 
                    style={{ background: tag.color }}
                  ></span>
                  <span className="tag-name">{tag.name}</span>
                </div>
                <input 
                  type="radio" 
                  name="tag-selection"
                  checked={selectedTag === tag.name}
                  onChange={() => setSelectedTag(tag.name)}
                  className="tag-radio"
                />
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Adicionar Novo Membro</h2>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome completo"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="exemplo@email.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Tags</label>
                  <div className="tags-select">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className={`tag-checkbox ${formData.tags.includes(tag.name) ? 'selected' : ''}`}
                        onClick={() => handleTagToggle(tag.name)}
                      >
                        <span
                          className="tag-color-dot"
                          style={{ background: tag.color }}
                        ></span>
                        <span>{tag.name}</span>
                        {formData.tags.includes(tag.name) && <span className="check-icon">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Observações</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleInputChange}
                    placeholder="Informações adicionais..."
                    className="form-textarea"
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button 
                  className="btn-save" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pessoas;

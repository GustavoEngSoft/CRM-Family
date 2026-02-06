import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PessoasAPI } from '../../services/api';
import MenuLateral from '../menuLateral/menuLateral';
import './pessoasPorTag.css';

function PessoasPorTag() {
  const { tagName } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    tags: []
  });
  const itemsPerPage = 6;

  const tagNames = {
    'novo-convertido': 'Novo Convertido',
    'precisa-de-visita': 'Precisa de Visita',
    'discipulado': 'Discipulado',
    'voluntarios': 'Voluntários',
    'lideres': 'Líderes',
    'obreiros': 'Obreiros',
    'visitantes': 'Visitantes',
    'membros': 'Membros'
  };

  const allTags = [
    { name: 'Novo Convertido', color: '#2d3e6f' },
    { name: 'Precisa de Visita', color: '#ff9933' },
    { name: 'Discipulado', color: '#4caf50' },
    { name: 'Voluntários', color: '#8e44ad' },
    { name: 'Líderes', color: '#d32f2f' },
    { name: 'Obreiros', color: '#00796b' },
    { name: 'Visitantes', color: '#2d3e6f' },
    { name: 'Membros', color: '#6d4c41' }
  ];

  const displayName = tagNames[tagName] || tagName;

  const loadPessoasByTag = async () => {
    try {
      setLoading(true);
      const tagToSearch = tagNames[tagName] || tagName;
      const data = await PessoasAPI.getByTag(tagToSearch, true);
      setPessoas(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar pessoas: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPessoasByTag();
  }, [tagName]);

  const filteredPessoas = pessoas.filter(pessoa =>
    pessoa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPessoas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPessoas = filteredPessoas.slice(startIndex, endIndex);

  const handleToggleAtivo = async (pessoa) => {
    try {
      const updated = await PessoasAPI.update(pessoa.id, { ativo: !pessoa.ativo });
      setPessoas(pessoas.map(p => (p.id === pessoa.id ? { ...p, ativo: updated.ativo } : p)));
    } catch (err) {
      alert('Erro ao atualizar status: ' + err.message);
    }
  };

  const handleEditClick = (pessoa) => {
    setEditingPessoa(pessoa);
    setFormData({
      nome: pessoa.nome || '',
      email: pessoa.email || '',
      telefone: pessoa.telefone || '',
      endereco: pessoa.endereco || '',
      tags: pessoa.tags || []
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingPessoa(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = (tagName) => {
    if (!formData.tags.includes(tagName)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagName]
      }));
    }
  };

  const handleRemoveTag = (tagName) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagName)
    }));
  };

  const handleSave = async () => {
    try {
      await PessoasAPI.update(editingPessoa.id, formData);
      setPessoas(pessoas.map(p =>
        p.id === editingPessoa.id ? { ...p, ...formData } : p
      ));
      handleModalClose();
      alert('Pessoa atualizada com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar pessoa: ' + err.message);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="pessoas-tag-container">
      <MenuLateral />
      <div className="pessoas-tag-content">
        <header className="pessoas-tag-header">
          <h1 className="pessoas-tag-title">{displayName}</h1>
          <div className="pessoas-tag-actions">
            <div className="search-box-tag">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input-tag"
              />
              <span className="search-icon-tag">🔍</span>
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Carregando...</div>}

        <div className="pessoas-list">
          {currentPessoas.map((pessoa) => (
            <div key={pessoa.id} className="pessoa-item">
              <div className="pessoa-info">
                <span className="pessoa-nome">{pessoa.nome}</span>
              </div>
              <div className="pessoa-actions">
                <button 
                  className="pessoa-edit-btn"
                  onClick={() => handleEditClick(pessoa)}
                >
                  ✏️
                </button>
                <button
                  className={`pessoa-check-btn ${pessoa.ativo ? 'selected' : ''}`}
                  onClick={() => handleToggleAtivo(pessoa)}
                  title={pessoa.ativo ? 'Inativar' : 'Ativar'}
                >
                  <span className="check-icon">✓</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ‹
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages || 1}
          </span>
          <button 
            className="pagination-btn"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Editar Informações</h2>

            <div className="form-group full">
              <input
                type="text"
                name="nome"
                placeholder="Nome completo"
                value={formData.nome}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>

            <div className="form-group-row">
              <input
                type="tel"
                name="telefone"
                placeholder="(xx) x xxxx-xxxx"
                value={formData.telefone}
                onChange={handleFormChange}
                className="form-input"
              />
              <input
                type="email"
                name="email"
                placeholder="xxxx@gmail.com"
                value={formData.email}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>

            <div className="form-group full">
              <input
                type="text"
                name="endereco"
                placeholder="Endereço"
                value={formData.endereco}
                onChange={handleFormChange}
                className="form-input"
              />
            </div>

            <div className="form-group full">
              <select 
                className="form-select"
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTag(e.target.value);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Adicionar Etiqueta</option>
                {allTags.map((tag, idx) => (
                  <option key={idx} value={tag.name}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-tags">
              {formData.tags.map((tag, idx) => {
                const tagInfo = allTags.find(t => t.name === tag);
                return (
                  <div 
                    key={idx} 
                    className="tag-badge"
                    style={{ background: tagInfo?.color || '#666' }}
                  >
                    <span>{tag}</span>
                    <button
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="modal-buttons">
              <button className="btn-salvar" onClick={handleSave}>
                Salvar
              </button>
              <button className="btn-fechar" onClick={handleModalClose}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PessoasPorTag;

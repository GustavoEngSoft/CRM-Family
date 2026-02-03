import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import './pessoas.css';

function Pessoas() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const categories = [
    { name: 'Líderes', count: 28, change: '+2 no mês', color: '#d95d39', icon: '★' },
    { name: 'Obreiros', count: 53, change: '+2 no mês', color: '#5a7fdb', icon: '♥' },
    { name: 'Voluntários', count: 176, change: '+9 no mês', color: '#4caf50', icon: '⚒' },
    { name: 'Membros', count: 2184, change: '+20 no mês', color: '#26a69a', icon: '👤' },
    { name: 'Visitantes', count: 242, change: '+27 no mês', color: '#8e44ad', icon: '◆' }
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

  const handleTagClick = (slug) => {
    navigate(`/tag/${slug}`);
  };

  return (
    <div className="pessoas-container">
      <MenuLateral />
      <div className="pessoas-content">
        <header className="pessoas-header">
          <h1 className="pessoas-title">Categorias/Tags</h1>
        </header>

        <div className="categorias-section">
          <h2 className="section-title">Categorias</h2>
          <div className="categorias-grid">
            {categories.map((cat, index) => (
              <div 
                key={index} 
                className="categoria-card"
                style={{ background: cat.color }}
              >
                <div className="categoria-header">
                  <span className="categoria-icon">{cat.icon}</span>
                  <span className="categoria-name">{cat.name}</span>
                </div>
                <div className="categoria-count">{cat.count.toLocaleString('pt-BR')}</div>
                <div className="categoria-change">
                  <span className="change-icon"></span> {cat.change}
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
              <button className="nova-tag-btn">
                Nova Tag <span className="plus-icon">+</span>
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
      </div>
    </div>
  );
}

export default Pessoas;

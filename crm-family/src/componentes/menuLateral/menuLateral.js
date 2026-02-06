import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './menuLateral.css';
import './user-info.css';

function MenuLateral() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [pessoasOpen, setPessoasOpen] = useState(false);
  const [comunicacaoOpen, setComunicacaoOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (window.confirm('Deseja sair da aplicação?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="menu-lateral">
      <div className="menu-logo">
        <img src="/logoIgreja.png" alt="Logo" className="menu-logo-img" />
      </div>

      {user && (
        <div className="menu-user-info">
          <p className="user-name">{user.nome}</p>
          <p className="user-email">{user.email}</p>
        </div>
      )}

      <nav className="menu-nav">
        <div className="menu-item">
          <div 
            className="menu-item-header"
            onClick={() => handleNavigation('/dashboard')}
          >
            <span className="menu-icon">📊</span>
            <span className="menu-text">Dashboard</span>
          </div>
        </div>

        <div className="menu-item">
          <div 
            className="menu-item-header" 
            onClick={() => setPessoasOpen(!pessoasOpen)}
          >
            <span className="menu-icon">👥</span>
            <span className="menu-text">Categorias/Tags</span>
          </div>
          {pessoasOpen && (
            <div className="menu-submenu">
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/categorias-tags')}
              >
                Categorias/Tags
              </div>

              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/tag/lideres')}
              >
                Líderes
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/tag/obreiros')}
              >
                Obreiros
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/tag/voluntarios')}
              >
                Voluntários
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/tag/membros')}
              >
                Membros
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/tag/visitantes')}
              >
                Visitantes
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <div 
            className="menu-item-header"
            onClick={() => handleNavigation('/acompanhamento')}
          >
            <span className="menu-icon">🔄</span>
            <span className="menu-text">Acompanhamento</span>
          </div>
        </div>

        <div className="menu-item">
          <div 
            className="menu-item-header"
            onClick={() => handleNavigation('/eventos')}
          >
            <span className="menu-icon">📅</span>
            <span className="menu-text">Eventos</span>
          </div>
        </div>

        <div className="menu-item">
          <div 
            className="menu-item-header"
            onClick={() => setComunicacaoOpen(!comunicacaoOpen)}
          >
            <span className="menu-icon">✈️</span>
            <span className="menu-text">Comunicação</span>
          </div>
          {comunicacaoOpen && (
            <div className="menu-submenu">
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/comunicacao?tab=enviar')}
              >
                Enviar mensagem
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/comunicacao?tab=modelos')}
              >
                Modelos de mensagem
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/comunicacao?tab=campanhas')}
              >
                Campanhas automáticas
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/comunicacao?tab=historico')}
              >
                Histórico de mensagens
              </div>
            </div>
          )}
        </div>

        <div className="menu-item">
          <div 
            className="menu-item-header"
            onClick={() => setRelatoriosOpen(!relatoriosOpen)}
          >
            <span className="menu-icon">📄</span>
            <span className="menu-text">Relatórios</span>
          </div>
          {relatoriosOpen && (
            <div className="menu-submenu">
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=membros')}
              >
                De membros
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=visitantes')}
              >
                De visitantes
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=obreiros')}
              >
                De obreiros
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=acompanhamento')}
              >
                De acompanhamento
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=mensagens')}
              >
                De mensagens enviadas
              </div>
              <div 
                className="menu-subitem"
                onClick={() => handleNavigation('/relatorios?tab=exportar')}
              >
                Exportar
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="menu-logout">
        <div 
          className="menu-item-header"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <span className="menu-icon">🚪</span>
          <span className="menu-text">Logout</span>
        </div>
      </div>
    </div>
  );
}

export default MenuLateral;

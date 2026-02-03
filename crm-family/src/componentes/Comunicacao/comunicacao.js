import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import './comunicacao.css';

function Comunicacao() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'enviar';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);
  const [mensagem, setMensagem] = useState({
    destinatario: '',
    assunto: '',
    conteudo: '',
    tipo: 'sms'
  });
  const [modelos, setModelos] = useState([
    { id: 1, nome: 'Boas-vindas', conteudo: 'Bem-vindo à nossa comunidade!' },
    { id: 2, nome: 'Aniversário', conteudo: 'Parabéns pelo seu aniversário!' },
    { id: 3, nome: 'Confirmação de visita', conteudo: 'Confirme sua presença na próxima reunião' }
  ]);
  const [campanhas, setCampanhas] = useState([
    { id: 1, nome: 'Lembrança semanal', status: 'Ativa', frequencia: 'Semanal', proxima: '05/02/2026' },
    { id: 2, nome: 'Aniversariantes', status: 'Ativa', frequencia: 'Diária', proxima: '02/02/2026' }
  ]);
  const [historico, setHistorico] = useState([
    { id: 1, destinatario: 'João Silva', assunto: 'Boas-vindas', data: '02/02/2026 14:30', status: 'Enviado' },
    { id: 2, destinatario: 'Maria Santos', assunto: 'Confirmação', data: '01/02/2026 10:15', status: 'Enviado' },
    { id: 3, destinatario: 'Pedro Costa', assunto: 'Lembrança', data: '31/01/2026 18:45', status: 'Lido' }
  ]);

  const handleEnviarMensagem = () => {
    if (mensagem.destinatario.trim() && mensagem.conteudo.trim()) {
      alert('Mensagem enviada com sucesso!');
      setMensagem({ destinatario: '', assunto: '', conteudo: '', tipo: 'sms' });
    }
  };

  const handleDeleteModelo = (id) => {
    if (window.confirm('Deseja excluir este modelo?')) {
      setModelos(modelos.filter(m => m.id !== id));
    }
  };

  const handleDeleteCampanha = (id) => {
    if (window.confirm('Deseja excluir esta campanha?')) {
      setCampanhas(campanhas.filter(c => c.id !== id));
    }
  };

  return (
    <div className="comunicacao-container">
      <MenuLateral />
      <div className="comunicacao-content">
        <header className="comunicacao-header">
          <h1 className="comunicacao-title">Comunicação</h1>
        </header>

        <div className="comunicacao-tabs">
          <button 
            className={`tab-btn ${activeTab === 'enviar' ? 'active' : ''}`}
            onClick={() => setActiveTab('enviar')}
          >
            Enviar mensagem
          </button>
          <button 
            className={`tab-btn ${activeTab === 'modelos' ? 'active' : ''}`}
            onClick={() => setActiveTab('modelos')}
          >
            Modelos
          </button>
          <button 
            className={`tab-btn ${activeTab === 'campanhas' ? 'active' : ''}`}
            onClick={() => setActiveTab('campanhas')}
          >
            Campanhas
          </button>
          <button 
            className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            Histórico
          </button>
        </div>

        <div className="comunicacao-content-area">
          {activeTab === 'enviar' && (
            <div className="tab-content">
              <h2>Enviar Mensagem</h2>
              <div className="form-group-com">
                <label>Destinatário</label>
                <input
                  type="text"
                  placeholder="Nome ou email"
                  value={mensagem.destinatario}
                  onChange={(e) => setMensagem({ ...mensagem, destinatario: e.target.value })}
                  className="form-input-com"
                />
              </div>

              <div className="form-group-com">
                <label>Tipo</label>
                <select
                  value={mensagem.tipo}
                  onChange={(e) => setMensagem({ ...mensagem, tipo: e.target.value })}
                  className="form-select-com"
                >
                  <option value="sms">SMS</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div className="form-group-com">
                <label>Assunto</label>
                <input
                  type="text"
                  placeholder="Assunto da mensagem"
                  value={mensagem.assunto}
                  onChange={(e) => setMensagem({ ...mensagem, assunto: e.target.value })}
                  className="form-input-com"
                />
              </div>

              <div className="form-group-com">
                <label>Conteúdo</label>
                <textarea
                  placeholder="Digite sua mensagem..."
                  value={mensagem.conteudo}
                  onChange={(e) => setMensagem({ ...mensagem, conteudo: e.target.value })}
                  className="form-textarea-com"
                  rows="6"
                />
              </div>

              <div className="form-buttons-com">
                <button className="btn-enviar" onClick={handleEnviarMensagem}>
                  Enviar Mensagem
                </button>
                <button className="btn-cancelar" onClick={() => setMensagem({ destinatario: '', assunto: '', conteudo: '', tipo: 'sms' })}>
                  Limpar
                </button>
              </div>
            </div>
          )}

          {activeTab === 'modelos' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Modelos de Mensagem</h2>
                <button className="btn-novo">+ Novo Modelo</button>
              </div>
              <div className="modelos-list">
                {modelos.map((modelo) => (
                  <div key={modelo.id} className="modelo-card">
                    <div className="modelo-info">
                      <h3>{modelo.nome}</h3>
                      <p>{modelo.conteudo}</p>
                    </div>
                    <div className="modelo-actions">
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon delete" onClick={() => handleDeleteModelo(modelo.id)} title="Excluir">🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'campanhas' && (
            <div className="tab-content">
              <div className="section-header">
                <h2>Campanhas Automáticas</h2>
                <button className="btn-novo">+ Nova Campanha</button>
              </div>
              <div className="campanhas-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Status</th>
                      <th>Frequência</th>
                      <th>Próxima Execução</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campanhas.map((campanha) => (
                      <tr key={campanha.id}>
                        <td>{campanha.nome}</td>
                        <td>
                          <span className={`status ${campanha.status.toLowerCase()}`}>
                            {campanha.status}
                          </span>
                        </td>
                        <td>{campanha.frequencia}</td>
                        <td>{campanha.proxima}</td>
                        <td className="table-actions">
                          <button className="btn-icon" title="Editar">✏️</button>
                          <button className="btn-icon delete" onClick={() => handleDeleteCampanha(campanha.id)} title="Excluir">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="tab-content">
              <h2>Histórico de Mensagens</h2>
              <div className="historico-table">
                <table>
                  <thead>
                    <tr>
                      <th>Destinatário</th>
                      <th>Assunto</th>
                      <th>Data/Hora</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item) => (
                      <tr key={item.id}>
                        <td>{item.destinatario}</td>
                        <td>{item.assunto}</td>
                        <td>{item.data}</td>
                        <td>
                          <span className={`status ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comunicacao;

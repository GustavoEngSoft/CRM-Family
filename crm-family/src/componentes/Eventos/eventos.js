import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import API_BASE_URL from '../../config/api';
import './eventos.css';

function Eventos() {
  const navigate = useNavigate();
  const { eventoId } = useParams();
  
  const [view, setView] = useState(eventoId ? 'detalhes' : 'lista'); // lista, criar, detalhes
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [showModalEvento, setShowModalEvento] = useState(false);
  const [showModalInscricao, setShowModalInscricao] = useState(false);

  const [formEvento, setFormEvento] = useState({
    nome: '',
    data: '',
    horario: '',
    descricao: '',
    local: ''
  });

  const [formInscricao, setFormInscricao] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    tipo: 'membro'
  });

  const [savingEvento, setSavingEvento] = useState(false);
  const [savingInscricao, setSavingInscricao] = useState(false);

  // Carregar eventos na inicialização
  useEffect(() => {
    loadEventos();
    if (eventoId) {
      loadEventoDetalhes(eventoId);
    }
  }, [eventoId]);

  const loadEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/eventos`);
      
      if (!response.ok) throw new Error('Erro ao carregar eventos');
      
      const data = await response.json();
      setEventos(data);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEventoDetalhes = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/eventos/${id}/inscricoes`);
      
      if (!response.ok) throw new Error('Erro ao carregar evento');
      
      const data = await response.json();
      setSelectedEvento(data.evento);
      setInscricoes(data.inscricoes);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    }
  };

  const handleCreateEvento = async () => {
    try {
      if (!formEvento.nome || !formEvento.data || !formEvento.horario) {
        alert('Preencha os campos obrigatórios');
        return;
      }

      setSavingEvento(true);

      const response = await fetch(`${API_BASE_URL}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formEvento)
      });

      if (!response.ok) throw new Error('Erro ao criar evento');

      const newEvento = await response.json();
      setEventos([newEvento, ...eventos]);
      setShowModalEvento(false);
      setFormEvento({ nome: '', data: '', horario: '', descricao: '', local: '' });
      alert('Evento criado com sucesso!');
    } catch (err) {
      alert('Erro ao criar evento: ' + err.message);
    } finally {
      setSavingEvento(false);
    }
  };

  const handleCreateInscricao = async () => {
    try {
      if (!formInscricao.nome || !formInscricao.telefone || !formInscricao.endereco) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }

      setSavingInscricao(true);

      const response = await fetch(
        `${API_BASE_URL}/eventos/${selectedEvento.id}/inscricoes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            evento_id: selectedEvento.id,
            ...formInscricao
          })
        }
      );

      if (!response.ok) throw new Error('Erro ao criar inscrição');

      const newInscricao = await response.json();
      setInscricoes([newInscricao, ...inscricoes]);
      setShowModalInscricao(false);
      setFormInscricao({ nome: '', telefone: '', endereco: '', tipo: 'membro' });
      alert('Inscrição realizada com sucesso!');
    } catch (err) {
      alert('Erro ao criar inscrição: ' + err.message);
    } finally {
      setSavingInscricao(false);
    }
  };

  const handleDeleteInscricao = async (inscricaoId) => {
    if (!window.confirm('Deseja remover essa inscrição?')) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/eventos/inscricoes/${inscricaoId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Erro ao deletar inscrição');

      setInscricoes(inscricoes.filter(i => i.id !== inscricaoId));
      alert('Inscrição removida com sucesso!');
    } catch (err) {
      alert('Erro ao remover inscrição: ' + err.message);
    }
  };

  const handleDeleteEvento = async (id) => {
    if (!window.confirm('Deseja deletar esse evento?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erro ao deletar evento');

      setEventos(eventos.filter(e => e.id !== id));
      setView('lista');
      alert('Evento deletado com sucesso!');
    } catch (err) {
      alert('Erro ao deletar evento: ' + err.message);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <div className="eventos-container">
      <MenuLateral />
      
      <div className="eventos-content">
        {/* HEADER */}
        <div className="eventos-header">
          <h1>📅 Eventos</h1>
          {view === 'lista' && (
            <button 
              className="btn-primary"
              onClick={() => setShowModalEvento(true)}
            >
              + Novo Evento
            </button>
          )}
          {view === 'detalhes' && (
            <button 
              className="btn-secondary"
              onClick={() => setView('lista')}
            >
              ← Voltar
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* VISUALIZAÇÃO LISTA */}
        {view === 'lista' && (
          <div className="eventos-lista">
            {loading ? (
              <p>Carregando eventos...</p>
            ) : eventos.length === 0 ? (
              <p className="empty-message">Nenhum evento cadastrado ainda</p>
            ) : (
              <div className="eventos-grid">
                {eventos.map(evento => (
                  <div key={evento.id} className="evento-card">
                    <div className="evento-card-header">
                      <h3>{evento.nome}</h3>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteEvento(evento.id)}
                        title="Deletar evento"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="evento-info">
                      <p><strong>📅 Data:</strong> {formatarData(evento.data)}</p>
                      <p><strong>🕐 Horário:</strong> {evento.horario}</p>
                      {evento.local && <p><strong>📍 Local:</strong> {evento.local}</p>}
                      {evento.descricao && <p><strong>📝 Descrição:</strong> {evento.descricao}</p>}
                    </div>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSelectedEvento(evento);
                        setView('detalhes');
                        loadEventoDetalhes(evento.id);
                      }}
                    >
                      Ver Inscrições
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISUALIZAÇÃO DETALHES */}
        {view === 'detalhes' && selectedEvento && (
          <div className="evento-detalhes">
            <div className="detalhes-header">
              <div>
                <h2>{selectedEvento.nome}</h2>
                <p className="detalhes-info">
                  📅 {formatarData(selectedEvento.data)} • 🕐 {selectedEvento.horario}
                  {selectedEvento.local && ` • 📍 ${selectedEvento.local}`}
                </p>
              </div>
            </div>

            <div className="inscricoes-section">
              <div className="inscricoes-header">
                <div>
                  <h3>📋 Inscrições</h3>
                  <p className="stats">
                    Total: <strong>{inscricoes.length}</strong> | 
                    Membros: <strong>{inscricoes.filter(i => i.tipo === 'membro').length}</strong> | 
                    Visitantes: <strong>{inscricoes.filter(i => i.tipo === 'visitante').length}</strong>
                  </p>
                </div>
                <div className="inscricoes-buttons">
                  <button 
                    className="btn-primary"
                    onClick={() => navigate(`/relatorio-eventos/${selectedEvento.id}`)}
                    title="Ver relatório detalhado"
                  >
                    📊 Relatório
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setShowModalInscricao(true)}
                  >
                    + Nova Inscrição
                  </button>
                </div>
              </div>

              {inscricoes.length === 0 ? (
                <p className="empty-message">Nenhuma inscrição neste evento</p>
              ) : (
                <div className="inscricoes-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Endereço</th>
                        <th>Tipo</th>
                        <th>Data da Inscrição</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inscricoes.map(inscricao => (
                        <tr key={inscricao.id}>
                          <td>{inscricao.nome}</td>
                          <td>{inscricao.telefone}</td>
                          <td>{inscricao.endereco}</td>
                          <td>
                            <span className={`badge-tipo ${inscricao.tipo}`}>
                              {inscricao.tipo === 'membro' ? '👤 Membro' : '👁️ Visitante'}
                            </span>
                          </td>
                          <td>{new Date(inscricao.data_inscricao).toLocaleDateString('pt-BR')}</td>
                          <td>
                            <button
                              className="btn-delete-small"
                              onClick={() => handleDeleteInscricao(inscricao.id)}
                              title="Remover inscrição"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL NOVO EVENTO */}
        {showModalEvento && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Novo Evento</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateEvento(); }}>
                <div className="form-group">
                  <label>Nome do Evento *</label>
                  <input
                    type="text"
                    value={formEvento.nome}
                    onChange={(e) => setFormEvento({ ...formEvento, nome: e.target.value })}
                    placeholder="Ex: Culto de Domingo"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Data *</label>
                    <input
                      type="date"
                      value={formEvento.data}
                      onChange={(e) => setFormEvento({ ...formEvento, data: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Horário *</label>
                    <input
                      type="time"
                      value={formEvento.horario}
                      onChange={(e) => setFormEvento({ ...formEvento, horario: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Local</label>
                  <input
                    type="text"
                    value={formEvento.local}
                    onChange={(e) => setFormEvento({ ...formEvento, local: e.target.value })}
                    placeholder="Ex: Templo Principal"
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    value={formEvento.descricao}
                    onChange={(e) => setFormEvento({ ...formEvento, descricao: e.target.value })}
                    placeholder="Adicione detalhes sobre o evento..."
                    rows="3"
                  />
                </div>

                <div className="form-buttons">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModalEvento(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={savingEvento}
                  >
                    {savingEvento ? 'Salvando...' : 'Criar Evento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOVA INSCRIÇÃO */}
        {showModalInscricao && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Nova Inscrição</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateInscricao(); }}>
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    value={formInscricao.nome}
                    onChange={(e) => setFormInscricao({ ...formInscricao, nome: e.target.value })}
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Telefone *</label>
                  <input
                    type="tel"
                    value={formInscricao.telefone}
                    onChange={(e) => setFormInscricao({ ...formInscricao, telefone: e.target.value })}
                    placeholder="(XX) XXXXX-XXXX"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Endereço *</label>
                  <textarea
                    value={formInscricao.endereco}
                    onChange={(e) => setFormInscricao({ ...formInscricao, endereco: e.target.value })}
                    placeholder="Rua, número, complemento..."
                    rows="2"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tipo de Participante *</label>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="membro"
                        checked={formInscricao.tipo === 'membro'}
                        onChange={(e) => setFormInscricao({ ...formInscricao, tipo: e.target.value })}
                      />
                      👤 Membro
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="visitante"
                        checked={formInscricao.tipo === 'visitante'}
                        onChange={(e) => setFormInscricao({ ...formInscricao, tipo: e.target.value })}
                      />
                      👁️ Visitante
                    </label>
                  </div>
                </div>

                <div className="form-buttons">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowModalInscricao(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                    disabled={savingInscricao}
                  >
                    {savingInscricao ? 'Salvando...' : 'Confirmar Inscrição'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Eventos;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import { ComunicacaoAPI, PessoasAPI } from '../../services/api';
import './comunicacao.css';

function Comunicacao() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'enviar';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pessoas, setPessoas] = useState([]);
  const [historico, setHistorico] = useState([]);

  // Enviar mensagem
  const [mensagem, setMensagem] = useState({
    pessoa_id: '',
    tipo: 'email',
    assunto: '',
    corpo: '',
    telefone: ''
  });

  // Modelos
  const [modelos, setModelos] = useState([]);
  const [showModeloForm, setShowModeloForm] = useState(false);
  const [novoModelo, setNovoModelo] = useState({
    nome: '',
    conteudo: ''
  });

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pessoasData, comunicacoesData] = await Promise.all([
        PessoasAPI.list(1, 1000),
        ComunicacaoAPI.list(1, 1000)
      ]);
      
      setPessoas(pessoasData.data || []);
      setHistorico(comunicacoesData.data || []);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPessoaInfo = (pessoaId) => {
    return pessoas.find(p => p.id === pessoaId);
  };

  const handleSelecionarDestinatario = (e) => {
    const pessoaId = e.target.value;
    const pessoa = pessoas.find(p => p.id == pessoaId);
    
    setMensagem({
      ...mensagem,
      pessoa_id: pessoaId,
      telefone: pessoa?.telefone || '',
    });
  };

  const handleEnviarMensagem = async () => {
    if (!mensagem.pessoa_id) {
      alert('Selecione um destinatário');
      return;
    }

    if (!mensagem.corpo.trim()) {
      alert('Digite uma mensagem');
      return;
    }

    if (mensagem.tipo === 'email' && !mensagem.assunto.trim()) {
      alert('Digite um assunto para o email');
      return;
    }

    if (mensagem.tipo === 'whatsapp' && !mensagem.telefone.trim()) {
      alert('Digite o número do WhatsApp');
      return;
    }

    try {
      setSaving(true);
      
      const pessoa = getPessoaInfo(mensagem.pessoa_id);
      
      // Registrar no histórico
      const payload = {
        pessoa_id: mensagem.pessoa_id,
        tipo: mensagem.tipo,
        assunto: mensagem.assunto,
        corpo: mensagem.corpo,
        status: 'enviado'
      };

      await ComunicacaoAPI.create(payload);

      // Redirecionar para cliente nativo
      if (mensagem.tipo === 'email') {
        // Abre cliente de email nativo
        const emailUrl = `mailto:${pessoa.email}?subject=${encodeURIComponent(mensagem.assunto)}&body=${encodeURIComponent(mensagem.corpo)}`;
        window.location.href = emailUrl;
      } else if (mensagem.tipo === 'whatsapp') {
        // Abre WhatsApp Web ou app
        const whatsappUrl = `https://wa.me/${mensagem.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem.corpo)}`;
        window.open(whatsappUrl, '_blank');
      }
      
      alert('Mensagem registrada! Você será redirecionado.');
      setMensagem({
        pessoa_id: '',
        tipo: 'email',
        assunto: '',
        corpo: '',
        telefone: ''
      });
      
      await loadData();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Erro: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSalvarModelo = async () => {
    if (!novoModelo.nome.trim() || !novoModelo.conteudo.trim()) {
      alert('Preencha nome e conteúdo do modelo');
      return;
    }

    try {
      setSaving(true);
      setModelos([...modelos, { 
        id: Date.now(), 
        nome: novoModelo.nome, 
        conteudo: novoModelo.conteudo 
      }]);
      setNovoModelo({ nome: '', conteudo: '' });
      setShowModeloForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModelo = (id) => {
    if (window.confirm('Deseja excluir este modelo?')) {
      setModelos(modelos.filter(m => m.id !== id));
    }
  };

  const handleAplicarModelo = (conteudo) => {
    setMensagem({
      ...mensagem,
      corpo: conteudo
    });
    setActiveTab('enviar');
  };

  const handleDeleteHistorico = async (id) => {
    if (!window.confirm('Deseja excluir este registro?')) return;

    try {
      await ComunicacaoAPI.delete(id);
      await loadData();
      alert('Registro excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const getPessoaNome = (pessoaId) => {
    const pessoa = getPessoaInfo(pessoaId);
    return pessoa ? pessoa.nome : 'Desconhecido';
  };

  const getTipoIcon = (tipo) => {
    return tipo === 'email' ? '📧' : tipo === 'whatsapp' ? '💬' : '📱';
  };

  // Contar quantas vezes uma mensagem foi enviada
  const contarEnvios = (pessoaId, tipo, corpo) => {
    return historico.filter(
      msg => msg.pessoa_id === pessoaId && msg.tipo === tipo && msg.corpo === corpo
    ).length;
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
            className={`tab-btn ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            Histórico
          </button>
        </div>

        <div className="comunicacao-content-area">
          {loading ? (
            <div className="loading-message">Carregando dados...</div>
          ) : (
            <>
              {activeTab === 'enviar' && (
                <div className="tab-content">
                  <h2>Enviar Mensagem</h2>
                  
                  <div className="tipo-selector">
                    <label>Tipo de Mensagem</label>
                    <div className="tipo-buttons">
                      <button
                        className={`tipo-btn ${mensagem.tipo === 'email' ? 'active' : ''}`}
                        onClick={() => setMensagem({ ...mensagem, tipo: 'email' })}
                      >
                        📧 Email
                      </button>
                      <button
                        className={`tipo-btn ${mensagem.tipo === 'whatsapp' ? 'active' : ''}`}
                        onClick={() => setMensagem({ ...mensagem, tipo: 'whatsapp' })}
                      >
                        💬 WhatsApp
                      </button>
                    </div>
                  </div>

                  <div className="form-group-com">
                    <label>Destinatário *</label>
                    <select
                      value={mensagem.pessoa_id}
                      onChange={handleSelecionarDestinatario}
                      className="form-select-com"
                    >
                      <option value="">Selecione uma pessoa</option>
                      {pessoas.map((pessoa) => (
                        <option key={pessoa.id} value={pessoa.id}>
                          {pessoa.nome} {pessoa.email ? `(${pessoa.email})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {mensagem.tipo === 'email' && (
                    <div className="form-group-com">
                      <label>Assunto *</label>
                      <input
                        type="text"
                        placeholder="Assunto do email"
                        value={mensagem.assunto}
                        onChange={(e) => setMensagem({ ...mensagem, assunto: e.target.value })}
                        className="form-input-com"
                      />
                    </div>
                  )}

                  {mensagem.tipo === 'whatsapp' && (
                    <div className="form-group-com">
                      <label>Telefone WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="(00) 0000-0000 ou +55 00 99999-9999"
                        value={mensagem.telefone}
                        onChange={(e) => setMensagem({ ...mensagem, telefone: e.target.value })}
                        className="form-input-com"
                      />
                    </div>
                  )}

                  <div className="form-group-com">
                    <label>Mensagem *</label>
                    <textarea
                      placeholder="Digite sua mensagem aqui..."
                      value={mensagem.corpo}
                      onChange={(e) => setMensagem({ ...mensagem, corpo: e.target.value })}
                      className="form-textarea-com"
                      rows="8"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-enviar-com" 
                      onClick={handleEnviarMensagem}
                      disabled={saving}
                    >
                      {saving ? 'Enviando...' : '📤 Enviar Mensagem'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'modelos' && (
                <div className="tab-content">
                  <div className="modelos-header">
                    <h2>Modelos de Mensagem</h2>
                    <button 
                      className="btn-novo-modelo"
                      onClick={() => setShowModeloForm(!showModeloForm)}
                    >
                      {showModeloForm ? '✕ Cancelar' : '+ Novo Modelo'}
                    </button>
                  </div>

                  {showModeloForm && (
                    <div className="modelo-form">
                      <div className="form-group-com">
                        <label>Nome do Modelo</label>
                        <input
                          type="text"
                          placeholder="Ex: Boas-vindas"
                          value={novoModelo.nome}
                          onChange={(e) => setNovoModelo({ ...novoModelo, nome: e.target.value })}
                          className="form-input-com"
                        />
                      </div>

                      <div className="form-group-com">
                        <label>Conteúdo</label>
                        <textarea
                          placeholder="Digite o conteúdo do modelo..."
                          value={novoModelo.conteudo}
                          onChange={(e) => setNovoModelo({ ...novoModelo, conteudo: e.target.value })}
                          className="form-textarea-com"
                          rows="6"
                        />
                      </div>

                      <div className="form-actions">
                        <button 
                          className="btn-salvar-modelo"
                          onClick={handleSalvarModelo}
                          disabled={saving}
                        >
                          {saving ? 'Salvando...' : 'Salvar Modelo'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="modelos-grid">
                    {modelos.length === 0 ? (
                      <p className="empty-message">Nenhum modelo criado. Crie um novo para começar!</p>
                    ) : (
                      modelos.map((modelo) => (
                        <div key={modelo.id} className="modelo-card">
                          <h3>{modelo.nome}</h3>
                          <p>{modelo.conteudo}</p>
                          <div className="modelo-actions">
                            <button 
                              className="btn-usar-modelo"
                              onClick={() => handleAplicarModelo(modelo.conteudo)}
                            >
                              Usar
                            </button>
                            <button 
                              className="btn-delete-modelo"
                              onClick={() => handleDeleteModelo(modelo.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'historico' && (
                <div className="tab-content">
                  <h2>Histórico de Mensagens</h2>
                  
                  {historico.length === 0 ? (
                    <p className="empty-message">Nenhuma mensagem enviada ainda.</p>
                  ) : (
                    <div className="historico-table">
                      <div className="historico-header">
                        <div className="col-tipo">Tipo</div>
                        <div className="col-destinatario">Destinatário</div>
                        <div className="col-assunto">Assunto/Corpo</div>
                        <div className="col-data">Data/Hora</div>
                        <div className="col-envios">Envios</div>
                        <div className="col-status">Status</div>
                        <div className="col-acao">Ação</div>
                      </div>
                      
                      {historico.map((msg) => (
                        <div key={msg.id} className="historico-row">
                          <div className="col-tipo">{getTipoIcon(msg.tipo)}</div>
                          <div className="col-destinatario">{getPessoaNome(msg.pessoa_id)}</div>
                          <div className="col-assunto">
                            {msg.assunto || (msg.corpo ? msg.corpo.substring(0, 50) + '...' : 'Sem conteúdo')}
                          </div>
                          <div className="col-data">
                            {(() => {
                              const dataString = msg.data_comunicacao || msg.created_at;
                              if (!dataString) return 'Data não disponível';
                              
                              const data = new Date(dataString);
                              if (isNaN(data.getTime())) return 'Data inválida';
                              
                              return data.toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            })()}
                          </div>
                          <div className="col-envios">
                            <span className="envios-badge">
                              {contarEnvios(msg.pessoa_id, msg.tipo, msg.corpo)}
                            </span>
                          </div>
                          <div className="col-status">
                            <span className={`status-badge status-${msg.status}`}>
                              {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                            </span>
                          </div>
                          <div className="col-acao">
                            <button 
                              className="btn-delete-historico"
                              onClick={() => handleDeleteHistorico(msg.id)}
                              title="Excluir"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comunicacao;

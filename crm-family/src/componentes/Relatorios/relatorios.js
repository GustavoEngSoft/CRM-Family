import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import { RelatoriosAPI } from '../../services/api';
import './relatorios.css';

function Relatorios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'membros';
  const [activeTab, setActiveTab] = useState(tabParam);
  const [loading, setLoading] = useState(true);

  const [membros, setMembros] = useState([]);
  const [visitantes, setVisitantes] = useState([]);
  const [obreiros, setObreiros] = useState([]);
  const [acompanhamento, setAcompanhamento] = useState([]);
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        membrosData,
        visitantesData,
        obreirosData,
        acompanhamentoData,
        mensagensData
      ] = await Promise.all([
        RelatoriosAPI.getMembros(),
        RelatoriosAPI.getVisitantes(),
        RelatoriosAPI.getObreiros(),
        RelatoriosAPI.getAcompanhamentos(),
        RelatoriosAPI.getComunicacoes()
      ]);

      setMembros(membrosData.data || []);
      setVisitantes(visitantesData.data || []);
      setObreiros(obreirosData.data || []);
      setAcompanhamento(acompanhamentoData.data || []);
      setMensagens(mensagensData.data || []);
    } catch (err) {
      console.error('Erro ao carregar relatórios:', err);
      alert('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleExport = () => {
    alert('Funcionalidade de exportar em desenvolvimento!');
  };

  const downloadCSV = (data, filename) => {
    const csv = JSON.stringify(data, null, 2);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="relatorios-container">
      <MenuLateral />
      <div className="relatorios-content">
        <div className="relatorios-header">
          <h1 className="relatorios-title">📊 Relatórios</h1>
        </div>

        <div className="relatorios-tabs">
          <button 
            className={`tab-btn ${activeTab === 'membros' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=membros')}
          >
            De membros
          </button>
          <button 
            className={`tab-btn ${activeTab === 'visitantes' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=visitantes')}
          >
            De visitantes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'obreiros' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=obreiros')}
          >
            De obreiros
          </button>
          <button 
            className={`tab-btn ${activeTab === 'acompanhamento' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=acompanhamento')}
          >
            De acompanhamento
          </button>
          <button 
            className={`tab-btn ${activeTab === 'mensagens' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=mensagens')}
          >
            De mensagens
          </button>
          <button 
            className={`tab-btn ${activeTab === 'exportar' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios?tab=exportar')}
          >
            Exportar
          </button>
        </div>

        <div className="relatorios-content-area">
          {loading ? (
            <div className="loading-message">Carregando dados...</div>
          ) : (
            <>
              {activeTab === 'membros' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Relatório de Membros</h2>
                    <button className="btn-export" onClick={() => downloadCSV(membros, 'relatorio_membros.csv')}>
                      📥 Baixar
                    </button>
                  </div>
                  <div className="stats-grid">
                    <div className="stat-card_">
                      <div className="stat-value">{membros.length}</div>
                      <div className="stat-label">Total de Membros</div>
                    </div>
                    <div className="stat-card_">
                      <div className="stat-value">{membros.filter(m => m.ativo).length}</div>
                      <div className="stat-label">Membros Ativos</div>
                    </div>
                    <div className="stat-card_">
                      <div className="stat-value">{membros.filter(m => !m.ativo).length}</div>
                      <div className="stat-label">Membros Inativos</div>
                    </div>
                    <div className="stat-card_">
                      <div className="stat-value">
                        {membros.length > 0 ? Math.round((membros.filter(m => m.ativo).length / membros.length) * 100) : 0}%
                      </div>
                      <div className="stat-label">Taxa de Atividade</div>
                    </div>
                  </div>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Email</th>
                          <th>Telefone</th>
                          <th>Data de Cadastro</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {membros.length === 0 ? (
                          <tr><td colSpan="5" style={{textAlign: 'center'}}>Nenhum membro encontrado</td></tr>
                        ) : (
                          membros.map(membro => (
                            <tr key={membro.id}>
                              <td>{membro.nome}</td>
                              <td>{membro.email || '-'}</td>
                              <td>{membro.telefone || '-'}</td>
                              <td>{formatDate(membro.created_at)}</td>
                              <td><span className={`status ${membro.ativo ? 'ativo' : 'inativo'}`}>{membro.ativo ? 'Ativo' : 'Inativo'}</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'visitantes' && (
                <div className="tab-content">
                  <div className="content-header">
                    <h2>Relatório de Visitantes</h2>
                    <button className="btn-export" onClick={() => downloadCSV(visitantes, 'relatorio_visitantes.csv')}>
                      📥 Baixar
                    </button>
                  </div>
              <div className="stats-grid">
                <div className="stat-card_">
                  <div className="stat-value">{visitantes.length}</div>
                  <div className="stat-label">Total de Visitantes</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{visitantes.filter(v => v.tags?.includes('convertido')).length}</div>
                  <div className="stat-label">Convertidos</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{visitantes.filter(v => !v.tags?.includes('convertido')).length}</div>
                  <div className="stat-label">Não Convertidos</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">
                    {visitantes.length > 0 ? Math.round((visitantes.filter(v => v.tags?.includes('convertido')).length / visitantes.length) * 100) : 0}%
                  </div>
                  <div className="stat-label">Taxa de Conversão</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Data de Cadastro</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitantes.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign: 'center'}}>Nenhum visitante encontrado</td></tr>
                    ) : (
                      visitantes.map(visitante => (
                        <tr key={visitante.id}>
                          <td>{visitante.nome}</td>
                          <td>{visitante.email || '-'}</td>
                          <td>{visitante.telefone || '-'}</td>
                          <td>{formatDate(visitante.created_at)}</td>
                          <td><span className={`status ${visitante.tags?.includes('convertido') ? 'ativo' : 'inativo'}`}>
                            {visitante.tags?.includes('convertido') ? 'Convertido' : 'Não Convertido'}
                          </span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'obreiros' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Relatório de Obreiros</h2>
                <button className="btn-export" onClick={() => downloadCSV(obreiros, 'relatorio_obreiros.csv')}>
                  📥 Baixar
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card_">
                  <div className="stat-value">{obreiros.length}</div>
                  <div className="stat-label">Total de Obreiros</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{obreiros.filter(o => o.ativo).length}</div>
                  <div className="stat-label">Obreiros Ativos</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{obreiros.filter(o => !o.ativo).length}</div>
                  <div className="stat-label">Obreiros Inativos</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">
                    {obreiros.length > 0 ? Math.round((obreiros.filter(o => o.ativo).length / obreiros.length) * 100) : 0}%
                  </div>
                  <div className="stat-label">Taxa de Atividade</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Tags</th>
                      <th>Data de Cadastro</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obreiros.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum obreiro encontrado</td></tr>
                    ) : (
                      obreiros.map(obreiro => (
                        <tr key={obreiro.id}>
                          <td>{obreiro.nome}</td>
                          <td>{obreiro.email || '-'}</td>
                          <td>{obreiro.telefone || '-'}</td>
                          <td>{obreiro.tags?.join(', ') || '-'}</td>
                          <td>{formatDate(obreiro.created_at)}</td>
                          <td><span className={`status ${obreiro.ativo ? 'ativo' : 'inativo'}`}>{obreiro.ativo ? 'Ativo' : 'Inativo'}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'acompanhamento' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Relatório de Acompanhamento</h2>
                <button className="btn-export" onClick={() => downloadCSV(acompanhamento, 'relatorio_acompanhamento.csv')}>
                  📥 Baixar
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card_">
                  <div className="stat-value">{acompanhamento.length}</div>
                  <div className="stat-label">Total de Tarefas</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{acompanhamento.filter(a => a.status === 'fechado').length}</div>
                  <div className="stat-label">Concluídas</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{acompanhamento.filter(a => a.status === 'em_progresso').length}</div>
                  <div className="stat-label">Em Andamento</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{acompanhamento.filter(a => a.status === 'aberto').length}</div>
                  <div className="stat-label">Pendentes</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Status</th>
                      <th>Prioridade</th>
                      <th>Data Início</th>
                      <th>Data Fim</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acompanhamento.length === 0 ? (
                      <tr><td colSpan="6" style={{textAlign: 'center'}}>Nenhum acompanhamento encontrado</td></tr>
                    ) : (
                      acompanhamento.map(item => (
                        <tr key={item.id}>
                          <td>{item.titulo}</td>
                          <td><span className={`status ${item.status?.toLowerCase().replace('_', '-')}`}>{item.status}</span></td>
                          <td>{item.prioridade || '-'}</td>
                          <td>{formatDate(item.data_inicio)}</td>
                          <td>{formatDate(item.data_fim)}</td>
                          <td>{item.responsavel || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'mensagens' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Relatório de Mensagens Enviadas</h2>
                <button className="btn-export" onClick={() => downloadCSV(mensagens, 'relatorio_mensagens.csv')}>
                  📥 Baixar
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card_">
                  <div className="stat-value">{mensagens.length}</div>
                  <div className="stat-label">Total de Mensagens</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{mensagens.filter(m => m.status === 'enviado').length}</div>
                  <div className="stat-label">Enviadas</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{mensagens.filter(m => m.tipo === 'email').length}</div>
                  <div className="stat-label">Emails</div>
                </div>
                <div className="stat-card_">
                  <div className="stat-value">{mensagens.filter(m => m.tipo === 'whatsapp').length}</div>
                  <div className="stat-label">WhatsApp</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Assunto</th>
                      <th>Data de Envio</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensagens.length === 0 ? (
                      <tr><td colSpan="4" style={{textAlign: 'center'}}>Nenhuma mensagem encontrada</td></tr>
                    ) : (
                      mensagens.map(msg => (
                        <tr key={msg.id}>
                          <td>{msg.tipo === 'email' ? '📧 Email' : '💬 WhatsApp'}</td>
                          <td>{msg.assunto || msg.mensagem?.substring(0, 50) || '-'}</td>
                          <td>{formatDate(msg.data_comunicacao)}</td>
                          <td><span className={`status ${msg.status}`}>{msg.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'exportar' && (
            <div className="tab-content">
              <h2>Exportar Dados</h2>
              <div className="export-container">
                <div className="export-section">
                  <h3>📊 Selecione os dados para exportar</h3>
                  <div className="export-buttons">
                    <button className="btn-export-item" onClick={() => downloadCSV(membros, 'relatorio_membros.csv')}>
                      📋 Exportar Membros
                    </button>
                    <button className="btn-export-item" onClick={() => downloadCSV(visitantes, 'relatorio_visitantes.csv')}>
                      👥 Exportar Visitantes
                    </button>
                    <button className="btn-export-item" onClick={() => downloadCSV(obreiros, 'relatorio_obreiros.csv')}>
                      💼 Exportar Obreiros
                    </button>
                    <button className="btn-export-item" onClick={() => downloadCSV(acompanhamento, 'relatorio_acompanhamento.csv')}>
                      ✓ Exportar Acompanhamento
                    </button>
                    <button className="btn-export-item" onClick={() => downloadCSV(mensagens, 'relatorio_mensagens.csv')}>
                      ✉️ Exportar Mensagens
                    </button>
                  </div>
                </div>

                <div className="export-section">
                  <h3>📅 Exportar Relatório Completo</h3>
                  <div className="form-group-rel">
                    <label>Data Inicial</label>
                    <input type="date" className="form-input-rel" defaultValue="2026-02-01" />
                  </div>
                  <div className="form-group-rel">
                    <label>Data Final</label>
                    <input type="date" className="form-input-rel" defaultValue="2026-02-02" />
                  </div>
                  <button className="btn-export-full" onClick={handleExport}>
                    📥 Exportar Relatório Completo
                  </button>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Relatorios;

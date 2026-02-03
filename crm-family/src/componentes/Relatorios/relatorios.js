import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import './relatorios.css';

function Relatorios() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'membros';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const [membros] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@email.com', telefone: '(11) 98765-4321', dataIngresso: '15/01/2023', status: 'Ativo' },
    { id: 2, nome: 'Maria Santos', email: 'maria@email.com', telefone: '(11) 97654-3210', dataIngresso: '22/03/2023', status: 'Ativo' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', telefone: '(11) 96543-2109', dataIngresso: '10/06/2023', status: 'Ativo' },
    { id: 4, nome: 'Ana Costa', email: 'ana@email.com', telefone: '(11) 95432-1098', dataIngresso: '05/02/2024', status: 'Inativo' }
  ]);

  const [visitantes] = useState([
    { id: 1, nome: 'Lucas Alves', email: 'lucas@email.com', telefone: '(11) 94321-0987', dataVisita: '01/02/2026', convertido: 'Não' },
    { id: 2, nome: 'Fernanda Lima', email: 'fernanda@email.com', telefone: '(11) 93210-9876', dataVisita: '02/02/2026', convertido: 'Sim' },
    { id: 3, nome: 'Rafael Gomes', email: 'rafael@email.com', telefone: '(11) 92109-8765', dataVisita: '28/01/2026', convertido: 'Não' }
  ]);

  const [obreiros] = useState([
    { id: 1, nome: 'João Silva', funcao: 'Pastor', email: 'joao@email.com', telefone: '(11) 98765-4321', dataInicioMinisterio: '15/01/2020', status: 'Ativo' },
    { id: 2, nome: 'Maria Santos', funcao: 'Diácona', email: 'maria@email.com', telefone: '(11) 97654-3210', dataInicioMinisterio: '22/03/2021', status: 'Ativo' },
    { id: 3, nome: 'Pedro Oliveira', funcao: 'Cooperador', email: 'pedro@email.com', telefone: '(11) 96543-2109', dataInicioMinisterio: '10/06/2022', status: 'Ativo' },
    { id: 4, nome: 'Ana Costa', funcao: 'Evangelista', email: 'ana@email.com', telefone: '(11) 95432-1098', dataInicioMinisterio: '05/02/2024', status: 'Inativo' }
  ]);

  const [acompanhamento] = useState([
    { id: 1, nome: 'Integração de novos membros', status: 'Concluído', dataInicio: '10/01/2026', dataFim: '31/01/2026', responsavel: 'João Silva' },
    { id: 2, nome: 'Preparação do batismo', status: 'Em andamento', dataInicio: '01/02/2026', dataFim: '28/02/2026', responsavel: 'Maria Santos' },
    { id: 3, nome: 'Treinamento de líderes', status: 'Pendente', dataInicio: '15/02/2026', dataFim: '15/03/2026', responsavel: 'Pedro Oliveira' }
  ]);

  const [mensagens] = useState([
    { id: 1, tipo: 'SMS', destinatarios: 45, dataEnvio: '01/02/2026', assunto: 'Convite para reunião', enviados: 45, lidos: 38 },
    { id: 2, tipo: 'Email', destinatarios: 78, dataEnvio: '31/01/2026', assunto: 'Boletim semanal', enviados: 78, lidos: 62 },
    { id: 3, tipo: 'WhatsApp', destinatarios: 52, dataEnvio: '02/02/2026', assunto: 'Lembrança de culto', enviados: 52, lidos: 51 }
  ]);

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
          {activeTab === 'membros' && (
            <div className="tab-content">
              <div className="content-header">
                <h2>Relatório de Membros</h2>
                <button className="btn-export" onClick={() => downloadCSV(membros, 'relatorio_membros.csv')}>
                  📥 Baixar
                </button>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Total de Membros</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Membros Ativos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Membros Inativos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">75%</div>
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
                      <th>Data de Ingresso</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membros.map(membro => (
                      <tr key={membro.id}>
                        <td>{membro.nome}</td>
                        <td>{membro.email}</td>
                        <td>{membro.telefone}</td>
                        <td>{membro.dataIngresso}</td>
                        <td><span className={`status ${membro.status.toLowerCase()}`}>{membro.status}</span></td>
                      </tr>
                    ))}
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
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Total de Visitantes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Convertidos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">2</div>
                  <div className="stat-label">Não Convertidos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">33%</div>
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
                      <th>Data da Visita</th>
                      <th>Convertido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitantes.map(visitante => (
                      <tr key={visitante.id}>
                        <td>{visitante.nome}</td>
                        <td>{visitante.email}</td>
                        <td>{visitante.telefone}</td>
                        <td>{visitante.dataVisita}</td>
                        <td><span className={`status ${visitante.convertido.toLowerCase()}`}>{visitante.convertido}</span></td>
                      </tr>
                    ))}
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
                <div className="stat-card">
                  <div className="stat-value">4</div>
                  <div className="stat-label">Total de Obreiros</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Obreiros Ativos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Obreiros Inativos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">75%</div>
                  <div className="stat-label">Taxa de Atividade</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Função</th>
                      <th>Email</th>
                      <th>Telefone</th>
                      <th>Data de Início no Ministério</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {obreiros.map(obreiro => (
                      <tr key={obreiro.id}>
                        <td>{obreiro.nome}</td>
                        <td>{obreiro.funcao}</td>
                        <td>{obreiro.email}</td>
                        <td>{obreiro.telefone}</td>
                        <td>{obreiro.dataInicioMinisterio}</td>
                        <td><span className={`status ${obreiro.status.toLowerCase()}`}>{obreiro.status}</span></td>
                      </tr>
                    ))}
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
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Total de Tarefas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Concluídas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Em Andamento</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">1</div>
                  <div className="stat-label">Pendentes</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tarefa</th>
                      <th>Status</th>
                      <th>Data Início</th>
                      <th>Data Fim</th>
                      <th>Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {acompanhamento.map(item => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td>
                        <td>{item.dataInicio}</td>
                        <td>{item.dataFim}</td>
                        <td>{item.responsavel}</td>
                      </tr>
                    ))}
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
                <div className="stat-card">
                  <div className="stat-value">3</div>
                  <div className="stat-label">Campanhas Enviadas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">175</div>
                  <div className="stat-label">Total Enviados</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">151</div>
                  <div className="stat-label">Total Lidos</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">86%</div>
                  <div className="stat-label">Taxa de Leitura</div>
                </div>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Assunto</th>
                      <th>Data de Envio</th>
                      <th>Destinatários</th>
                      <th>Enviados</th>
                      <th>Lidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensagens.map(msg => (
                      <tr key={msg.id}>
                        <td>{msg.tipo}</td>
                        <td>{msg.assunto}</td>
                        <td>{msg.dataEnvio}</td>
                        <td>{msg.destinatarios}</td>
                        <td>{msg.enviados}</td>
                        <td>{msg.lidos}</td>
                      </tr>
                    ))}
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
        </div>
      </div>
    </div>
  );
}

export default Relatorios;

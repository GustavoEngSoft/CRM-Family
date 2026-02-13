import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MenuLateral from '../menuLateral/menuLateral';
import API_BASE_URL from '../../config/api';
import './relatorioEventos.css';

function RelatorioEventos() {
  const { eventoId } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [mensagemWhatsapp, setMensagemWhatsapp] = useState('');
  const [whatsappLinks, setWhatsappLinks] = useState([]);
  const [mostrarLinks, setMostrarLinks] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [paginaWhatsapp, setPaginaWhatsapp] = useState(1);
  const [filterWhatsapp, setFilterWhatsapp] = useState('todos');
  const ITENS_POR_PAGINA = 10;

  useEffect(() => {
    loadEventoDetalhes();
  }, [eventoId]);

  useEffect(() => {
    if (evento && !mensagemWhatsapp) {
      const mensagemPadrao = `Oi, pessoal! 😊
Gostariamos de ouvir um pouco de voces sobre a experiencia que vivemos juntos no culto "${evento.nome}".
Como voces se sentiram? O que mais marcou voces?
Se puderem, compartilhem um pouco desse feedback com a gente — isso e muito importante pra continuarmos crescendo e melhorando 💬✨
Fiquem a vontade para falar, sera muito especial ouvir voces 💙`;
      setMensagemWhatsapp(mensagemPadrao);
    }
  }, [evento, mensagemWhatsapp]);

  const loadEventoDetalhes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/eventos/${eventoId}/inscricoes`);

      if (!response.ok) throw new Error('Erro ao carregar relatório');

      const data = await response.json();
      setEvento(data.evento);
      setInscricoes(data.inscricoes);
      setError('');
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarDataCompleta = (data) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
  };

  const totalInscricoes = inscricoes.length;
  const totalMembros = inscricoes.filter(i => i.tipo === 'membro').length;
  const totalVisitantes = inscricoes.filter(i => i.tipo === 'visitante').length;
  const percentualMembros = totalInscricoes > 0 ? ((totalMembros / totalInscricoes) * 100).toFixed(1) : 0;
  const percentualVisitantes = totalInscricoes > 0 ? ((totalVisitantes / totalInscricoes) * 100).toFixed(1) : 0;

  const inscricoesFiltradas = filterTipo === 'todos'
    ? inscricoes
    : inscricoes.filter(i => i.tipo === filterTipo);

  // Calcular paginação da tabela
  const totalPaginas = Math.ceil(inscricoesFiltradas.length / ITENS_POR_PAGINA);
  const indexInicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const indexFim = indexInicio + ITENS_POR_PAGINA;
  const inscricoesPaginadas = inscricoesFiltradas.slice(indexInicio, indexFim);

  // Resetar página ao mudar filtro
  useEffect(() => {
    setPaginaAtual(1);
  }, [filterTipo]);

  // Resetar página do WhatsApp ao mudar filtro
  useEffect(() => {
    setPaginaWhatsapp(1);
  }, [filterWhatsapp]);

  const mudarPagina = (novaPagina) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaAtual(novaPagina);
    }
  };

  const mudarPaginaWhatsapp = (novaPagina, totalPaginas) => {
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
      setPaginaWhatsapp(novaPagina);
    }
  };

  const exportarCSV = () => {
    if (inscricoes.length === 0) {
      alert('Nenhuma inscrição para exportar');
      return;
    }

    const headers = ['Nome', 'Telefone', 'Endereço', 'Tipo', 'Data da Inscrição'];
    const rows = inscricoes.map(i => [
      i.nome,
      i.telefone,
      i.endereco,
      i.tipo === 'membro' ? 'Membro' : 'Visitante',
      new Date(i.data_inscricao).toLocaleDateString('pt-BR')
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `inscritos_${evento.id}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const normalizarTelefone = (telefone) => {
    if (!telefone) return '';
    let digits = telefone.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (!digits.startsWith('55')) {
      digits = `55${digits}`;
    }
    return digits;
  };

  const montarLinkWhatsapp = (telefone, mensagem) => {
    const texto = encodeURIComponent(mensagem);
    return `https://wa.me/${telefone}?text=${texto}`;
  };

  const gerarLinksWhatsapp = () => {
    if (!mensagemWhatsapp.trim()) {
      alert('Informe a mensagem para enviar no WhatsApp.');
      return;
    }

    // Filtrar inscrições baseado no filtro selecionado
    let inscricoesFiltradas = [];
    
    if (filterWhatsapp === 'todos') {
      inscricoesFiltradas = inscricoes;
    } else if (filterWhatsapp === 'membros') {
      inscricoesFiltradas = inscricoes.filter(i => i.tipo === 'membro');
    } else if (filterWhatsapp === 'visitantes-com-igreja') {
      inscricoesFiltradas = inscricoes.filter(i => 
        i.tipo === 'visitante' && i.igreja && i.igreja.toLowerCase() !== 'nenhuma'
      );
    } else if (filterWhatsapp === 'visitantes-sem-igreja') {
      inscricoesFiltradas = inscricoes.filter(i => 
        i.tipo === 'visitante' && (!i.igreja || i.igreja.toLowerCase() === 'nenhuma')
      );
    }

    if (inscricoesFiltradas.length === 0) {
      alert('Nao ha inscritos para enviar mensagens com o filtro selecionado.');
      return;
    }

    let invalidos = 0;
    const links = inscricoesFiltradas
      .map((inscricao) => {
        const telefone = normalizarTelefone(inscricao.telefone);
        if (!telefone || telefone.length < 12) {
          invalidos += 1;
          return null;
        }

        return {
          id: inscricao.id,
          nome: inscricao.nome,
          telefone,
          igreja: inscricao.igreja || 'Nenhuma',
          tipo: inscricao.tipo,
          url: montarLinkWhatsapp(telefone, mensagemWhatsapp)
        };
      })
      .filter(Boolean);

    setWhatsappLinks(links);
    setMostrarLinks(true);
    setPaginaWhatsapp(1);

    if (invalidos > 0) {
      alert(`${invalidos} inscritos estavam sem telefone valido e foram ignorados.`);
    }
  };

  const imprimirRelatorio = () => {
    window.print();
  };

  // Calcular paginação dos links do WhatsApp
  const totalPaginasWhatsapp = Math.ceil(whatsappLinks.length / ITENS_POR_PAGINA);
  const indexInicioWhatsapp = (paginaWhatsapp - 1) * ITENS_POR_PAGINA;
  const indexFimWhatsapp = indexInicioWhatsapp + ITENS_POR_PAGINA;
  const whatsappLinksPaginados = whatsappLinks.slice(indexInicioWhatsapp, indexFimWhatsapp);

  if (loading) {
    return (
      <div className="relatorio-container">
        <MenuLateral />
        <div className="relatorio-content">
          <p>Carregando relatório...</p>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="relatorio-container">
        <MenuLateral />
        <div className="relatorio-content">
          <div className="error-message">{error || 'Evento não encontrado'}</div>
          <button className="btn-secondary" onClick={() => navigate('/eventos')}>
            ← Voltar aos Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relatorio-container">
      <MenuLateral />

      <div className="relatorio-content">
        {/* HEADER */}
        <div className="relatorio-header">
          <div className="header-titulo">
            <h1>📊 Relatório do Evento</h1>
            <button 
              className="btn-secondary"
              onClick={() => navigate('/eventos')}
            >
              ← Voltar
            </button>
          </div>
          <div className="header-acoes">
            <button className="btn-primary" onClick={imprimirRelatorio}>
              🖨️ Imprimir
            </button>
            <button className="btn-primary" onClick={exportarCSV}>
              💾 Exportar CSV
            </button>
          </div>
        </div>

        {/* INFORMAÇÕES DO EVENTO */}
        <div className="evento-info-card">
          <div className="info-grid">
            <div className="info-item">
              <h2>{evento.nome}</h2>
              <p className="info-subtitulo">{formatarDataCompleta(evento.data)} às {evento.horario}</p>
            </div>
            {evento.local && (
              <div className="info-item">
                <p><strong>📍 Local:</strong></p>
                <p>{evento.local}</p>
              </div>
            )}
            {evento.descricao && (
              <div className="info-item">
                <p><strong>📝 Descrição:</strong></p>
                <p>{evento.descricao}</p>
              </div>
            )}
          </div>
        </div>

        {/* ESTATÍSTICAS */}
        <div className="estatisticas-grid">
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total de Inscritos</h3>
              <p className="stat-numero">{totalInscricoes}</p>
            </div>
          </div>

          <div className="stat-card membros">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <h3>Membros</h3>
              <p className="stat-numero">{totalMembros}</p>
              <p className="stat-percentual">{percentualMembros}%</p>
            </div>
          </div>

          <div className="stat-card visitantes">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <h3>Visitantes</h3>
              <p className="stat-numero">{totalVisitantes}</p>
              <p className="stat-percentual">{percentualVisitantes}%</p>
            </div>
          </div>
        </div>

        {/* GRÁFICO DE PIZZA */}
        <div className="grafico-section">
          <h3>Distribuição de Participantes</h3>
          <div className="chart-container">
            <svg viewBox="0 0 200 200" className="pie-chart">
              {/* Pizza Chart SVG */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" strokeWidth="2" />
              
              {totalInscricoes > 0 && (
                <>
                  {/* Slice Membros */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#27ae60"
                    strokeWidth="45"
                    strokeDasharray={`${(totalMembros / totalInscricoes) * 565.5} 565.5`}
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                  {/* Slice Visitantes */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#f39c12"
                    strokeWidth="45"
                    strokeDasharray={`${(totalVisitantes / totalInscricoes) * 565.5} 565.5`}
                    strokeDashoffset={`-${(totalMembros / totalInscricoes) * 565.5}`}
                    transform="rotate(-90 100 100)"
                  />
                </>
              )}
            </svg>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
                <span>Membros: {totalMembros} ({percentualMembros}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
                <span>Visitantes: {totalVisitantes} ({percentualVisitantes}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* LISTA DE INSCRITOS */}
        <div className="inscricoes-section">
          <div className="section-header">
            <h3>📋 Lista de Inscritos</h3>
            <div className="filter-group">
              <label htmlFor="filtro">Filtrar por:</label>
              <select 
                id="filtro"
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <option value="todos">Todos ({inscricoes.length})</option>
                <option value="membro">Membros ({totalMembros})</option>
                <option value="visitante">Visitantes ({totalVisitantes})</option>
              </select>
            </div>
          </div>

          <div className="whatsapp-bulk">
            <div className="whatsapp-bulk-header">
              <h4>📲 Enviar WhatsApp para inscritos</h4>
              <div className="whatsapp-filter-container">
                <select 
                  className="whatsapp-filter-select"
                  value={filterWhatsapp}
                  onChange={(e) => setFilterWhatsapp(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="membros">Membros</option>
                  <option value="visitantes-com-igreja">Visitantes com Igreja</option>
                  <option value="visitantes-sem-igreja">Visitantes sem Igreja</option>
                </select>
                <button
                  className="btn-primary"
                  onClick={gerarLinksWhatsapp}
                >
                  Gerar links do WhatsApp
                </button>
              </div>
            </div>
            <textarea
              value={mensagemWhatsapp}
              onChange={(e) => setMensagemWhatsapp(e.target.value)}
              placeholder="Digite a mensagem que sera pre-preenchida no WhatsApp"
              rows={4}
            />
            <p className="whatsapp-hint">
              Gere a lista e clique manualmente em cada link para enviar.
            </p>

            {mostrarLinks && (
              <div className="whatsapp-links">
                {whatsappLinks.length === 0 ? (
                  <p className="empty-message">Nenhum telefone valido para gerar links.</p>
                ) : (
                  <>
                    <p className="whatsapp-links-count">
                      Links gerados: {whatsappLinks.length}
                    </p>
                    <ul>
                      {whatsappLinksPaginados.map((link) => (
                        <li key={link.id}>
                          <span className="whatsapp-link-name">{link.nome}</span>
                          <span className="whatsapp-link-phone">{link.telefone}</span>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            Abrir no WhatsApp
                          </a>
                        </li>
                      ))}
                    </ul>

                    {/* PAGINAÇÃO DO WHATSAPP */}
                    {totalPaginasWhatsapp > 1 && (
                      <div className="paginacao paginacao-whatsapp">
                        <button 
                          className="btn-paginacao"
                          onClick={() => mudarPaginaWhatsapp(1, totalPaginasWhatsapp)}
                          disabled={paginaWhatsapp === 1}
                        >
                          ««
                        </button>
                        <button 
                          className="btn-paginacao"
                          onClick={() => mudarPaginaWhatsapp(paginaWhatsapp - 1, totalPaginasWhatsapp)}
                          disabled={paginaWhatsapp === 1}
                        >
                          ‹ Anterior
                        </button>
                        
                        <span className="info-paginacao">
                          Página {paginaWhatsapp} de {totalPaginasWhatsapp} 
                          ({whatsappLinks.length} {whatsappLinks.length === 1 ? 'link' : 'links'})
                        </span>
                        
                        <button 
                          className="btn-paginacao"
                          onClick={() => mudarPaginaWhatsapp(paginaWhatsapp + 1, totalPaginasWhatsapp)}
                          disabled={paginaWhatsapp === totalPaginasWhatsapp}
                        >
                          Próxima ›
                        </button>
                        <button 
                          className="btn-paginacao"
                          onClick={() => mudarPaginaWhatsapp(totalPaginasWhatsapp, totalPaginasWhatsapp)}
                          disabled={paginaWhatsapp === totalPaginasWhatsapp}
                        >
                          »»
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {inscricoesFiltradas.length === 0 ? (
            <p className="empty-message">Nenhuma inscrição encontrada</p>
          ) : (
            <>
              <div className="tabela-inscricoes">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Telefone</th>
                      <th>Endereço</th>
                      <th>Tipo</th>
                      <th>Data de Inscrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inscricoesPaginadas.map((inscricao, index) => (
                      <tr key={inscricao.id}>
                        <td>{indexInicio + index + 1}</td>
                        <td className="nome-cell">{inscricao.nome}</td>
                        <td>{inscricao.telefone}</td>
                        <td>{inscricao.endereco}</td>
                        <td>
                          <span className={`badge-tipo ${inscricao.tipo}`}>
                            {inscricao.tipo === 'membro' ? '👤 Membro' : '👁️ Visitante'}
                          </span>
                        </td>
                        <td>{formatarData(inscricao.data_inscricao)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CONTROLES DE PAGINAÇÃO DA TABELA */}
              {totalPaginas > 1 && (
                <div className="paginacao">
                  <button 
                    className="btn-paginacao"
                    onClick={() => mudarPagina(1)}
                    disabled={paginaAtual === 1}
                  >
                    ««
                  </button>
                  <button 
                    className="btn-paginacao"
                    onClick={() => mudarPagina(paginaAtual - 1)}
                    disabled={paginaAtual === 1}
                  >
                    ‹ Anterior
                  </button>
                  
                  <span className="info-paginacao">
                    Página {paginaAtual} de {totalPaginas} 
                    ({inscricoesFiltradas.length} {inscricoesFiltradas.length === 1 ? 'registro' : 'registros'})
                  </span>
                  
                  <button 
                    className="btn-paginacao"
                    onClick={() => mudarPagina(paginaAtual + 1)}
                    disabled={paginaAtual === totalPaginas}
                  >
                    Próxima ›
                  </button>
                  <button 
                    className="btn-paginacao"
                    onClick={() => mudarPagina(totalPaginas)}
                    disabled={paginaAtual === totalPaginas}
                  >
                    »»
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RODAPÉ */}
        <div className="relatorio-footer">
          <p>Relatório gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}

export default RelatorioEventos;
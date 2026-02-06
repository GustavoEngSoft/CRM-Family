import React, { useState, useEffect } from 'react';
import MenuLateral from '../menuLateral/menuLateral';
import { DashboardAPI } from '../../services/api';
import './dashboard.css';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pessoasAtivas: 0,
    membrosNovos: 0,
    crescimentoMembros: 0,
    mensagensEnviadas: 0,
    visitantesRealizadas: 0,
    crescimentoVisitantes: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [atividade, setAtividade] = useState({
    total: 0,
    ativas: 0,
    inativas: 0,
    percentual: 0
  });

  const numberFormatter = new Intl.NumberFormat('pt-BR');
  const formatNumber = (value) => numberFormatter.format(value || 0);
  const formatDelta = (value) => {
    const delta = Number(value || 0);
    const prefix = delta > 0 ? '↑ ' : delta < 0 ? '↓ ' : '';
    return `${prefix}${formatNumber(Math.abs(delta))}`;
  };
  const formatPercentDelta = (value) => {
    const delta = Number(value || 0);
    const prefix = delta > 0 ? '↑ ' : delta < 0 ? '↓ ' : '';
    const sign = delta > 0 ? '+' : '';
    return `${prefix}${sign}${delta}%`;
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, crescimentoData, acompanhamentosData, atividadeData] = await Promise.all([
        DashboardAPI.getStats(),
        DashboardAPI.getCrescimentoMensal(),
        DashboardAPI.getAcompanhamentosDiarios(),
        DashboardAPI.getAtividade(),
      ]);

      setStats(statsData);
      setMonthlyData(crescimentoData || []);
      setDailyData(acompanhamentosData || []);
      setAtividade(atividadeData);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      alert('Erro ao carregar dados: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.value), 1) : 1;
  const maxDaily = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.value), 1) : 1;
  const monthlyTicksBase = maxValue <= 5
    ? Array.from({ length: maxValue + 1 }, (_, i) => i)
    : [0, Math.ceil(maxValue / 4), Math.ceil(maxValue / 2), Math.ceil(maxValue * 3 / 4), maxValue];
  const monthlyTicks = Array.from(new Set(monthlyTicksBase));

  return (
    <div className="dashboard-container">
      <MenuLateral />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Fam.Dash</h1>
        </header>

        {loading ? (
          <div className="loading-message">Carregando dados...</div>
        ) : (
          <>
            <div className="stats-cards">
              <div className="stat-card stat-blue">
                <div className="stat-content">
                  <div className="stat-label">Pessoas Ativas</div>
                  <div className="stat-value">{formatNumber(stats.pessoasAtivas)}</div>
                  <div className={`stat-change ${stats.membrosNovos >= 0 ? 'positive' : 'negative'}`}>
                    {formatDelta(stats.membrosNovos)}
                  </div>
                </div>
                <div className="stat-icon">👥</div>
              </div>
              <div className="stat-card stat-purple">
                <div className="stat-content">
                  <div className="stat-label">Membros Novos</div>
                  <div className="stat-value">{formatNumber(stats.membrosNovos)}</div>
                  <div className={`stat-change ${stats.crescimentoMembros >= 0 ? 'positive' : 'negative'}`}>
                    {formatDelta(stats.crescimentoMembros)} no mês
                  </div>
                </div>
                <div className="stat-icon">💬</div>
              </div>
              <div className="stat-card stat-dark">
                <div className="stat-content">
                  <div className="stat-label">Mensagens Enviadas</div>
                  <div className="stat-value">{formatNumber(stats.mensagensEnviadas)}</div>
                  <div className={`stat-change ${stats.crescimentoMensagensPercent >= 0 ? 'positive' : 'negative'}`}>
                    {formatPercentDelta(stats.crescimentoMensagensPercent)}
                  </div>
                </div>
                <div className="stat-icon">⚙️</div>
              </div>
              <div className="stat-card stat-orange">
                <div className="stat-content">
                  <div className="stat-label">Visitas Realizadas</div>
                  <div className="stat-value">{formatNumber(stats.visitantesRealizadas)}</div>
                  <div className={`stat-change ${stats.crescimentoVisitantes >= 0 ? 'positive' : 'negative'}`}>
                    {formatDelta(stats.crescimentoVisitantes)} no mês
                  </div>
                </div>
                <div className="stat-icon">🏆</div>
              </div>
            </div>

            <div className="charts-row">
              <div className="chart-card">
                <h3 className="chart-title">Pessoas Ativas/Inativas</h3>
                <div className="gauge-chart">
                  <svg viewBox="0 0 200 120" className="gauge-svg">
                    {(() => {
                      const total = atividade.total || 0;
                      const ativas = atividade.ativas || 0;
                      const inativas = Math.max(total - ativas, 0);
                      const percentAtivas = total > 0 ? (ativas / total) * 100 : 0;
                      const percentInativas = total > 0 ? 100 - percentAtivas : 0;
                      const endX = 20 + (160 * percentAtivas / 100);
                      const endY = 100 - Math.sin((Math.PI * percentAtivas) / 100) * 80;
                      const arcFlag = percentAtivas > 50 ? '1' : '0';
                      const ativasLabel = `${Math.round(percentAtivas)}% ativas`;
                      const inativasLabel = `${Math.round(percentInativas)}% inativas`;

                      return (
                        <>
                          <path
                            className="gauge-arc"
                            d="M 20 100 A 80 80 0 0 1 180 100"
                            fill="none"
                            stroke="#f0b49c"
                            strokeWidth="20"
                            strokeLinecap="round"
                          >
                            <title>{`Inativas: ${formatNumber(inativas)} (${Math.round(percentInativas)}%)`}</title>
                          </path>
                          <path
                            className="gauge-arc"
                            d={`M 20 100 A 80 80 0 ${arcFlag} 1 ${endX} ${endY}`}
                            fill="none"
                            stroke="#2d3e6f"
                            strokeWidth="20"
                            strokeLinecap="round"
                          >
                            <title>{`Ativas: ${formatNumber(ativas)} (${Math.round(percentAtivas)}%)`}</title>
                          </path>
                          <text x="100" y="90" textAnchor="middle" className="gauge-label">
                            Ativas / Inativas
                          </text>
                        </>
                      );
                    })()}
                  </svg>
                  <div className="gauge-labels">
                    <span className="gauge-min">{(() => {
                      const total = atividade.total || 0;
                      const ativas = atividade.ativas || 0;
                      const percentAtivas = total > 0 ? (ativas / total) * 100 : 0;
                      return `${Math.round(percentAtivas)}% ativas`;
                    })()}</span>
                    <span className="gauge-max">{(() => {
                      const total = atividade.total || 0;
                      const ativas = atividade.ativas || 0;
                      const percentInativas = total > 0 ? 100 - (ativas / total) * 100 : 0;
                      return `${Math.round(percentInativas)}% inativas`;
                    })()}</span>
                  </div>
                </div>
                  </div>

              <div className="chart-card">
                <h3 className="chart-title">Crescimento mensal</h3>
                <div className="line-chart">
                  {monthlyData.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px'}}>Sem dados disponíveis</div>
                  ) : (
                    <svg viewBox="0 0 400 200" className="line-svg">
                      <line x1="40" y1="0" x2="40" y2="160" stroke="#e0e0e0" strokeWidth="1" />
                      <line x1="40" y1="160" x2="400" y2="160" stroke="#e0e0e0" strokeWidth="1" />
                      
                      {monthlyTicks.map((val, i) => (
                        <g key={i}>
                          <line x1="35" y1={160 - (val / maxValue) * 160} x2="40" y2={160 - (val / maxValue) * 160} stroke="#999" strokeWidth="1" />
                          <text x="25" y={165 - (val / maxValue) * 160} fontSize="10" fill="#999" textAnchor="end">{val}</text>
                        </g>
                      ))}

                      <polyline
                        points={monthlyData.map((d, i) => 
                          `${60 + i * 50},${160 - (d.value / maxValue) * 150}`
                        ).join(' ')}
                        fill="none"
                        stroke="#9b6bff"
                        strokeWidth="3"
                      />
                      
                      {monthlyData.map((d, i) => (
                        <circle
                          key={i}
                          cx={60 + i * 50}
                          cy={160 - (d.value / maxValue) * 150}
                          r="4"
                          fill="#9b6bff"
                        />
                      ))}

                      {monthlyData.map((d, i) => (
                        <text
                          key={i}
                          x={60 + i * 50}
                          y="180"
                          fontSize="9"
                          fill="#999"
                          textAnchor="middle"
                        >
                          {d.month}
                        </text>
                      ))}
                    </svg>
                  )}
                </div>
              </div>
                </div>

            <div className="chart-card chart-full">
              <h3 className="chart-title">Visitas Realizadas por dia</h3>
              <div className="bar-chart">
                {dailyData.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px'}}>Sem dados disponíveis</div>
                ) : (
                  <svg viewBox="0 0 900 250" className="bar-svg">
                    <line x1="40" y1="0" x2="40" y2="200" stroke="#e0e0e0" strokeWidth="1" />
                    <line x1="40" y1="200" x2="900" y2="200" stroke="#e0e0e0" strokeWidth="1" />
                    
                    {Array.from({length: Math.min(maxDaily + 1, 6)}, (_, i) => i).map((val, i) => (
                      <g key={i}>
                        <line x1="35" y1={200 - (val / maxDaily) * 200} x2="40" y2={200 - (val / maxDaily) * 200} stroke="#999" strokeWidth="1" />
                        <text x="25" y={205 - (val / maxDaily) * 200} fontSize="12" fill="#999" textAnchor="end">{val}</text>
                      </g>
                    ))}

                    {dailyData.map((d, i) => (
                      <g key={i}>
                        <rect
                          x={70 + i * 85}
                          y={200 - (d.value / maxDaily) * 180}
                          width="50"
                          height={(d.value / maxDaily) * 180}
                          fill="#ff7a45"
                          rx="4"
                        />
                        <text
                          x={95 + i * 85}
                          y="220"
                          fontSize="11"
                          fill="#999"
                          textAnchor="middle"
                        >
                          {d.date}
                        </text>
                      </g>
                    ))}
                  </svg>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

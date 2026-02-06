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

  const maxValue = monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.value)) : 1;
  const maxDaily = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.value)) : 1;

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
                <h3 className="chart-title">Pessoas Ativas (Últimos 30 dias)</h3>
                <div className="gauge-chart">
                  <svg viewBox="0 0 200 120" className="gauge-svg">
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M 20 100 A 80 80 0 ${atividade.percentual > 50 ? '1' : '0'} 1 ${20 + (160 * atividade.percentual / 100)} ${100 - Math.sin((Math.PI * atividade.percentual) / 100) * 80}`}
                      fill="none"
                      stroke="#333"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    <text x="100" y="70" textAnchor="middle" className="gauge-label">Pessoas</text>
                    <text x="100" y="90" textAnchor="middle" className="gauge-value">{atividade.ativas}</text>
                  </svg>
                  <div className="gauge-labels">
                    <span className="gauge-min">0</span>
                    <span className="gauge-max">{atividade.percentual}%</span>
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
                      
                      {[0, Math.floor(maxValue/4), Math.floor(maxValue/2), Math.floor(maxValue*3/4), maxValue].map((val, i) => (
                        <g key={i}>
                          <line x1="35" y1={160 - i * 40} x2="40" y2={160 - i * 40} stroke="#999" strokeWidth="1" />
                          <text x="25" y={165 - i * 40} fontSize="10" fill="#999" textAnchor="end">{val}</text>
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
                          {d.month.substring(0, 3)}
                        </text>
                      ))}
                    </svg>
                  )}
                </div>
              </div>
                </div>

            <div className="chart-card chart-full">
              <h3 className="chart-title">Acompanhamentos por dia</h3>
              <div className="bar-chart">
                {dailyData.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px'}}>Sem dados disponíveis</div>
                ) : (
                  <svg viewBox="0 0 900 250" className="bar-svg">
                    <line x1="40" y1="0" x2="40" y2="200" stroke="#e0e0e0" strokeWidth="1" />
                    <line x1="40" y1="200" x2="900" y2="200" stroke="#e0e0e0" strokeWidth="1" />
                    
                    {[0, Math.floor(maxDaily/5), Math.floor(maxDaily*2/5), Math.floor(maxDaily*3/5), Math.floor(maxDaily*4/5), maxDaily].map((val, i) => (
                      <g key={i}>
                        <line x1="35" y1={200 - i * 40} x2="40" y2={200 - i * 40} stroke="#999" strokeWidth="1" />
                        <text x="25" y={205 - i * 40} fontSize="12" fill="#999" textAnchor="end">{val}</text>
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

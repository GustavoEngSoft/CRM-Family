import React from 'react';
import MenuLateral from '../menuLateral/menuLateral';
import './dashboard.css';

function Dashboard() {
  const monthlyData = [
    { month: 'Janeiro', value: 150 },
    { month: 'Fevereiro', value: 120 },
    { month: 'Março', value: 380 },
    { month: 'Abril', value: 280 },
    { month: 'Maio', value: 200 },
    { month: 'Junho', value: 320 },
    { month: 'Julho', value: 300 }
  ];

  const dailyData = [
    { date: '18/02/25', value: 200 },
    { date: '19/02/25', value: 170 },
    { date: '20/02/25', value: 160 },
    { date: '21/02/25', value: 120 },
    { date: '22/02/25', value: 110 },
    { date: '23/02/25', value: 100 },
    { date: '24/02/25', value: 110 },
    { date: '25/02/25', value: 105 },
    { date: '26/02/25', value: 90 },
    { date: '27/02/25', value: 85 }
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));
  const maxDaily = Math.max(...dailyData.map(d => d.value));

  return (
    <div className="dashboard-container">
      <MenuLateral />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Fam.Dash</h1>
        </header>

        <div className="stats-cards">
          <div className="stat-card stat-blue">
            <div className="stat-label">Pessoas Ativas</div>
            <div className="stat-value">500</div>
            <div className="stat-change positive">↑ 100</div>
          </div>
          <div className="stat-card stat-purple">
            <div className="stat-label">Membros Novos</div>
            <div className="stat-value">100</div>
            <div className="stat-change positive">↑ 20%</div>
            <div className="stat-icon">💬</div>
          </div>
          <div className="stat-card stat-dark">
            <div className="stat-label">Mensagens Enviadas</div>
            <div className="stat-value">5.800</div>
            <div className="stat-change positive">↑ 30%</div>
            <div className="stat-icon">⚙️</div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-label">Visitas Realizadas</div>
            <div className="stat-value">200</div>
            <div className="stat-change positive">↑ 30%</div>
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
                  d="M 20 100 A 80 80 0 0 1 100 20"
                  fill="none"
                  stroke="#333"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <text x="100" y="70" textAnchor="middle" className="gauge-label">Pessoas</text>
                <text x="100" y="90" textAnchor="middle" className="gauge-value">250</text>
              </svg>
              <div className="gauge-labels">
                <span className="gauge-min">0</span>
                <span className="gauge-max">50%</span>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Crescimento mensal</h3>
            <div className="line-chart">
              <svg viewBox="0 0 400 200" className="line-svg">
                <line x1="40" y1="0" x2="40" y2="160" stroke="#e0e0e0" strokeWidth="1" />
                <line x1="40" y1="160" x2="400" y2="160" stroke="#e0e0e0" strokeWidth="1" />
                
                {[0, 100, 200, 300, 400].map((val, i) => (
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
            </div>
          </div>
        </div>

        <div className="chart-card chart-full">
          <h3 className="chart-title">Acompanhamentos por dia</h3>
          <div className="bar-chart">
            <svg viewBox="0 0 900 250" className="bar-svg">
              <line x1="40" y1="0" x2="40" y2="200" stroke="#e0e0e0" strokeWidth="1" />
              <line x1="40" y1="200" x2="900" y2="200" stroke="#e0e0e0" strokeWidth="1" />
              
              {[0, 50, 100, 150, 200, 250].map((val, i) => (
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

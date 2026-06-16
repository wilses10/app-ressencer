import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';

function BarChart({ data, maxValue, colorFn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 140, fontSize: '0.82rem', color: '#444', textAlign: 'right', fontWeight: 500, flexShrink: 0 }}>
            {item.label}
          </div>
          <div style={{ flex: 1, background: 'var(--gris)', borderRadius: 6, overflow: 'hidden', height: 28 }}>
            <div
              style={{
                width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                height: '100%',
                background: colorFn ? colorFn(i) : 'var(--vert)',
                borderRadius: 6,
                transition: 'width 0.8s ease',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 8,
                minWidth: item.value > 0 ? 32 : 0,
              }}
            >
              {item.value > 0 && (
                <span style={{ color: 'white', fontSize: '0.78rem', fontWeight: 700 }}>{item.value}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Statistiques({ refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/habitants/stats`)
      .then(r => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
        <p style={{ color: '#888' }}>Chargement des statistiques...</p>
      </div>
    );
  }

  if (!stats) return null;

  const quartierColors = [
    'linear-gradient(90deg, #009A44, #00c255)',
    'linear-gradient(90deg, #CE1126, #ff2640)',
    'linear-gradient(90deg, #9C27B0, #CE93D8)',
    'linear-gradient(90deg, #2196F3, #64B5F6)',
    'linear-gradient(90deg, #E67E22, #F0A500)',
    'linear-gradient(90deg, #16A085, #1ABC9C)',
    'linear-gradient(90deg, #8E44AD, #9B59B6)',
    'linear-gradient(90deg, #2980B9, #3498DB)',
  ];

  const maxQuartier = stats.parQuartier.reduce((m, q) => Math.max(m, q.count), 0);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: 'var(--vert-fonce)', marginBottom: 24 }}>
        📊 Statistiques démographiques
      </h2>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total inscrits', value: stats.total, icon: '👥', color: 'var(--vert)', bg: 'linear-gradient(135deg, #009A44, #007A35)' },
          { label: 'Quartiers représentés', value: stats.parQuartier.length, icon: '📍', color: 'var(--rouge)', bg: 'linear-gradient(135deg, #CE1126, #a00e1e)' },
          { label: 'Âge moyen', value: `${stats.age.moyenne} ans`, icon: '📅', color: '#6B4C9A', bg: 'linear-gradient(135deg, #6B4C9A, #4a3570)' },
          { label: 'Habitant le + âgé', value: `${stats.age.max} ans`, icon: '🧓', color: '#E67E22', bg: 'linear-gradient(135deg, #E67E22, #b5601a)' },
          { label: 'Habitant le + jeune', value: `${stats.age.min} ans`, icon: '🌱', color: '#00BCD4', bg: 'linear-gradient(135deg, #00BCD4, #0097A7)' },
        ].map((kpi, i) => (
          <div key={i} className="card" style={{
            padding: 24,
            background: kpi.bg,
            color: 'white',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{kpi.icon}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: '0.78rem', marginTop: 6, opacity: 0.85, textTransform: 'uppercase', letterSpacing: 0.5 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Par quartier */}
        <div className="card" style={{ padding: 28, gridColumn: stats.parQuartier.length > 5 ? 'span 2' : 'auto' }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, color: 'var(--vert-fonce)' }}>
            📍 Habitants par quartier
          </h3>
          {stats.parQuartier.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', padding: '20px 0' }}>Aucune donnée disponible</p>
          ) : (
            <BarChart
              data={stats.parQuartier.map(q => ({ label: q.quartier, value: q.count }))}
              maxValue={maxQuartier}
              colorFn={i => quartierColors[i % quartierColors.length]}
            />
          )}
        </div>

        {/* Répartition ages */}
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, color: 'var(--vert-fonce)' }}>
            📈 Données démographiques
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Âge minimum', value: stats.age.min, max: stats.age.max, color: '#00BCD4', icon: '🌱' },
              { label: 'Âge moyen', value: stats.age.moyenne, max: stats.age.max, color: 'var(--vert)', icon: '📊' },
              { label: 'Âge maximum', value: stats.age.max, max: stats.age.max, color: '#E67E22', icon: '🧓' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.icon} {item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.value} ans</span>
                </div>
                <div style={{ background: 'var(--gris)', borderRadius: 6, height: 12, overflow: 'hidden' }}>
                  <div style={{
                    width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: 6,
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podium quartiers */}
        {stats.parQuartier.length > 0 && (
          <div className="card" style={{ padding: 28, gridColumn: '1 / -1' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, color: 'var(--vert-fonce)' }}>
              🏆 Top 3 — Quartiers les plus peuplés
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {stats.parQuartier.slice(0, 3).map((q, i) => {
                const medals = ['🥇', '🥈', '🥉'];
                const colors = ['linear-gradient(135deg, #FCD116, #e6b800)', 'linear-gradient(135deg, #bdc3c7, #95a5a6)', 'linear-gradient(135deg, #cd7f32, #a0522d)'];
                return (
                  <div key={i} className="card" style={{ padding: 24, background: colors[i], textAlign: 'center', color: i === 0 ? '#1a1a1a' : 'white' }}>
                    <div style={{ fontSize: 40 }}>{medals[i]}</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginTop: 8 }}>{q.quartier}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 4 }}>{q.count}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>habitant{q.count > 1 ? 's' : ''}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function Accueil({ setActiveTab, stats }) {
  const features = [
    { icon: '✍️', title: "S'inscrire", desc: "Enregistrez vos informations dans le recensement officiel du village", tab: 'inscription', color: 'var(--vert)' },
    { icon: '👥', title: 'Voir les habitants', desc: "Consultez la liste complète des habitants inscrits de Bandjoun", tab: 'liste', color: 'var(--rouge)' },
    { icon: '📊', title: 'Statistiques', desc: "Visualisez les données démographiques de notre communauté", tab: 'statistiques', color: '#6B4C9A' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

      {/* Hero */}
      <div className="card pattern-bg" style={{
        background: 'linear-gradient(135deg, #fff9e6 0%, #f0fff5 100%)',
        border: '2px solid var(--jaune)',
        padding: '40px',
        marginBottom: 32,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Décorations */}
        <div style={{ position: 'absolute', top: -20, left: -20, fontSize: 80, opacity: 0.06, transform: 'rotate(-15deg)' }}>🏡</div>
        <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: 80, opacity: 0.06, transform: 'rotate(15deg)' }}>🌿</div>

        <div style={{ fontSize: 64, marginBottom: 16 }}>🏘️</div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          color: 'var(--vert-fonce)',
          marginBottom: 16,
        }}>
          Bienvenue à Bandjoun
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#444', maxWidth: 600, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Participez au recensement officiel de notre village. Ensemble, construisons une base de données
          complète pour mieux servir notre communauté Bamiléké.
        </p>

        {/* Drapeaux et symboles */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {['🇨🇲 Cameroun', '🌿 Région Ouest', '🏡 Arrond. Bandjoun', '👑 Chefferie Bamiléké'].map(item => (
            <span key={item} className="badge badge-vert" style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
              {item}
            </span>
          ))}
        </div>

        <button className="btn btn-primary" onClick={() => setActiveTab('inscription')} style={{ fontSize: '1rem', padding: '14px 32px' }}>
          ✍️ S'inscrire maintenant
        </button>
      </div>

      {/* Stats rapides */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Total inscrits', value: stats.total, icon: '👥', color: 'var(--vert)', bg: 'rgba(0,154,68,0.08)' },
            { label: 'Quartiers représentés', value: stats.parQuartier?.length || 0, icon: '📍', color: 'var(--rouge)', bg: 'rgba(206,17,38,0.08)' },
            { label: 'Âge moyen', value: `${stats.age?.moyenne || 0} ans`, icon: '📅', color: '#6B4C9A', bg: 'rgba(107,76,154,0.08)' },
            { label: 'Habitants +60 ans', value: stats.parQuartier?.reduce((acc, q) => acc, 0) || '—', icon: '🧓', color: '#E67E22', bg: 'rgba(230,126,34,0.08)' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Features */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 32 }}>
        {features.map((f, i) => (
          <div key={i} className="card" style={{ padding: 28, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onClick={() => setActiveTab(f.tab)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            <div style={{ fontSize: 40, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: f.color, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.9rem' }}>{f.desc}</p>
            <div style={{ marginTop: 16, color: f.color, fontSize: '0.85rem', fontWeight: 600 }}>
              Accéder →
            </div>
          </div>
        ))}
      </div>

      {/* Info Bandjoun */}
      <div className="card" style={{ padding: 32, background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 20, color: 'var(--jaune)' }}>
          🏛️ À propos de Bandjoun
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {[
            { icon: '📍', label: 'Localisation', value: 'Région de l\'Ouest, Cameroun' },
            { icon: '👑', label: 'Culture', value: 'Peuple Bamiléké' },
            { icon: '🎨', label: 'Artisanat', value: 'Masques, sculptures, tissage' },
            { icon: '☕', label: 'Agriculture', value: 'Café, maïs, haricots' },
            { icon: '🏰', label: 'Patrimoine', value: 'Palais royal (Chefferie)' },
            { icon: '🌿', label: 'Environnement', value: 'Hautes terres de l\'Ouest' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

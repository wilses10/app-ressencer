import React from 'react';

export default function Header({ activeTab, setActiveTab, totalHabitants }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Bande drapeau Cameroun */}
      <div style={{ display: 'flex', height: '6px' }}>
        <div style={{ flex: 1, background: 'var(--vert)' }} />
        <div style={{ flex: 1, background: 'var(--rouge)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', color: 'var(--jaune)', fontSize: '10px', lineHeight: 0, top: '50%', transform: 'translateY(-50%)' }}>★</span>
        </div>
        <div style={{ flex: 1, background: 'var(--jaune)' }} />
      </div>

      {/* Bannière principale */}
      <div className="pattern-dark" style={{
        background: 'linear-gradient(135deg, var(--vert-fonce) 0%, #004d26 50%, #003318 100%)',
        padding: '20px 32px',
        color: 'white',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          {/* Logo + titre */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, var(--jaune), #e6b800)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 15px rgba(252,209,22,0.4)',
              flexShrink: 0,
            }}>
              🏡
            </div>
            <div>
              <h1 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}>
                Recensement de Bandjoun
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
                📍 Arrondissement de Bandjoun · Région de l'Ouest · Cameroun 🇨🇲
              </p>
            </div>
          </div>

          {/* Compteur */}
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: '12px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--jaune)', lineHeight: 1 }}>
              {totalHabitants.toLocaleString('fr-FR')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
              habitants inscrits
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ maxWidth: 1200, margin: '16px auto 0', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { id: 'accueil', label: '🏠 Accueil', },
            { id: 'inscription', label: '✍️ S\'inscrire', },
            { id: 'liste', label: '👥 Habitants', },
            { id: 'statistiques', label: '📊 Statistiques', },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s',
                background: activeTab === tab.id
                  ? 'linear-gradient(135deg, var(--jaune), #e6b800)'
                  : 'rgba(255,255,255,0.1)',
                color: activeTab === tab.id ? '#1a1a1a' : 'rgba(255,255,255,0.85)',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(252,209,22,0.4)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

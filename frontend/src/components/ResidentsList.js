import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';

export default function ResidentsList({ onNotify, refreshKey }) {
  const [habitants, setHabitants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quartiers, setQuartiers] = useState([]);
  const [filtreQuartier, setFiltreQuartier] = useState('tous');
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchHabitants = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtreQuartier !== 'tous') params.quartier = filtreQuartier;
      if (search.trim()) params.search = search.trim();
      const r = await axios.get(`${API}/habitants`, { params });
      setHabitants(r.data.data);
    } catch {
      onNotify('Erreur lors du chargement des habitants', 'error');
    } finally {
      setLoading(false);
    }
  }, [filtreQuartier, search, refreshKey]);

  useEffect(() => {
    axios.get(`${API}/quartiers`).then(r => setQuartiers(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchHabitants, 300);
    return () => clearTimeout(timer);
  }, [fetchHabitants]);

  const handleDelete = async (id, nom, prenom) => {
    if (!window.confirm(`Supprimer ${prenom} ${nom} du recensement ?`)) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/habitants/${id}`);
      setHabitants(prev => prev.filter(h => h.id !== id));
      onNotify(`${prenom} ${nom} a été supprimé du recensement.`);
    } catch {
      onNotify('Erreur lors de la suppression', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const getAgeCategory = (age) => {
    if (age < 18) return { label: 'Jeune', color: 'var(--vert)', icon: '🌱' };
    if (age < 40) return { label: 'Adulte', color: '#2196F3', icon: '👤' };
    if (age < 60) return { label: 'Senior', color: '#9C27B0', icon: '🧑' };
    return { label: 'Âgé', color: '#E67E22', icon: '🧓' };
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

      {/* En-tête avec filtres */}
      <div className="card" style={{ padding: '24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: 'var(--vert-fonce)' }}>
            👥 Habitants inscrits
          </h2>
          <span className="badge badge-vert" style={{ fontSize: '1rem', padding: '6px 18px' }}>
            {habitants.length} résultat{habitants.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>
              Rechercher
            </label>
            <input
              className="input-field"
              type="text"
              placeholder="🔍 Rechercher par nom ou prénom..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>
              Quartier
            </label>
            <select className="input-field" value={filtreQuartier} onChange={e => setFiltreQuartier(e.target.value)}>
              <option value="tous">Tous les quartiers</option>
              {quartiers.map(q => <option key={q} value={q}>{q}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <p style={{ color: '#888', fontWeight: 500 }}>Chargement des données...</p>
          </div>
        ) : habitants.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🏘️</div>
            <h3 style={{ color: '#555', marginBottom: 8 }}>Aucun habitant trouvé</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
              {search || filtreQuartier !== 'tous' ? 'Essayez de modifier vos filtres' : 'Soyez le premier à vous inscrire !'}
            </p>
          </div>
        ) : (
          <>
            {/* En-tête tableau */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 1fr 1fr 80px 120px',
              gap: 12,
              padding: '14px 20px',
              background: 'linear-gradient(135deg, var(--vert-fonce), #004d26)',
              color: 'white',
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}>
              <span>#</span>
              <span>Nom</span>
              <span>Prénom</span>
              <span>Quartier</span>
              <span>Âge</span>
              <span>Action</span>
            </div>

            {/* Lignes */}
            {habitants.map((h, i) => {
              const cat = getAgeCategory(h.age);
              return (
                <div
                  key={h.id}
                  className="fade-in"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 1fr 1fr 80px 120px',
                    gap: 12,
                    padding: '14px 20px',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--gris)',
                    background: i % 2 === 0 ? 'white' : '#fafaf8',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0fff5'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#fafaf8'}
                >
                  <span style={{ fontWeight: 700, color: '#aaa', fontSize: '0.85rem' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--noir)', textTransform: 'uppercase' }}>
                    {h.nom}
                  </span>
                  <span style={{ color: '#333' }}>{h.prenom}</span>
                  <span>
                    <span className="badge badge-vert" style={{ fontSize: '0.78rem' }}>
                      📍 {h.quartier}
                    </span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: '0.85rem' }}>{cat.icon}</span>
                    <span style={{ fontWeight: 700, color: cat.color }}>{h.age}</span>
                    <span style={{ fontSize: '0.75rem', color: '#aaa' }}>ans</span>
                  </span>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(h.id, h.nom, h.prenom)}
                    disabled={deleting === h.id}
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    {deleting === h.id ? '...' : '🗑️ Supprimer'}
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Légende catégories d'âge */}
      <div style={{ marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { icon: '🌱', label: 'Moins de 18 ans', color: 'var(--vert)' },
          { icon: '👤', label: '18–39 ans', color: '#2196F3' },
          { icon: '🧑', label: '40–59 ans', color: '#9C27B0' },
          { icon: '🧓', label: '60 ans et plus', color: '#E67E22' },
        ].map(cat => (
          <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#666' }}>
            <span>{cat.icon}</span>
            <span style={{ color: cat.color, fontWeight: 600 }}>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

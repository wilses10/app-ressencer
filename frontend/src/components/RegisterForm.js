import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';

export default function RegisterForm({ onSuccess }) {
  const [form, setForm] = useState({ nom: '', prenom: '', quartier: '', age: '', metier: '' });
  const [quartiers, setQuartiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`${API}/quartiers`).then(r => setQuartiers(r.data.data)).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = 'Le nom est obligatoire';
    else if (form.nom.trim().length < 2) e.nom = 'Le nom doit avoir au moins 2 caractères';
    if (!form.prenom.trim()) e.prenom = 'Le prénom est obligatoire';
    else if (form.prenom.trim().length < 2) e.prenom = 'Le prénom doit avoir au moins 2 caractères';
    if (!form.quartier) e.quartier = 'Veuillez choisir un quartier';
    if (!form.age) e.age = "L'âge est obligatoire";
    else if (isNaN(form.age) || form.age < 1 || form.age > 120) e.age = "L'âge doit être entre 1 et 120 ans";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post(`${API}/habitants`, { ...form, age: parseInt(form.age) });
      setForm({ nom: '', prenom: '', quartier: '', age: '', metier: '' });
      setErrors({});
      onSuccess('✅ Inscription réussie ! Bienvenue dans le recensement de Bandjoun.');
    } catch (err) {
      onSuccess(err.response?.data?.message || 'Erreur lors de l\'inscription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (hasErr) => ({
    borderColor: hasErr ? 'var(--rouge)' : undefined,
    boxShadow: hasErr ? '0 0 0 3px rgba(206,17,38,0.15)' : undefined,
  });

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* En-tête formulaire */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, var(--vert-fonce), #004d26)',
          padding: '28px 32px',
          marginBottom: 0,
          borderRadius: '16px 16px 0 0',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 40 }}>✍️</div>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 4 }}>
                Formulaire d'inscription
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
                Recensement officiel de Bandjoun · Cameroun 🇨🇲
              </p>
            </div>
          </div>
        </div>

        {/* Corps du formulaire */}
        <div className="card" style={{ borderRadius: '0 0 16px 16px', padding: '32px' }}>
          <form onSubmit={handleSubmit} noValidate>

            {/* Ligne Nom / Prénom */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Nom de famille <span style={{ color: 'var(--rouge)' }}>*</span></label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ex: FOTSO"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                  style={fieldStyle(errors.nom)}
                />
                {errors.nom && <span style={errStyle}>{errors.nom}</span>}
              </div>
              <div>
                <label style={labelStyle}>Prénom <span style={{ color: 'var(--rouge)' }}>*</span></label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ex: Jean-Pierre"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                  style={fieldStyle(errors.prenom)}
                />
                {errors.prenom && <span style={errStyle}>{errors.prenom}</span>}
              </div>
            </div>

            {/* Quartier */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Quartier <span style={{ color: 'var(--rouge)' }}>*</span></label>
              <select
                className="input-field"
                value={form.quartier}
                onChange={e => setForm({ ...form, quartier: e.target.value })}
                style={fieldStyle(errors.quartier)}
              >
                <option value="">-- Choisissez votre quartier --</option>
                {quartiers.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {errors.quartier && <span style={errStyle}>{errors.quartier}</span>}
            </div>

            {/* Ligne Âge / Métier */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Âge <span style={{ color: 'var(--rouge)' }}>*</span></label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  max="120"
                  placeholder="Ex: 35"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  style={fieldStyle(errors.age)}
                />
                {errors.age && <span style={errStyle}>{errors.age}</span>}
              </div>
              <div>
                <label style={labelStyle}>Métier</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ex: Agriculteur, Enseignant, Commerçant..."
                  value={form.metier}
                  onChange={e => setForm({ ...form, metier: e.target.value })}
                />
              </div>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Inscription en cours...
                </>
              ) : '✅ Confirmer mon inscription'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.8rem', color: '#888' }}>
              🔒 Vos données sont protégées et utilisées uniquement pour le recensement officiel.
            </p>
          </form>
        </div>

        {/* Décoration culturelle */}
        <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['Bandjoun', 'Bamiléké', 'Cameroun', 'Région Ouest', 'Unité'].map(tag => (
            <span key={tag} className="badge badge-vert">{tag}</span>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#333',
};
const errStyle = {
  display: 'block',
  marginTop: 6,
  fontSize: '0.8rem',
  color: 'var(--rouge)',
};
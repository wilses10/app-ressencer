import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Accueil from './components/Accueil';
import RegisterForm from './components/RegisterForm';
import ResidentsList from './components/ResidentsList';
import Statistiques from './components/Statistiques';

const API = process.env.REACT_APP_API_URL || '/api';

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/habitants/stats`);
      setStats(r.data.data);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, refreshKey]);

  const handleInscriptionSuccess = (message, type = 'success') => {
    notify(message, type);
    if (type === 'success') {
      setRefreshKey(k => k + 1);
      setTimeout(() => setActiveTab('liste'), 1500);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return <Accueil setActiveTab={setActiveTab} stats={stats} />;
      case 'inscription':
        return <RegisterForm onSuccess={handleInscriptionSuccess} />;
      case 'liste':
        return <ResidentsList onNotify={notify} refreshKey={refreshKey} />;
      case 'statistiques':
        return <Statistiques refreshKey={refreshKey} />;
      default:
        return <Accueil setActiveTab={setActiveTab} stats={stats} />;
    }
  };

  return (
    <div className="pattern-bg" style={{ minHeight: '100vh' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalHabitants={stats?.total || 0}
      />

      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 48,
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        padding: '24px',
        fontSize: '0.85rem',
      }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 24, height: 4, background: 'var(--vert)', borderRadius: 2 }} />
          <div style={{ width: 24, height: 4, background: 'var(--rouge)', borderRadius: 2 }} />
          <div style={{ width: 24, height: 4, background: 'var(--jaune)', borderRadius: 2 }} />
        </div>
        <p>🇨🇲 Recensement de Bandjoun · Région de l'Ouest · Cameroun</p>
        <p style={{ marginTop: 4, fontSize: '0.78rem', opacity: 0.5 }}>
          Système de recensement communautaire · {new Date().getFullYear()}
        </p>
      </footer>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

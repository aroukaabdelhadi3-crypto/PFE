import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DetailedProgress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress/');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercent = (p) => {
    let completed = 0;
    if (p.part_1_completed) completed++;
    if (p.part_2_completed) completed++;
    if (p.part_3_completed) completed++;
    if (p.part_4_completed) completed++;
    if (p.research_completed) completed++;
    return (completed / 5) * 100;
  };

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Suivi Détaillé des Stagiaires</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : progress.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun stagière trouvé</h3>
            <p>Aucune progression enregistrée pour le moment</p>
          </div>
        ) : (
          <div className="stats-grid">
            {progress.map((p) => (
              <div key={p.id} className="stat-card">
                <div className="stat-header">
                  <div className="stat-avatar">{p.trainee_name?.split(' ').map(n => n[0]).join('')}</div>
                  <div className="stat-info">
                    <div className="stat-title">{p.trainee_name}</div>
                    <div className="stat-subtitle">{p.subject_name}</div>
                  </div>
                </div>
                <div className="stat-body">
                  <div className="progress-detail">
                    <div className="progress-item">
                      <span>Partie 1</span>
                      <span>{p.part_1_completed ? <span className="badge badge-success">Terminé</span> : <span className="badge badge-secondary">En cours</span>}</span>
                    </div>
                    <div className="progress-item">
                      <span>Partie 2</span>
                      <span>{p.part_2_completed ? <span className="badge badge-success">Terminé</span> : <span className="badge badge-secondary">En cours</span>}</span>
                    </div>
                    <div className="progress-item">
                      <span>Partie 3</span>
                      <span>{p.part_3_completed ? <span className="badge badge-success">Terminé</span> : <span className="badge badge-secondary">En cours</span>}</span>
                    </div>
                    <div className="progress-item">
                      <span>Partie 4</span>
                      <span>{p.part_4_completed ? <span className="badge badge-success">Terminé</span> : <span className="badge badge-secondary">En cours</span>}</span>
                    </div>
                    <div className="progress-item">
                      <span>Recherche</span>
                      <span>{p.research_completed ? <span className="badge badge-success">Terminé</span> : <span className="badge badge-secondary">En cours</span>}</span>
                    </div>
                  </div>
                  <div className="progress-bar-large">
                    <div className="progress-fill-large" style={{ width: `${getProgressPercent(p)}%` }}></div>
                  </div>
                  <div className="progress-percent">{Math.round(getProgressPercent(p))}% Terminé</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedProgress;

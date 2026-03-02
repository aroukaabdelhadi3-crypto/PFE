import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TraineeProgress = () => {
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
        <h1 className="page-title">Suivi des Stagiaires</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : progress.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun stagiaire trouvé</h3>
            <p>Aucune progression enregistrée</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Stagiaire</th>
                    <th>Matière</th>
                    <th>Partie 1</th>
                    <th>Partie 2</th>
                    <th>Partie 3</th>
                    <th>Partie 4</th>
                    <th>Recherche</th>
                    <th>Progression</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((p) => (
                    <tr key={p.id}>
                      <td>{p.trainee_name}</td>
                      <td>{p.subject_name}</td>
                      <td>{p.part_1_completed ? <span className="badge badge-success">✓</span> : <span className="badge badge-secondary">-</span>}</td>
                      <td>{p.part_2_completed ? <span className="badge badge-success">✓</span> : <span className="badge badge-secondary">-</span>}</td>
                      <td>{p.part_3_completed ? <span className="badge badge-success">✓</span> : <span className="badge badge-secondary">-</span>}</td>
                      <td>{p.part_4_completed ? <span className="badge badge-success">✓</span> : <span className="badge badge-secondary">-</span>}</td>
                      <td>{p.research_completed ? <span className="badge badge-success">✓</span> : <span className="badge badge-secondary">-</span>}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="progress-bar" style={{ width: '100px' }}>
                            <div className="progress-fill" style={{ width: `${getProgressPercent(p)}%` }}></div>
                          </div>
                          <span>{Math.round(getProgressPercent(p))}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraineeProgress;

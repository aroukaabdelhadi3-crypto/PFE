import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MyCorrections = () => {
  const navigate = useNavigate();
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCorrections();
  }, []);

  const fetchCorrections = async () => {
    try {
      const response = await api.get('/corrections/');
      setCorrections(response.data);
    } catch (error) {
      console.error('Error fetching corrections:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Corrections</h1>
      </div>
      <div className="page-content">
        {loading ? (
          <p>Chargement...</p>
        ) : corrections.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <h3>Aucune correction disponible</h3>
            <p>Vous n'avez pas encore de corrections.</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Titre</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {corrections.map((correction) => (
                    <tr key={correction.id}>
                      <td>{correction.subject_name}</td>
                      <td><strong>{correction.title}</strong></td>
                      <td>{correction.description || '-'}</td>
                      <td>
                        {correction.file && (
                          <a href={correction.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                            Télécharger
                          </a>
                        )}
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

export default MyCorrections;

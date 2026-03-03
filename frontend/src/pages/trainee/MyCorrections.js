import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MyCorrections = () => {
  const navigate = useNavigate();
  const [corrections, setCorrections] = useState({ 1: [], 2: [], 3: [], 4: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCorrections();
  }, []);

  const fetchCorrections = async () => {
    try {
      const response = await api.get('/corrections/');
      const correctionsByPart = { 1: [], 2: [], 3: [], 4: [] };
      response.data.forEach((correction) => {
        if (correctionsByPart[correction.part_number]) {
          correctionsByPart[correction.part_number].push(correction);
        }
      });
      setCorrections(correctionsByPart);
    } catch (error) {
      console.error('Error fetching corrections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Corrections</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : (
          <div className="part-grid">
            {[1, 2, 3, 4].map((part) => (
              <div key={part} className="part-card">
                <div className="part-header">Corrections - {getPartLabel(part)}</div>
                <div className="part-body">
                  {corrections[part].length === 0 ? (
                    <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Aucune correction disponible</p>
                  ) : (
                    corrections[part].map((correction) => (
                      <div key={correction.id} className="part-item">
                        <div className="part-item-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        </div>
                        <div className="part-item-content">
                          <div className="part-item-title">{correction.title}</div>
                          {correction.content && (
                            <div style={{ fontSize: '12px', color: '#374151', marginTop: '8px', maxHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {correction.content.substring(0, 150)}...
                            </div>
                          )}
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {correction.file && (
                              <a href={correction.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                                Télécharger la correction
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCorrections;

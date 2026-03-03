import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MyControls = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerFile, setAnswerFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchControls();
  }, []);

  const fetchControls = async () => {
    try {
      const response = await api.get('/controls/?status=published');
      setControls(response.data);
    } catch (error) {
      console.error('Error fetching controls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedControl) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('control', selectedControl.id);
      formDataToSend.append('answer_text', answerText);
      if (answerFile) {
        formDataToSend.append('answer_file', answerFile);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await api.post('/submissions/', formDataToSend, config);
      alert('Réponse soumise avec succès!');
      setShowModal(false);
      setAnswerText('');
      setAnswerFile(null);
      setSelectedControl(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Mes Contrôles</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : controls.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun contrôle disponible</h3>
            <p>Revenez plus tard pour voir les contrôles</p>
          </div>
        ) : (
          <div className="part-grid">
            {[1, 2, 3, 4].map((part) => {
              const partControls = controls.filter(c => c.part_number === part);
              return (
                <div key={part} className="part-card">
                  <div className="part-header">Contrôles - {getPartLabel(part)}</div>
                  <div className="part-body">
                    {partControls.length === 0 ? (
                      <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>Aucun contrôle disponible</p>
                    ) : (
                      partControls.map((control) => (
                        <div key={control.id} className="part-item">
                          <div className="part-item-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            </svg>
                          </div>
                          <div className="part-item-title">{control.title}</div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                            {control.file && (
                              <a href={control.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                                Télécharger le contrôle
                              </a>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={() => { setSelectedControl(control); setShowModal(true); }}>
                              Soumettre
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && selectedControl && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedControl.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p style={{ marginBottom: '16px' }}><strong>Matière:</strong> {selectedControl.subject_name}</p>
                <p style={{ marginBottom: '16px' }}><strong>Partie:</strong> {getPartLabel(selectedControl.part_number)}</p>
                {selectedControl.description && (
                  <p style={{ marginBottom: '16px' }}><strong>Description:</strong> {selectedControl.description}</p>
                )}
                {selectedControl.file && (
                  <p style={{ marginBottom: '16px' }}>
                    <strong>Fichier du contrôle:</strong>{' '}
                    <a href={selectedControl.file} target="_blank" rel="noopener noreferrer">Télécharger</a>
                  </p>
                )}
                <div className="form-group">
                  <label className="form-label">Votre réponse textuelle</label>
                  <textarea className="form-textarea" style={{ minHeight: '150px' }} value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Entrez votre réponse ici..." required />
                </div>
                <div className="form-group">
                  <label className="form-label">Ou/uploader un fichier (PDF, Image, Doc)</label>
                  <input 
                    type="file" 
                    className="form-input" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setAnswerFile(e.target.files[0])} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Soumission...' : 'Soumettre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyControls;

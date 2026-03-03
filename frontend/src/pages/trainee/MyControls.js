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

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Mes Contrôles</h1>
      </div>
      <div className="page-content">
        {loading ? (
          <p>Chargement...</p>
        ) : controls.length === 0 ? (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            </svg>
            <h3>Aucun contrôle disponible</h3>
            <p>Revenez plus tard pour voir les contrôles</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Titre</th>
                    <th>Date limite</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {controls.map((control) => (
                    <tr key={control.id}>
                      <td>{control.subject_name}</td>
                      <td><strong>{control.title}</strong></td>
                      <td>{control.due_date ? new Date(control.due_date).toLocaleDateString('fr-FR') : '-'}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        {control.file && (
                          <a href={control.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-secondary">
                            Télécharger
                          </a>
                        )}
                        <button className="btn btn-sm btn-primary" onClick={() => { setSelectedControl(control); setShowModal(true); }}>
                          Soumettre
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  <textarea 
                    className="form-textarea" 
                    style={{ minHeight: '150px' }} 
                    value={answerText} 
                    onChange={(e) => setAnswerText(e.target.value)} 
                    placeholder="Entrez votre réponse ici..." 
                    required 
                  />
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

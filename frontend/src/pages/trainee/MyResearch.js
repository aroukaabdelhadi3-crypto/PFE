import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyResearch = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerFile, setAnswerFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await api.get('/research/');
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTopic) return;
    
    setSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('research_topic', selectedTopic.id);
      formDataToSend.append('answer_text', answerText);
      if (answerFile) {
        formDataToSend.append('answer_file', answerFile);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      await api.post('/research-submissions/', formDataToSend, config);
      alert('Réponse soumise avec succès!');
      setShowModal(false);
      setAnswerText('');
      setAnswerFile(null);
      setSelectedTopic(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sujets de Recherche</h1>
      </div>
      <div className="page-content">
        {loading ? <p>Chargement...</p> : topics.length === 0 ? (
          <div className="empty-state">
            <h3>Aucun sujet de recherche disponible</h3>
            <p>Revenez plus tard pour voir les sujets</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              {topics.map((topic) => (
                <div key={topic.id} style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                  <h3 style={{ marginBottom: '8px' }}>{topic.title}</h3>
                  <p style={{ color: '#6B7280', marginBottom: '16px' }}>{topic.description}</p>
                  {topic.file && (
                    <p style={{ marginBottom: '16px' }}>
                      <strong>Fichier:</strong>{' '}
                      <a href={topic.file} target="_blank" rel="noopener noreferrer">Télécharger le fichier</a>
                    </p>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>
                      <strong>Matière:</strong> {topic.subject_name}
                      {topic.due_date && <> | <strong>Date limite:</strong> {new Date(topic.due_date).toLocaleDateString('fr-FR')}</>}
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedTopic(topic); setShowModal(true); }}>
                      Soumettre ma recherche
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && selectedTopic && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedTopic.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <p style={{ marginBottom: '16px' }}><strong>Description:</strong> {selectedTopic.description}</p>
                {selectedTopic.file && (
                  <p style={{ marginBottom: '16px' }}>
                    <strong>Fichier:</strong>{' '}
                    <a href={selectedTopic.file} target="_blank" rel="noopener noreferrer">Télécharger</a>
                  </p>
                )}
                <div className="form-group">
                  <label className="form-label">Ma recherche / réponse textuelle</label>
                  <textarea className="form-textarea" style={{ minHeight: '150px' }} value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Entrez votre recherche ici..." required />
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

export default MyResearch;

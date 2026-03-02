import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ResearchTopics = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [formData, setFormData] = useState({ subject: '', title: '', description: '', due_date: '', file: null });

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
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

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/subjects/');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', parseInt(formData.subject));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      
      // Handle due_date - only send if there's a value
      if (formData.due_date) {
        formDataToSend.append('due_date', formData.due_date);
      }
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingTopic) {
        await api.put(`/research/${editingTopic.id}/`, formDataToSend, config);
      } else {
        await api.post('/research/', formDataToSend, config);
      }
      setShowModal(false);
      setEditingTopic(null);
      setFormData({ subject: '', title: '', description: '', due_date: '', file: null });
      fetchTopics();
    } catch (error) {
      console.error('Error saving research topic:', error.response || error);
      alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet de recherche?')) {
      try {
        await api.delete(`/research/${id}/`);
        fetchTopics();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Gestion des Sujets de Recherche</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un sujet</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            {loading ? <p>Chargement...</p> : topics.length === 0 ? (
              <div className="empty-state"><h3>Aucun sujet trouvé</h3><p>Commencez par ajouter un sujet de recherche</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Titre</th><th>Matière</th><th>Date limite</th><th>Fichier</th><th>Actions</th></tr></thead>
                <tbody>
                  {topics.map((topic) => (
                    <tr key={topic.id}>
                      <td>{topic.title}</td>
                      <td>{topic.subject_name}</td>
                      <td>{topic.due_date ? new Date(topic.due_date).toLocaleDateString('fr-FR') : '-'}</td>
                      <td>
                        {topic.file ? (
                          <a href={topic.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Télécharger</a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="table-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingTopic(topic); setFormData({ subject: topic.subject, title: topic.title, description: topic.description, due_date: topic.due_date?.split('T')[0] || '', file: null }); setShowModal(true); }}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(topic.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingTopic ? 'Modifier' : 'Créer'} un sujet de recherche</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Matière</label>
                  <select className="form-select" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required>
                    <option value="">Sélectionner une matière</option>
                    {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Titre</label>
                  <input type="text" className="form-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" style={{ minHeight: '150px' }} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Date limite</label>
                  <input type="date" className="form-input" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Fichier (PDF, Image, Doc)</label>
                  <input 
                    type="file" 
                    className="form-input" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} 
                  />
                  {editingTopic && editingTopic.file && (
                    <p className="file-info">Fichier actuel: <a href={editingTopic.file} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingTopic ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchTopics;

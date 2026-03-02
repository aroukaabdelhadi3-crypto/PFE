import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Corrections = () => {
  const navigate = useNavigate();
  const [corrections, setCorrections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCorrection, setEditingCorrection] = useState(null);
  const [formData, setFormData] = useState({ subject: '', title: '', content: '', part_number: 1, file: null });

  useEffect(() => {
    fetchCorrections();
    fetchSubjects();
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
      formDataToSend.append('content', formData.content);
      formDataToSend.append('part_number', formData.part_number);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingCorrection) {
        await api.put(`/corrections/${editingCorrection.id}/`, formDataToSend, config);
      } else {
        await api.post('/corrections/', formDataToSend, config);
      }
      setShowModal(false);
      setEditingCorrection(null);
      setFormData({ subject: '', title: '', content: '', part_number: 1, file: null });
      fetchCorrections();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette correction?')) {
      try {
        await api.delete(`/corrections/${id}/`);
        fetchCorrections();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Gestion des Corrections</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter une correction</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            {loading ? <p>Chargement...</p> : corrections.length === 0 ? (
              <div className="empty-state"><h3>Aucune correction trouvée</h3><p>Commencez par ajouter une correction</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Titre</th><th>Matière</th><th>Partie</th><th>Fichier</th><th>Actions</th></tr></thead>
                <tbody>
                  {corrections.map((correction) => (
                    <tr key={correction.id}>
                      <td>{correction.title}</td>
                      <td>{correction.subject_name}</td>
                      <td><span className="badge badge-primary">{getPartLabel(correction.part_number)}</span></td>
                      <td>
                        {correction.file ? (
                          <a href={correction.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Télécharger</a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="table-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingCorrection(correction); setFormData({ subject: correction.subject, title: correction.title, content: correction.content, part_number: correction.part_number, file: null }); setShowModal(true); }}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(correction.id)}>Supprimer</button>
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
              <h3 className="modal-title">{editingCorrection ? 'Modifier' : 'Créer'} une correction</h3>
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
                  <label className="form-label">Contenu de la correction</label>
                  <textarea className="form-textarea" style={{ minHeight: '200px' }} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Partie</label>
                  <select className="form-select" value={formData.part_number} onChange={(e) => setFormData({ ...formData, part_number: parseInt(e.target.value) })}>
                    <option value={1}>Partie 1</option>
                    <option value={2}>Partie 2</option>
                    <option value={3}>Partie 3</option>
                    <option value={4}>Partie 4</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Fichier (PDF, Image, Doc)</label>
                  <input 
                    type="file" 
                    className="form-input" 
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} 
                  />
                  {editingCorrection && editingCorrection.file && (
                    <p className="file-info">Fichier actuel: <a href={editingCorrection.file} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingCorrection ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Corrections;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Controls = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedControl, setSelectedControl] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [editingControl, setEditingControl] = useState(null);
  const [formData, setFormData] = useState({ subject: '', title: '', description: '', part_number: 1, due_date: '', status: 'draft', file: null });

  useEffect(() => {
    fetchControls();
    fetchSubjects();
  }, []);

  const fetchControls = async () => {
    try {
      const response = await api.get('/controls/');
      setControls(response.data);
    } catch (error) {
      console.error('Error fetching controls:', error);
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

  const fetchSubmissions = async (controlId) => {
    setSubmissionsLoading(true);
    try {
      const response = await api.get(`/submissions/?control=${controlId}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleViewSubmissions = (control) => {
    setSelectedControl(control);
    setShowSubmissions(true);
    fetchSubmissions(control.id);
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      await api.post(`/submissions/${submissionId}/grade/`, { grade, feedback });
      fetchSubmissions(selectedControl.id);
    } catch (error) {
      alert('Erreur lors de la notation');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', parseInt(formData.subject));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('part_number', formData.part_number);
      
      // Handle due_date - only send if there's a value
      if (formData.due_date) {
        formDataToSend.append('due_date', formData.due_date);
      }
      
      formDataToSend.append('status', formData.status);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingControl) {
        await api.put(`/controls/${editingControl.id}/`, formDataToSend, config);
      } else {
        await api.post('/controls/', formDataToSend, config);
      }
      setShowModal(false);
      setEditingControl(null);
      setFormData({ subject: '', title: '', description: '', part_number: 1, due_date: '', status: 'draft', file: null });
      fetchControls();
    } catch (error) {
      console.error('Error saving control:', error.response || error);
      alert('Erreur lors de la sauvegarde: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.post(`/controls/${id}/publish/`);
      fetchControls();
    } catch (error) {
      alert('Erreur lors de la publication');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contrôle?')) {
      try {
        await api.delete(`/controls/${id}/`);
        fetchControls();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];
  const getStatusBadge = (status) => {
    const badges = { draft: 'badge-secondary', published: 'badge-success', closed: 'badge-danger' };
    return badges[status] || 'badge-secondary';
  };

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Gestion des Contrôles</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un contrôle</button>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="card-body">
            {loading ? <p>Chargement...</p> : controls.length === 0 ? (
              <div className="empty-state"><h3>Aucun contrôle trouvé</h3><p>Commencez par ajouter un contrôle</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Titre</th><th>Matière</th><th>Partie</th><th>Date limite</th><th>Statut</th><th>Fichier</th><th>Soumissions</th><th>Actions</th></tr></thead>
                <tbody>
                  {controls.map((control) => (
                    <tr key={control.id}>
                      <td>{control.title}</td>
                      <td>{control.subject_name}</td>
                      <td><span className="badge badge-primary">{getPartLabel(control.part_number)}</span></td>
                      <td>{control.due_date ? new Date(control.due_date).toLocaleDateString('fr-FR') : '-'}</td>
                      <td><span className={`badge ${getStatusBadge(control.status)}`}>{control.status}</span></td>
                      <td>
                        {control.file ? (
                          <a href={control.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Télécharger</a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-warning" onClick={() => handleViewSubmissions(control)}>
                          Voir les soumissions
                        </button>
                      </td>
                      <td className="table-actions">
                        {control.status === 'draft' && <button className="btn btn-sm btn-success" onClick={() => handlePublish(control.id)}>Publier</button>}
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingControl(control); setFormData({ subject: control.subject, title: control.title, description: control.description, part_number: control.part_number, due_date: control.due_date?.split('T')[0] || '', status: control.status, file: null }); setShowModal(true); }}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(control.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Modal */}
      {showSubmissions && selectedControl && (
        <div className="modal-overlay" onClick={() => setShowSubmissions(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Soumissions - {selectedControl.title}</h3>
              <button className="modal-close" onClick={() => setShowSubmissions(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {submissionsLoading ? (
                <p>Chargement des soumissions...</p>
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <h3>Aucune soumission</h3>
                  <p>Aucun stagiaire n'a soumis ce contrôle</p>
                </div>
              ) : (
                <div className="submissions-list">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="submission-card" style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h4 style={{ margin: 0 }}>{submission.trainee_name || submission.trainee}</h4>
                        <span className={`badge ${submission.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                          {submission.status === 'graded' ? 'Noté' : 'En attente'}
                        </span>
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <strong>Réponse textuelle:</strong>
                        <p style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px', marginTop: '5px', whiteSpace: 'pre-wrap' }}>
                          {submission.answer_text || 'Aucune réponse textuelle'}
                        </p>
                      </div>
                      
                      {submission.answer_file && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Fichier soumis:</strong>
                          <div style={{ marginTop: '5px' }}>
                            <a href={submission.answer_file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">
                              📥 Télécharger le fichier
                            </a>
                          </div>
                        </div>
                      )}
                      
                      {submission.grade !== null && submission.grade !== undefined && (
                        <div style={{ marginBottom: '10px' }}>
                          <strong>Note:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981' }}>{submission.grade}/20</span>
                          {submission.feedback && (
                            <p style={{ background: '#e0f2fe', padding: '10px', borderRadius: '4px', marginTop: '5px' }}>
                              <strong>Feedback:</strong> {submission.feedback}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {submission.status !== 'graded' && (
                        <GradeForm submissionId={submission.id} onGrade={handleGradeSubmission} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Control Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingControl ? 'Modifier' : 'Créer'} un contrôle</h3>
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
                  <textarea className="form-textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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
                  <label className="form-label">Date limite</label>
                  <input type="date" className="form-input" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="closed">Fermé</option>
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
                  {editingControl && editingControl.file && (
                    <p className="file-info">Fichier actuel: <a href={editingControl.file} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingControl ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Grade submission component
const GradeForm = ({ submissionId, onGrade }) => {
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGrade(submissionId, grade, feedback);
    setGrade('');
    setFeedback('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', marginTop: '10px' }}>
      <div style={{ flex: 1 }}>
        <label className="form-label" style={{ fontSize: '12px' }}>Note (/20)</label>
        <input 
          type="number" 
          className="form-input" 
          min="0" 
          max="20" 
          value={grade} 
          onChange={(e) => setGrade(e.target.value)}
          required
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ flex: 2 }}>
        <label className="form-label" style={{ fontSize: '12px' }}>Feedback</label>
        <input 
          type="text" 
          className="form-input" 
          value={feedback} 
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback optionnel"
          style={{ width: '100%' }}
        />
      </div>
      <button type="submit" className="btn btn-sm btn-success">Noter</button>
    </form>
  );
};

export default Controls;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ subject: '', title: '', description: '', content: '', part_number: 1, file: null });

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
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

  const fetchCoursesByPart = async (partNumber) => {
    try {
      const url = partNumber ? `/courses/?part_number=${partNumber}` : '/courses/';
      const response = await api.get(url);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subject', parseInt(formData.subject));
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('part_number', formData.part_number);
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }
      
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      
      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}/`, formDataToSend, config);
      } else {
        await api.post('/courses/', formDataToSend, config);
      }
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ subject: '', title: '', description: '', content: '', part_number: 1, file: null });
      fetchCourses();
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours?')) {
      try {
        await api.delete(`/courses/${id}/`);
        fetchCourses();
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
        <h1 className="page-title">Gestion des Cours</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un cours</button>
      </div>
      <div className="page-content">
        <div className="filters">
          <div className="filter-group">
            <select className="form-select" onChange={(e) => fetchCoursesByPart(e.target.value)}>
              <option value="">Toutes les parties</option>
              <option value="1">Partie 1</option>
              <option value="2">Partie 2</option>
              <option value="3">Partie 3</option>
              <option value="4">Partie 4</option>
            </select>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            {loading ? <p>Chargement...</p> : courses.length === 0 ? (
              <div className="empty-state"><h3>Aucun cours trouvé</h3><p>Commencez par ajouter un cours</p></div>
            ) : (
              <table className="table">
                <thead><tr><th>Titre</th><th>Matière</th><th>Partie</th><th>Fichier</th><th>Actions</th></tr></thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.subject_name}</td>
                      <td><span className="badge badge-primary">{getPartLabel(course.part_number)}</span></td>
                      <td>
                        {course.file ? (
                          <a href={course.file} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-info">Télécharger</a>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="table-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingCourse(course); setFormData({ subject: course.subject, title: course.title, description: course.description, content: course.content, part_number: course.part_number, file: null }); setShowModal(true); }}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(course.id)}>Supprimer</button>
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
              <h3 className="modal-title">{editingCourse ? 'Modifier' : 'Créer'} un cours</h3>
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
                  <label className="form-label">Contenu</label>
                  <textarea className="form-textarea" style={{ minHeight: '150px' }} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} />
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
                  {editingCourse && editingCourse.file && (
                    <p className="file-info">Fichier actuel: <a href={editingCourse.file} target="_blank" rel="noopener noreferrer">Télécharger</a></p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingCourse ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

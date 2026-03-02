import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const SupervisorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [researchSubmissions, setResearchSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('controls');

  useEffect(() => {
    fetchSubmissions();
    fetchResearchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions/');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResearchSubmissions = async () => {
    try {
      const response = await api.get('/research-submissions/');
      setResearchSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching research submissions:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = { pending: 'badge-warning', graded: 'badge-success' };
    return badges[status] || 'badge-secondary';
  };

  const getPartLabel = (part) => ['Partie 1', 'Partie 2', 'Partie 3', 'Partie 4'][part - 1];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Soumissions des Stagiaires</h1>
      </div>
      <div className="page-content">
        <div className="tabs">
          <button className={`tab ${activeTab === 'controls' ? 'active' : ''}`} onClick={() => setActiveTab('controls')}>
            Contrôles ({submissions.length})
          </button>
          <button className={`tab ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>
            Recherche ({researchSubmissions.length})
          </button>
        </div>

        {loading ? <p>Chargement...</p> : (
          <div className="card">
            <div className="card-body">
              {activeTab === 'controls' ? (
                submissions.length === 0 ? (
                  <div className="empty-state"><h3>Aucune soumission</h3><p>Aucune réponse aux contrôles soumise</p></div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Stagiaire</th><th>Contrôle</th><th>Partie</th><th>Date</th><th>Statut</th></tr></thead>
                    <tbody>
                      {submissions.map((s) => (
                        <tr key={s.id}>
                          <td>{s.trainee_name}</td>
                          <td>{s.control_title}</td>
                          <td><span className="badge badge-primary">{getPartLabel(s.part_number)}</span></td>
                          <td>{new Date(s.submitted_at).toLocaleDateString('fr-FR')}</td>
                          <td><span className={`badge ${getStatusBadge(s.status)}`}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                researchSubmissions.length === 0 ? (
                  <div className="empty-state"><h3>Aucune soumission</h3><p>Aucune recherche soumise</p></div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Stagiaire</th><th>Sujet</th><th>Date</th><th>Statut</th></tr></thead>
                    <tbody>
                      {researchSubmissions.map((s) => (
                        <tr key={s.id}>
                          <td>{s.trainee_name}</td>
                          <td>{s.research_topic_title}</td>
                          <td>{new Date(s.submitted_at).toLocaleDateString('fr-FR')}</td>
                          <td><span className={`badge ${getStatusBadge(s.status)}`}>{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupervisorSubmissions;

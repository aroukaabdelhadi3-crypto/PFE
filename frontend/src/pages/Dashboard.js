import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    if (user?.role === 'trainee') {
      fetchCourses();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Administrateur',
      instructor: 'Instructeur',
      coordinator: 'Coordinateur',
      supervisor: 'Superviseur',
      trainee: 'Stagiaire'
    };
    return labels[role] || role;
  };

  const trainingProgress = [
    { part: 'Partie 1', completed: 75, color: '#A435F0' },
    { part: 'Partie 2', completed: 60, color: '#10B981' },
    { part: 'Partie 3', completed: 45, color: '#F59E0B' },
    { part: 'Partie 4', completed: 30, color: '#EF4444' },
  ];

  const alerts = [
    { type: 'warning', message: '5 soumissions en attente de correction', count: 5 },
    { type: 'info', message: '3 nouveaux stagiaires ajoutés cette semaine', count: 3 },
    { type: 'success', message: '2 formations terminées', count: 2 },
  ];

  if (loading) {
    return (
      <div className="page-content">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div style={{ 
        background: 'linear-gradient(135deg, #A435F0 0%, #8710D8 100%)', 
        borderRadius: '8px', 
        padding: '32px', 
        marginBottom: '32px',
        color: 'white'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
          Bienvenue{user?.first_name ? `, ${user.first_name}` : ''}!
        </h1>
        <p style={{ fontSize: '16px', opacity: '0.9' }}>
          Rôle: <strong>{getRoleLabel(user?.role)}</strong>
        </p>
      </div>

      {(user?.role === 'supervisor' || user?.role === 'coordinator') && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>
            🔔 Alertes et Notifications
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {alerts.map((alert, index) => (
              <div 
                key={index}
                style={{ 
                  background: alert.type === 'warning' ? '#FEF3C7' : alert.type === 'success' ? '#D1FAE5' : '#DBEAFE',
                  border: `1px solid ${alert.type === 'warning' ? '#F59E0B' : alert.type === 'success' ? '#10B981' : '#3B82F6'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  background: alert.type === 'warning' ? '#F59E0B' : alert.type === 'success' ? '#10B981' : '#3B82F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {alert.count}
                </div>
                <div style={{ color: '#374151', fontSize: '14px' }}>
                  {alert.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-grid">
        {user?.role === 'admin' && (
          <>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-label">Total Utilisateurs</div>
              <div className="stat-value">{stats?.total_users || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                </svg>
              </div>
              <div className="stat-label">Total Matières</div>
              <div className="stat-value">{stats?.total_subjects || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                </svg>
              </div>
              <div className="stat-label">Total Cours</div>
              <div className="stat-value">{stats?.total_courses || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                </svg>
              </div>
              <div className="stat-label">Total Contrôles</div>
              <div className="stat-value">{stats?.total_controls || 0}</div>
            </div>
          </>
        )}

        {user?.role === 'instructor' && (
          <>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                </svg>
              </div>
              <div className="stat-label">Mes Matières</div>
              <div className="stat-value">{stats?.my_subjects || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                </svg>
              </div>
              <div className="stat-label">Mes Cours</div>
              <div className="stat-value">{stats?.my_courses || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                </svg>
              </div>
              <div className="stat-label">Mes Contrôles</div>
              <div className="stat-value">{stats?.my_controls || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div className="stat-label">Soumissions en attente</div>
              <div className="stat-value">{stats?.pending_submissions || 0}</div>
            </div>
          </>
        )}

        {user?.role === 'trainee' && (
          <>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                </svg>
              </div>
              <div className="stat-label">Mes Cours</div>
              <div className="stat-value">{courses.length || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                </svg>
              </div>
              <div className="stat-label">Mes Soumissions</div>
              <div className="stat-value">{stats?.my_submissions || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
              </div>
              <div className="stat-label">Mes Recherches</div>
              <div className="stat-value">{stats?.my_research || 0}</div>
            </div>
          </>
        )}

        {(user?.role === 'coordinator' || user?.role === 'supervisor') && (
          <>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-label">Total Stagiaires</div>
              <div className="stat-value">{stats?.total_trainees || 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                </svg>
              </div>
              <div className="stat-label">Formations Terminées</div>
              <div className="stat-value">{stats?.completed_training || 0}</div>
            </div>
          </>
        )}

        {!user?.role && (
          <>
            <div className="stat-card">
              <div className="stat-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
              </div>
              <div className="stat-label">Statistique 1</div>
              <div className="stat-value">-</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                </svg>
              </div>
              <div className="stat-label">Statistique 2</div>
              <div className="stat-value">-</div>
            </div>
          </>
        )}
      </div>

      {(user?.role === 'supervisor' || user?.role === 'coordinator') && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>
            📊 Progression de la Formation
          </h3>
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
                {trainingProgress.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>{item.part}</span>
                      <span style={{ fontWeight: 'bold', color: item.color }}>{item.completed}%</span>
                    </div>
                    <div style={{ 
                      height: '24px', 
                      background: '#E5E7EB', 
                      borderRadius: '12px', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        width: `${item.completed}%`, 
                        height: '100%', 
                        background: item.color,
                        borderRadius: '12px'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {(user?.role === 'supervisor' || user?.role === 'coordinator') && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px', color: '#374151' }}>
            📈 Statistiques des Participants
          </h3>
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px', padding: '20px 0' }}>
                {[
                  { label: 'Stagiaires Actifs', value: 45, color: '#A435F0' },
                  { label: 'En Formation', value: 30, color: '#10B981' },
                  { label: 'Terminés', value: 15, color: '#3B82F6' },
                  { label: 'En Attente', value: 10, color: '#F59E0B' },
                ].map((item, index) => (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      width: '100%', 
                      maxWidth: '60px',
                      background: item.color, 
                      borderRadius: '4px 4px 0 0',
                      height: `${item.value * 3.5}px`
                    }}>
                      <span style={{ 
                        display: 'block',
                        textAlign: 'center',
                        paddingTop: '5px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: 'white'
                      }}>
                        {item.value}
                      </span>
                    </div>
                    <span style={{ marginTop: '12px', fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

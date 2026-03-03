import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    email: '', username: '', first_name: '', last_name: '', role: 'trainee', password: '', password_confirm: '', phone: '', address: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/auth/users/${editingUser.id}/`, formData);
      } else {
        await api.post('/auth/users/', formData);
      }
      setShowModal(false);
      setEditingUser(null);
      setFormData({ email: '', username: '', first_name: '', last_name: '', role: 'trainee', password: '', password_confirm: '', phone: '', address: '' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.email?.[0] || error.response?.data?.password?.[0] || 'Une erreur est survenue');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        await api.delete(`/auth/users/${id}/`);
        fetchUsers();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const getRoleLabel = (role) => {
    const labels = { admin: 'Administrateur', instructor: 'Instructeur', coordinator: 'Coordinateur', supervisor: 'Superviseur', trainee: 'Stagiaire' };
    return labels[role] || role;
  };

  const getRoleBadge = (role) => {
    const badges = { admin: 'badge-danger', instructor: 'badge-primary', coordinator: 'badge-warning', supervisor: 'badge-secondary', trainee: 'badge-success' };
    return badges[role] || 'badge-secondary';
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Group users by role for tabs
  const instructors = users.filter(u => u.role === 'instructor');
  const trainees = users.filter(u => u.role === 'trainee');
  const coordinators = users.filter(u => u.role === 'coordinator');
  const supervisors = users.filter(u => u.role === 'supervisor');
  const admins = users.filter(u => u.role === 'admin');

  const getTabUsers = () => {
    switch (activeTab) {
      case 'instructors': return instructors;
      case 'trainees': return trainees;
      case 'coordinators': return coordinators;
      case 'supervisors': return supervisors;
      case 'admins': return admins;
      default: return filteredUsers;
    }
  };

  const displayUsers = activeTab === 'all' ? filteredUsers : getTabUsers();

  return (
    <div>
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate(-1)} style={{ marginRight: '15px' }}>
          ← Retour
        </button>
        <h1 className="page-title">Gestion des Utilisateurs</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Ajouter un utilisateur</button>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="filters" style={{ marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
        <div className="filter-group" style={{ flex: 1, minWidth: '200px' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Rechercher par nom ou email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select className="form-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="instructor">Instructeur</option>
            <option value="coordinator">Coordinateur</option>
            <option value="supervisor">Superviseur</option>
            <option value="trainee">Stagiaire</option>
          </select>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="tabs" style={{ marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'all' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Tous ({users.length})
        </button>
        <button 
          className={`tab ${activeTab === 'instructors' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructors')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'instructors' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Instructeurs ({instructors.length})
        </button>
        <button 
          className={`tab ${activeTab === 'trainees' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainees')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'trainees' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Stagiaires ({trainees.length})
        </button>
        <button 
          className={`tab ${activeTab === 'coordinators' ? 'active' : ''}`}
          onClick={() => setActiveTab('coordinators')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'coordinators' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Coordinateurs ({coordinators.length})
        </button>
        <button 
          className={`tab ${activeTab === 'supervisors' ? 'active' : ''}`}
          onClick={() => setActiveTab('supervisors')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'supervisors' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Superviseurs ({supervisors.length})
        </button>
        <button 
          className={`tab ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
          style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', borderBottom: activeTab === 'admins' ? '2px solid #A435F0' : '2px solid transparent', marginBottom: '-2px' }}
        >
          Administrateurs ({admins.length})
        </button>
      </div>

      <div className="page-content">
        <div className="card">
          <div className="card-body">
            {loading ? (
              <p>Chargement...</p>
            ) : displayUsers.length === 0 ? (
              <div className="empty-state">
                <h3>Aucun utilisateur trouvé</h3>
                <p>Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${getRoleBadge(user.role)}`}>{getRoleLabel(user.role)}</span></td>
                      <td>{user.is_active ? 'Actif' : 'Inactif'}</td>
                      <td className="table-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingUser(user); setFormData({ ...user, password: '', password_confirm: '' }); setShowModal(true); }}>Modifier</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.id)}>Supprimer</button>
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
              <h3 className="modal-title">{editingUser ? 'Modifier' : 'Créer'} un utilisateur</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                {!editingUser && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Nom d'utilisateur</label>
                      <input type="text" className="form-input" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mot de passe</label>
                      <input type="password" className="form-input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingUser} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirmer le mot de passe</label>
                      <input type="password" className="form-input" value={formData.password_confirm} onChange={(e) => setFormData({ ...formData, password_confirm: e.target.value })} required={!editingUser} />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label className="form-label">Prénom</label>
                  <input type="text" className="form-input" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input type="text" className="form-input" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <select className="form-select" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="trainee">Stagiaire</option>
                    <option value="instructor">Instructeur</option>
                    <option value="coordinator">Coordinateur</option>
                    <option value="supervisor">Superviseur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input type="text" className="form-input" value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Adresse</label>
                  <textarea className="form-textarea" value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">{editingUser ? 'Modifier' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

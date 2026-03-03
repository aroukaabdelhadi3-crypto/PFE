import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar Component - Udemy Style
 * A collapsible vertical navigation component
 * 
 * Features:
 * - Collapsible (expanded shows icons + labels, collapsed shows icons only)
 * - Navigation links with icons
 * - Visual elements (hover effects, active state)
 * - Smooth transitions
 * - Responsive design
 */
const Sidebar = ({ collapsed, onToggle, navItems = [] }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

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

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          {!collapsed && <span>PFE</span>}
        </div>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <div className="profile-img">
          {user?.first_name?.[0]}{user?.last_name?.[0]}
        </div>
        {!collapsed && (
          <div className="profile-info">
            <h3>{user?.first_name} {user?.last_name}</h3>
            <p>{getRoleLabel(user?.role)}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="nav-section-title">Menu Principal</div>}
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer with Logout */}
      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn" title={collapsed ? 'Déconnexion' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

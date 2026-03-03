import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Layout Component - Udemy Style
 * Provides the main application layout with collapsible sidebar
 */
const Layout = ({ children, title = 'Dashboard', navItems = [] }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="app-container">
      {/* Sidebar Toggle Button */}
      <button 
        className={`sidebar-toggle ${sidebarCollapsed ? 'collapsed' : ''}`} 
        onClick={toggleSidebar}
        title={sidebarCollapsed ? 'Développer' : 'Réduire'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <path d={sidebarCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            {!sidebarCollapsed && <span>PFE</span>}
          </div>
        </div>

        {/* Profile Section */}
        <div className="sidebar-profile">
          <div className="profile-img">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          {!sidebarCollapsed && (
            <div className="profile-info">
              <h3>{user?.first_name} {user?.last_name}</h3>
              <p>{getRoleLabel(user?.role)}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {!sidebarCollapsed && <div className="nav-section-title">Menu Principal</div>}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer with Logout */}
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn" title={sidebarCollapsed ? 'Déconnexion' : ''}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            {!sidebarCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="content-header">
          <h1 className="page-title">📌 {title}</h1>
          <div className="header-actions">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input type="text" placeholder="Rechercher..." className="search-input" />
            </div>
          </div>
        </div>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

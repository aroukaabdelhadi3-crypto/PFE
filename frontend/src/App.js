import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import TraineeDashboard from './pages/trainee/TraineeDashboard';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import Subjects from './pages/admin/Subjects';
import Users from './pages/admin/Users';
import Courses from './pages/instructor/Courses';
import Controls from './pages/instructor/Controls';
import Corrections from './pages/instructor/Corrections';
import ResearchTopics from './pages/instructor/ResearchTopics';
import MyCourses from './pages/trainee/MyCourses';
import MyControls from './pages/trainee/MyControls';
import MyCorrections from './pages/trainee/MyCorrections';
import MyResearch from './pages/trainee/MyResearch';
import TraineeProgress from './pages/coordinator/TraineeProgress';
import DetailedProgress from './pages/supervisor/DetailedProgress';
import SupervisorSubmissions from './pages/supervisor/SupervisorSubmissions';
import './styles/global.css';

// Component that uses keyboard navigation
const KeyboardNavigationWrapper = () => {
  useKeyboardNavigation();
  return null;
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <KeyboardNavigationWrapper />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard title="Dashboard">
                <Dashboard />
              </AdminDashboard>
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard title="Gestion des Utilisateurs">
                <Users />
              </AdminDashboard>
            </PrivateRoute>
          } />
          <Route path="/admin/subjects" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard title="Gestion des Matières">
                <Subjects />
              </AdminDashboard>
            </PrivateRoute>
          } />
          
          {/* Instructor Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['instructor']}>
              <InstructorDashboard title="Dashboard">
                <Dashboard />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/courses" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard title="Gestion des Cours">
                <Courses />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/controls" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard title="Gestion des Contrôles">
                <Controls />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/corrections" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard title="Gestion des Corrections">
                <Corrections />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/research" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard title="Sujets de Recherche">
                <ResearchTopics />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          
          {/* Trainee Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard title="Dashboard">
                <Dashboard />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/courses" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard title="Mes Cours">
                <MyCourses />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/controls" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard title="Mes Contrôles">
                <MyControls />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/corrections" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard title="Mes Corrections">
                <MyCorrections />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/research" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard title="Ma Recherche">
                <MyResearch />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          
          {/* Coordinator Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['coordinator']}>
              <CoordinatorDashboard title="Dashboard">
                <Dashboard />
              </CoordinatorDashboard>
            </PrivateRoute>
          } />
          <Route path="/coordinator/progress" element={
            <PrivateRoute allowedRoles={['coordinator', 'supervisor', 'admin']}>
              <CoordinatorDashboard title="Progression des Stagiaires">
                <TraineeProgress />
              </CoordinatorDashboard>
            </PrivateRoute>
          } />
          
          {/* Supervisor Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['supervisor']}>
              <SupervisorDashboard title="Dashboard">
                <Dashboard />
              </SupervisorDashboard>
            </PrivateRoute>
          } />
          <Route path="/supervisor/progress" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard title="Progression Détaillée">
                <DetailedProgress />
              </SupervisorDashboard>
            </PrivateRoute>
          } />
          <Route path="/supervisor/submissions" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard title="Soumissions">
                <SupervisorSubmissions />
              </SupervisorDashboard>
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

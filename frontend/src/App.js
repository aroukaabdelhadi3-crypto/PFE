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

const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'trainee':
      return <TraineeDashboard />;
    case 'coordinator':
      return <CoordinatorDashboard />;
    case 'supervisor':
      return <SupervisorDashboard />;
    default:
      return <Dashboard />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <KeyboardNavigationWrapper />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardRouter />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Users />
            </PrivateRoute>
          } />
          <Route path="/admin/subjects" element={
            <PrivateRoute allowedRoles={['admin']}>
              <Subjects />
            </PrivateRoute>
          } />
          <Route path="/instructor/courses" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <Courses />
            </PrivateRoute>
          } />
          <Route path="/instructor/controls" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <Controls />
            </PrivateRoute>
          } />
          <Route path="/instructor/corrections" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <Corrections />
            </PrivateRoute>
          } />
          <Route path="/instructor/research" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <ResearchTopics />
            </PrivateRoute>
          } />
          <Route path="/trainee/courses" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <MyCourses />
            </PrivateRoute>
          } />
          <Route path="/trainee/controls" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <MyControls />
            </PrivateRoute>
          } />
          <Route path="/trainee/corrections" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <MyCorrections />
            </PrivateRoute>
          } />
          <Route path="/trainee/research" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <MyResearch />
            </PrivateRoute>
          } />
          <Route path="/coordinator/progress" element={
            <PrivateRoute allowedRoles={['coordinator', 'supervisor', 'admin']}>
              <TraineeProgress />
            </PrivateRoute>
          } />
          <Route path="/supervisor/progress" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <DetailedProgress />
            </PrivateRoute>
          } />
          <Route path="/supervisor/submissions" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorSubmissions />
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

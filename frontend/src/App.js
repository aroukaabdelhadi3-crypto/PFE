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

// Admin Layout with nested routes
const AdminLayout = () => {
  return (
    <AdminDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </AdminDashboard>
  );
};

// Instructor Layout with nested routes
const InstructorLayout = () => {
  return (
    <InstructorDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </InstructorDashboard>
  );
};

// Trainee Layout with nested routes
const TraineeLayout = () => {
  return (
    <TraineeDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </TraineeDashboard>
  );
};

// Coordinator Layout with nested routes
const CoordinatorLayout = () => {
  return (
    <CoordinatorDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </CoordinatorDashboard>
  );
};

// Supervisor Layout with nested routes
const SupervisorLayout = () => {
  return (
    <SupervisorDashboard>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </SupervisorDashboard>
  );
};

const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminLayout />;
    case 'instructor':
      return <InstructorLayout />;
    case 'trainee':
      return <TraineeLayout />;
    case 'coordinator':
      return <CoordinatorLayout />;
    case 'supervisor':
      return <SupervisorLayout />;
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
              <AdminDashboard>
                <Users />
              </AdminDashboard>
            </PrivateRoute>
          } />
          <Route path="/admin/subjects" element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard>
                <Subjects />
              </AdminDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/courses" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard>
                <Courses />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/controls" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard>
                <Controls />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/corrections" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard>
                <Corrections />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/instructor/research" element={
            <PrivateRoute allowedRoles={['instructor', 'admin']}>
              <InstructorDashboard>
                <ResearchTopics />
              </InstructorDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/courses" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard>
                <MyCourses />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/controls" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard>
                <MyControls />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/corrections" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard>
                <MyCorrections />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/trainee/research" element={
            <PrivateRoute allowedRoles={['trainee']}>
              <TraineeDashboard>
                <MyResearch />
              </TraineeDashboard>
            </PrivateRoute>
          } />
          <Route path="/coordinator/progress" element={
            <PrivateRoute allowedRoles={['coordinator', 'supervisor', 'admin']}>
              <CoordinatorDashboard>
                <TraineeProgress />
              </CoordinatorDashboard>
            </PrivateRoute>
          } />
          <Route path="/supervisor/progress" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard>
                <DetailedProgress />
              </SupervisorDashboard>
            </PrivateRoute>
          } />
          <Route path="/supervisor/submissions" element={
            <PrivateRoute allowedRoles={['supervisor', 'admin']}>
              <SupervisorDashboard>
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

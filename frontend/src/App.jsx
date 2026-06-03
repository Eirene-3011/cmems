import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Ministries from './pages/Ministries';
import Choirs from './pages/Choirs';
import Events from './pages/Events';
import Attendance from './pages/Attendance';
import Volunteers from './pages/Volunteers';
import Donations from './pages/Donations';
import Reports from './pages/Reports';
import Users from './pages/Users';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/members"    element={<Members />} />
            <Route path="/ministries" element={<Ministries />} />
            <Route path="/choirs"     element={<Choirs />} />
            <Route path="/events"     element={<Events />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/donations"  element={<Donations />} />
            <Route path="/reports"    element={<Reports />} />
            <Route path="/users"      element={<Users />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

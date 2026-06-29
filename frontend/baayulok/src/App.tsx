import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute    from './components/layout/ProtectedRoute';
import IndexPage         from './pages/IndexPage';
// import DashboardPage     from './pages/DashboardPage';
import PatientsPage      from './pages/PatientsPage';
// import PatientDetailPage from './pages/PatientDetailPage';
// import PatientDetailPage from './pages/PatientDetailPage';
// import PatientFormPage   from './pages/PatientFormPage';
// import ProfilePage       from './pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public — landing page with login/register modals */}
          <Route path="/" element={<IndexPage />} />

          {/* Protected — sidebar + outlet rendered by ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/dashboard"         element={<DashboardPage />} /> */}
            <Route path="/patients"          element={<PatientsPage />} />
            {/* <Route path="/patients/new"      element={<PatientFormPage />} /> */}
            {/* <Route path="/patients/:id"      element={<PatientDetailPage />} /> */}
            {/* <Route path="/patients/:id/edit" element={<PatientFormPage />} /> */}
            {/* <Route path="/profile"           element={<ProfilePage />} /> */}
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
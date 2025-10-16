import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './page/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layout/admin/AdminLayout';
import SuperAdminLayout from './layout/superadmin/SuperAdminLayout';
import { AuthProvider } from './context/AuthContext';
import appBg from './assets/app-bg.jpg';
import UpdatePasswordPage from './page/login/UpdatePassword';
import UniversityRedirect from './page/login/UniversityRedirect';

function App() {
  const location = useLocation();

  // check kung nasa login/update-password/university page ka
  const isLoginPage = location.pathname === "/";
  const isUpdatePasswordPage = location.pathname === "/login/update-password";
  const isUniversityPage = location.pathname.startsWith("/university/");

  const isAuthPage = isLoginPage || isUpdatePasswordPage || isUniversityPage;

  return (
    <AuthProvider>
      <div
        className={
          isAuthPage
            ? 'relative min-h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center'
            : 'min-h-screen w-full bg-white'
        }
        style={
          isAuthPage
            ? { backgroundImage: `url(${appBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      >
        <div className={isAuthPage ? 'z-10 w-full max-w-md mx-auto' : 'w-full'}>
          <Routes>
            {/* Login */}
            <Route path="/" element={<Login />} />

            {/* Manual Update Password (from profile/settings) */}
            <Route path="/login/update-password" element={<UpdatePasswordPage />} />

            {/* Dynamic University Activation Page */}
            <Route path="/university/:universityId" element={<UniversityRedirect />} />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />

            {/* SuperAdmin routes */}
            <Route
              path="/superadmin/*"
              element={
                <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

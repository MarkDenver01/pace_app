import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './page/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './layout/admin/AdminLayout';
import SuperAdminLayout from './layout/superadmin/SuperAdminLayout';
import { AuthProvider } from './context/AuthContext';
import appBg from './assets/app-bg.jpg';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <AuthProvider>
      <div
        className={
          isLoginPage
            ? 'relative min-h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center'
            : 'min-h-screen w-full bg-white'
        }
        style={
          isLoginPage
            ? { backgroundImage: `url(${appBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
        }
      >
        <div className={isLoginPage ? 'z-10 w-full max-w-md mx-auto' : 'w-full'}>
          <Routes>
            <Route path="/" element={<Login />} />

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

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Login from './page/login/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layout/dashboard/DashboardLayout.tsx';
import appBg from './assets/app-bg.jpg'; // import your background JPG
import type { JSX } from 'react';

function App(): JSX.Element {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div
      className={
        isLoginPage ? 'relative min-h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center' 
          : 'min-h-screen w-full'
      }
      style={
        isLoginPage
          ? {
            backgroundImage: `url(${appBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }
          : {}
      }
    >
      <div className={isLoginPage ? 'z-10' : ''}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;

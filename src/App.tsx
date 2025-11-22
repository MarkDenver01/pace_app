import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Login from "./page/login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layout/admin/AdminLayout";
import SuperAdminLayout from "./layout/superadmin/SuperAdminLayout";
import { AuthProvider } from "./context/AuthContext";

import UpdatePasswordPage from "./page/login/UpdatePassword";
import UniversityRedirect from "./page/login/UniversityRedirect";
import ReleaseApk from "./page/apk/ReleaseApk";
import AppLinkRedirect from "./page/link/AppLinkRedirect";

import PaceLandingPage from "./page/landing_page/LandingPage";

function App() {
  const location = useLocation();
  const path = location.pathname;

  /** AUTH PAGES (EXCLUDE landing "/") */
  const isLoginPage = path === "/login";
  const isUpdatePasswordPage = path === "/login/update-password";
  const isUniversityPage = path.startsWith("/university/");

  const isAuthPage = isLoginPage || isUpdatePasswordPage || isUniversityPage;

  return (
    <AuthProvider>
      <div
        className={
          isAuthPage
            ? "min-h-screen w-full flex items-center justify-center bg-orange-600"
            : "min-h-screen w-full bg-white"
        }
      >
        {/* inner wrapper kept intact */}
        <div className={isAuthPage ? "z-10 w-full max-w-md mx-auto" : "w-full"}>
          <Routes>
            {/* Homepage → Landing Page */}
            <Route path="/" element={<PaceLandingPage />} />

            {/* Login Page */}
            <Route path="/login" element={<Login />} />

            {/* Update Password */}
            <Route
              path="/login/update-password"
              element={<UpdatePasswordPage />}
            />

            {/* University Dynamic Page */}
            <Route
              path="/university/:universityId"
              element={<UniversityRedirect />}
            />

            {/* APK Upload */}
            <Route path="/apk-uploads" element={<ReleaseApk />} />

            {/* App Link Redirect */}
            <Route path="/app-link" element={<AppLinkRedirect />} />

            {/* Admin */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            />

            {/* Super Admin */}
            <Route
              path="/superadmin/*"
              element={
                <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            />

            {/* Unknown URL → Redirect to landing page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;

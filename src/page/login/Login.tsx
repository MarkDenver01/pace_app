import React, { useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";

import { login } from "../../libs/ApiResponseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../libs/models/Login";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

import PaceLogo from "../../assets/pace/logo_final.png";
import HeroStudent from "../../assets/pace/hero_student.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const universityId = searchParams.get("universityId");

  // 🔐 LOGIN LOGIC (UNCHANGED)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: LoginResponse = await login({ email, password });
      setAuth(response);

      if (response.role === "ADMIN") {
        const adminStatus = response.adminResponse.accountStatus;

        if (adminStatus === "PENDING") {
          const result = await Swal.fire({
            title: `Hi ${response.username}! Please update your password before LOGIN.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, PROCEED",
            cancelButtonText: "Cancel",
            ...getSwalTheme(),
          });

          if (result.isConfirmed) {
            navigate(
              `/login/update-password?universityId=${universityId}&email=${encodeURIComponent(
                email
              )}`
            );
          }
        } else if (adminStatus === "VERIFIED" || adminStatus === "ACTIVATE") {
          Swal.fire({
            icon: "success",
            title: `Welcome ${response.username}!`,
            text: "Proceed to dashboard.",
            confirmButtonText: "PROCEED",
            ...getSwalTheme(),
          }).then(() => navigate("/admin/dashboard"));
        } else {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: `Your account status (${adminStatus}) does not allow access.`,
            confirmButtonText: "CLOSE",
            ...getSwalTheme(),
          });
        }
      } else if (response.role === "SUPER_ADMIN") {
        Swal.fire({
          icon: "success",
          title: `Welcome ${response.username}!`,
          text: "Proceed to Super Admin dashboard.",
          confirmButtonText: "PROCEED",
          ...getSwalTheme(),
        }).then(() => navigate("/superadmin/dashboard"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Your role is not authorized to access this application.",
          confirmButtonText: "CLOSE",
          ...getSwalTheme(),
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.message || "Invalid email or password. Please try again.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-600">

      {/* MAIN LOGIN CARD */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL (Orange side) */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-10 flex flex-col justify-center items-center text-center">

          <img src={PaceLogo} className="h-24 mb-3 drop-shadow-xl" />

          <p className="text-white/90 text-sm mb-6">
            Personalized Academic <br /> and Career Exploration
          </p>

          <img
            src={HeroStudent}
            className="h-64 drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)] animate-floating"
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="p-10 bg-white flex flex-col justify-center">

          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            WELCOME BACK TO <span className="text-orange-700">PACE!</span>
          </h1>

          <p className="text-center mt-1 mb-8 font-semibold text-gray-700">
            Smart Management for a Smarter Future
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-2.5 text-orange-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="
                    w-full pl-10 pr-3 py-2 rounded-lg border border-orange-300 
                    focus:ring-2 focus:ring-orange-500 outline-none
                  "
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-2.5 text-orange-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full pl-10 pr-10 py-2 rounded-lg border border-orange-300
                    focus:ring-2 focus:ring-orange-500 outline-none
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-orange-600"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-600" />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-orange-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-2 bg-orange-600 text-white font-bold rounded-lg
                hover:bg-orange-700 transition shadow-md hover:shadow-xl
              "
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            © 2025 PACE System. All rights reserved.
          </p>
        </div>
      </div>

      {/* ANIMATIONS */}
      <style>{`
        @keyframes floating {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-floating {
          animation: floating 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;

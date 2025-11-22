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

  // ---- LOGIN LOGIC (UNCHANGED) ----
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
            title: `Hi ${response.username}! Please update your password.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed",
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
        } else {
          Swal.fire({
            icon: "success",
            title: `Welcome ${response.username}!`,
            text: "Proceed to dashboard.",
            confirmButtonText: "PROCEED",
            ...getSwalTheme(),
          }).then(() => navigate("/admin/dashboard"));
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
          text: "Your role is not allowed.",
          ...getSwalTheme(),
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.message || "Invalid email or password.",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  // ---- UI ----
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-500">

      {/* CARD */}
      <div className="w-full max-w-6xl bg-white rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT PANEL (ORANGE LIKE REFERENCE) */}
        <div className="relative p-8 flex flex-col items-center justify-center text-center bg-gradient-to-br from-orange-500 to-orange-700">

          <img
            src={PaceLogo}
            className="h-24 mb-3 drop-shadow-xl animate-fadeIn"
          />

          <p className="text-white/90 text-sm mb-4 animate-slideUp">
            Personalized Academic <br /> and Career Exploration
          </p>

          {/* MASCOT FLOAT ANIMATION */}
          <img
            src={HeroStudent}
            className="h-64 animate-floating drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
          />

          {/* bottom glow */}
          <div className="absolute bottom-14 w-40 h-5 bg-white/30 blur-xl" />
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-orange-50 p-10 flex flex-col justify-center">

          <h1 className="text-3xl font-extrabold text-center text-gray-900 animate-slideUp">
            WELCOME BACK TO <span className="text-orange-700">PACE!</span>
          </h1>

          <p className="text-center mt-1 mb-8 font-semibold text-gray-800 text-lg animate-slideUp">
            Smart Management for a Smarter Future
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-2.5 text-orange-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg 
                             border border-orange-300 bg-white 
                             focus:ring-2 focus:ring-orange-500 shadow-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-2.5 text-orange-600" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg 
                             border border-orange-300 bg-white 
                             focus:ring-2 focus:ring-orange-500 shadow-sm"
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
                className="text-orange-600 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-orange-600 text-white font-bold 
                         rounded-lg hover:bg-orange-700 transition 
                         shadow-md hover:shadow-xl hover:scale-[1.02]"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-500 mt-6">
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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp .9s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default Login;

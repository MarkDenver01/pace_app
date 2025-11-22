import React, { useState } from "react";
import {
  HiLockClosed,
  HiUser,
  HiEye,
  HiEyeOff
} from "react-icons/hi";
import { login } from "../../libs/ApiResponseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../libs/models/Login";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

import PaceLogo from "../../assets/pace/f_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";
import HeroBg from "../../assets/app-bg.jpg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const universityId = searchParams.get("universityId");

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
              )}`,
              { replace: true }
            );
          }
        } else if (
          adminStatus === "VERIFIED" ||
          adminStatus === "ACTIVATE"
        ) {
          Swal.fire({
            icon: "success",
            title: `Welcome ${response.username}!`,
            text: "Proceed to dashboard.",
            confirmButtonText: "PROCEED",
            ...getSwalTheme(),
          }).then((result) => {
            if (result.isConfirmed) navigate("/admin/dashboard");
          });
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
        }).then((result) => {
          if (result.isConfirmed) navigate("/superadmin/dashboard");
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.message || "Invalid email or password.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center text-gray-900 relative overflow-hidden"
      style={{
        backgroundImage: `url(${HeroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* BG Overlays */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/60" />

      <div className="relative z-10 flex w-full max-w-5xl mx-auto rounded-3xl bg-white/10 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden backdrop-blur-xl">
        
        {/* LEFT SIDE — LOGO + STUDENT */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 py-10 px-6 bg-gradient-to-br from-orange-500/70 to-orange-700/70 backdrop-blur-md border-r border-white/10">

          <img src={PaceLogo} className="h-44 drop-shadow-xl mb-4" />
          <img src={HeroStudent} className="h-72 drop-shadow-2xl animate-float" />

          <h1 className="mt-6 text-2xl font-extrabold text-white drop-shadow-lg text-center">
            Smart Management <br /> for a Smarter Future
          </h1>
        </div>

        {/* RIGHT SIDE — LOGIN FORM */}
        <div className="w-full md:w-1/2 bg-white/95 py-10 px-8 shadow-inner">

          <h2 className="text-3xl font-extrabold text-center text-orange-700 mb-1">
            Welcome Back to
          </h2>
          <h1 className="text-4xl font-extrabold text-center text-orange-600 tracking-wide mb-6">
            PACE!
          </h1>

          <form className="space-y-5" onSubmit={handleLogin}>

            <div className="space-y-1">
              <label className="font-semibold text-[15px]">Email</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-3 text-orange-600 text-lg" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-300 bg-orange-50/40 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-[15px]">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-orange-300 bg-orange-50/40 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-600" />
                Remember me
              </label>

              <button
                type="button"
                className="hover:text-orange-700 font-medium"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-lg hover:bg-orange-700 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center text-xs mt-6 text-gray-500">
            © 2025 PACE System. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;

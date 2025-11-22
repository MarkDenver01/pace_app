import React, { useState } from "react";
import {
  HiLockClosed,
  HiUser,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";

import { login } from "../../libs/ApiResponseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../libs/models/Login";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

import PaceLogo from "../../assets/pace/logo_final.png";
import HeroStudent from "../../assets/pace/hero_student.png";
import LoginLeftBG from "../../assets/pace/login_half_bg.jpg";
import LoginFullBG from "../../assets/pace/login_half_bg.jpg";

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
          text: "Your role is not authorized.",
          confirmButtonText: "CLOSE",
          ...getSwalTheme(),
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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${LoginFullBG})` }}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10" />

      {/* Animated decorative glow */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-orange-400/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-400/30 blur-3xl rounded-full animate-pulse" />

      {/* LOGIN CARD */}
      <div
        className="
          relative z-10 w-full max-w-7xl mx-6 
          rounded-[38px] overflow-hidden 
          shadow-[0_35px_90px_rgba(0,0,0,0.55)]
          flex backdrop-blur-xl bg-white/15 
          border border-white/30
          animate-[fadeIn_0.8s_ease-out]
        "
      >

        {/* LEFT PANE */}
        <div
          className="
            hidden md:flex flex-col justify-center items-center 
            w-1/2 px-10 py-14 relative
          "
          style={{
            backgroundImage: `url(${LoginLeftBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          {/* Floating glow behind logo */}
          <div className="absolute top-20 w-64 h-64 bg-orange-300/30 blur-2xl rounded-full animate-floatingGlow" />

          <img
            src={PaceLogo}
            className="h-44 md:h-52 drop-shadow-[0_12px_28px_rgba(0,0,0,0.45)] z-10 animate-[slideDown_0.8s_ease-out]"
          />

          <img
            src={HeroStudent}
            className="h-80 md:h-[26rem] drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)] animate-float z-10"
          />

          <h3 className="mt-6 text-center text-[22px] md:text-[24px] font-extrabold text-white leading-tight drop-shadow-2xl z-10">
            Smart Management
            <br />for a Smarter Future
          </h3>
        </div>

        {/* RIGHT PANE */}
        <div className="w-full md:w-1/2 bg-white/95 px-10 md:px-14 py-14">
          <div className="text-center mb-8 animate-[slideUp_0.8s_ease-out]">
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-orange-700">
              Welcome Back to
            </h2>
            <h1 className="text-[36px] md:text-[40px] font-extrabold text-orange-600 tracking-wide">
              PACE!
            </h1>
            <p className="mt-3 text-[15px] text-gray-600 font-medium">
              Smart Management for a Smarter Future
            </p>
          </div>

          <form
            className="space-y-7 animate-[fadeIn_1.2s_ease-out]"
            onSubmit={handleLogin}
          >
            {/* EMAIL */}
            <div>
              <label className="font-semibold text-[15px]">Email</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type="email"
                  required
                  className="
                    w-full pl-12 pr-4 py-3.5 
                    rounded-2xl border border-orange-300 
                    bg-orange-50/50 text-sm text-gray-800 
                    focus:ring-2 focus:ring-orange-500 
                    focus:border-orange-600 outline-none
                    transition
                  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-[15px]">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="
                    w-full pl-12 pr-12 py-3.5 
                    rounded-2xl border border-orange-300 
                    bg-orange-50/50 text-sm text-gray-800 
                    focus:ring-2 focus:ring-orange-500 
                    focus:border-orange-600 outline-none
                    transition
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 cursor-pointer text-gray-500 text-xl"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
              </div>
            </div>

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between items-center text-[14px] text-gray-600">
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

            {/* PREMIUM GRADIENT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3.5 rounded-full 
                bg-gradient-to-r from-orange-500 to-red-500 
                text-white font-bold shadow-xl 
                hover:shadow-[0_10px_26px_rgba(0,0,0,0.35)]
                hover:scale-[1.02] transition-all
                disabled:opacity-60
              "
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-10 text-gray-500">
            © 2025 PACE System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

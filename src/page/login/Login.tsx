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
      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

      {/* CARD */}
      <div
        className="
          relative z-10 w-full max-w-7xl mx-6
          rounded-[36px] overflow-hidden 
          shadow-[0_30px_80px_rgba(0,0,0,0.55)]
          flex bg-white/10 backdrop-blur-xl border border-white/30
        "
      >

        {/* LEFT PANEL */}
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
          <div className="absolute inset-0 bg-black/25" />

          <img
            src={PaceLogo}
            className="h-44 md:h-52 drop-shadow-2xl z-10 mb-4"
          />

          <img
            src={HeroStudent}
            className="h-80 md:h-[24rem] drop-shadow-[0_15px_40px_rgba(0,0,0,0.55)] animate-float z-10"
          />
        </div>

        {/* RIGHT PANEL – FULL CENTERED FORM */}
        <div className="w-full md:w-1/2 bg-white/95 flex flex-col justify-center">
          
          <div className="w-full max-w-sm mx-auto px-6 md:px-0 py-12">
            
            {/* HEADER */}
            <div className="text-center mb-8">
              <h2 className="text-[26px] md:text-[30px] font-extrabold text-orange-700">
                Smart Management
              </h2>
              <h1 className="text-[34px] md:text-[38px] font-extrabold text-orange-600 tracking-wide">
                for a Smarter Future
              </h1>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>

              {/* EMAIL */}
              <div>
                <label className="font-medium text-[14px] text-gray-800">
                  Email
                </label>
                <div className="relative mt-1">
                  <HiUser className="absolute left-3 top-3 text-orange-600 text-xl" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full pl-12 pr-4 py-3 rounded-2xl 
                      border border-orange-300 bg-orange-50/50
                      text-sm text-gray-800 
                      focus:ring-2 focus:ring-orange-500 focus:border-orange-600
                      outline-none transition
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="font-medium text-[14px] text-gray-800">
                  Password
                </label>
                <div className="relative mt-1">
                  <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-xl" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full pl-12 pr-12 py-3 rounded-2xl 
                      border border-orange-300 bg-orange-50/50
                      text-sm text-gray-800 
                      focus:ring-2 focus:ring-orange-500 focus:border-orange-600
                      outline-none transition
                    "
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3 cursor-pointer text-gray-500 text-xl"
                  >
                    {showPassword ? <HiEyeOff /> : <HiEye />}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3.5 rounded-full 
                  bg-gradient-to-r from-orange-500 to-red-500 
                  text-white font-bold shadow-xl 
                  hover:shadow-orange-400/40 hover:scale-[1.02]
                  transition disabled:opacity-60
                "
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>

            <p className="text-center text-[12px] mt-8 text-gray-500">
              © 2025 PACE System. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;

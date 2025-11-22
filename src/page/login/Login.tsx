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
import LoginLeftBG from "../../assets/pace/login_half_bg.jpg"; // LEFT SIDE BG
import LoginFullBG from "../../assets/pace/login_half_bg.jpg"; // MAIN BG (same image)

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
    <div
      className="
        min-h-screen w-full flex items-center justify-center 
        bg-cover bg-center bg-no-repeat relative
      "
      style={{ backgroundImage: `url(${LoginFullBG})` }}
    >
      {/* SOFT GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20" />

      {/* LOGIN CARD */}
      <div
        className="
          relative z-10 w-full max-w-6xl mx-6 
          rounded-[32px] overflow-hidden 
          shadow-[0_28px_70px_rgba(0,0,0,0.45)]
          flex backdrop-blur-md bg-white/10 border border-white/25
        "
      >

        {/* LEFT SIDE */}
        <div
          className="
            hidden md:flex w-1/2 flex-col items-center justify-center 
            px-10 py-14 relative overflow-hidden
          "
          style={{
            backgroundImage: `url(${LoginLeftBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* dark overlay */}
          <div className="absolute inset-0 bg-black/25" />

          {/* bottom glow */}
          <div className="
            absolute bottom-0 left-1/2 -translate-x-1/2 
            w-72 h-40 bg-[radial-gradient(circle,rgba(0,0,0,0.55),transparent_70%)]
            opacity-70
          " />

          <img
            src={PaceLogo}
            className="h-40 md:h-48 drop-shadow-2xl mb-4 relative z-10"
          />

          <img
            src={HeroStudent}
            className="h-80 md:h-[24rem] drop-shadow-2xl animate-float relative z-10"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 bg-white/95 px-8 md:px-10 py-12 flex flex-col">

          <div className="text-center mb-8">
            <h2 className="text-[26px] md:text-[30px] font-extrabold text-orange-700">
              Smart Management
            </h2>
            <h1 className="text-[32px] md:text-[36px] font-extrabold text-orange-600 tracking-wide">
              for a Smarter future
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="font-semibold text-[14px]">Email</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-3 text-orange-600 text-lg" />
                <input
                  type="email"
                  required
                  className="
                    w-full pl-10 pr-4 py-3 rounded-2xl
                    border border-orange-300 bg-orange-50/50 text-sm
                    focus:ring-2 focus:ring-orange-500 focus:outline-none
                  "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <label className="font-semibold text-[14px]">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="
                    w-full pl-10 pr-10 py-3 rounded-2xl 
                    border border-orange-300 bg-orange-50/50 text-sm
                    focus:ring-2 focus:ring-orange-500 focus:outline-none
                  "
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

            {/* REMEMBER + FORGOT */}
            <div className="flex justify-between items-center text-[13px] text-gray-600">
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

            {/* SUBMIT */}
            <button
              type="submit"
              className="
                w-full bg-orange-600 text-white font-bold 
                py-3 rounded-full shadow-lg 
                hover:bg-orange-700 transition disabled:opacity-60
              "
              disabled={loading}
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
  );
};

export default Login;

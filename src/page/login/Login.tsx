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
              `/login/update-password?universityId=${universityId}&email=${encodeURIComponent(email)}`,
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
        }
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
      {/* login container */}
      <div
        className="
          relative z-10 w-full 
          max-w-[1350px] 
          mx-6 
          rounded-[32px] 
          overflow-hidden 
          shadow-[0_25px_70px_rgba(0,0,0,0.45)]
          flex 
          bg-white/15 
          backdrop-blur-[3px]
          border border-white/30
        "
      >
        {/* LEFT PANE */}
        <div
          className="
            hidden md:flex 
            w-1/2 
            flex-col justify-center items-center 
            px-10 py-14 relative
          "
          style={{
            backgroundImage: `url(${LoginLeftBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/10" />

          <img
            src={PaceLogo}
            className="h-40 drop-shadow-xl mb-4 relative z-10"
          />

          <img
            src={HeroStudent}
            className="h-[22rem] drop-shadow-2xl relative z-10"
          />

          <h3 className="mt-6 text-center text-[22px] text-white font-extrabold leading-tight z-10">
            Smart Management <br /> for a Smarter Future
          </h3>
        </div>

        {/* RIGHT PANE */}
        <div className="w-1/2 bg-white px-12 py-14 flex flex-col">

          <div className="text-center mb-8">
            <h2 className="text-[30px] font-extrabold text-orange-700">
              Welcome Back to
            </h2>
            <h1 className="text-[40px] font-extrabold text-orange-600 tracking-wide">
              PACE!
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="font-semibold text-[15px]">Email</label>
              <div className="relative mt-1">
                <HiUser className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-orange-300 bg-orange-50/50 focus:ring-2 focus:ring-orange-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-[15px]">Password</label>
              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-orange-300 bg-orange-50/50 focus:ring-2 focus:ring-orange-500 outline-none"
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
            <div className="flex justify-between text-[14px] text-gray-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-orange-600" />
                Remember me
              </label>

              <button
                className="hover:text-orange-700"
                type="button"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-lg"
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

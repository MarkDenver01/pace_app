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
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

import PaceLogo from "../../assets/pace/logo_final.png";
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
      const response = await login({ email, password });
      setAuth(response);

      Swal.fire({
        icon: "success",
        title: `Welcome ${response.username}!`,
        confirmButtonText: "PROCEED",
        ...getSwalTheme(),
      }).then(() => {
        if (response.role === "SUPER_ADMIN") navigate("/superadmin/dashboard");
        else if (response.role === "ADMIN") navigate("/admin/dashboard");
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password.",
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
      style={{ backgroundImage: `url(${HeroBg})` }}
    >
      {/* Elegant translucent overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-3xl rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.40)] flex">
        
        {/* LEFT SIDE (Orange gradient + Student illustration) */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-b from-[#F9A63A] via-[#F07A1C] to-[#D6451C] p-8 relative">
          
          <img src={PaceLogo} className="h-28 drop-shadow-2xl mb-4" />

          <img
            src={HeroStudent}
            className="h-[300px] drop-shadow-2xl mb-4"
          />

          <h3 className="text-center text-[22px] font-extrabold text-white leading-tight drop-shadow-md">
            Smart Management  
            <br />
            for a Smarter Future
          </h3>

        </div>

        {/* RIGHT SIDE (Form UI) */}
        <div className="w-full md:w-1/2 bg-white/90 backdrop-blur-md p-10 flex flex-col">
          <h2 className="text-[30px] font-extrabold text-[#D6451C] text-center leading-tight">
            Welcome Back to<br />PACE!
          </h2>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            
            {/* EMAIL */}
            <div className="relative">
              <HiUser className="absolute left-4 top-3 text-[#D6451C]" />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D6451C] bg-white text-sm text-gray-700 focus:ring-2 focus:ring-[#D6451C]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-3 text-[#D6451C]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-full border border-[#D6451C] bg-white text-sm text-gray-700 focus:ring-2 focus:ring-[#D6451C]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D6451C] hover:bg-[#B71F1F] transition text-white py-3 rounded-full text-sm font-semibold shadow-md"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p className="text-center text-[12px] text-gray-600 mt-4">
              © 2025 PACE System. All rights reserved.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;

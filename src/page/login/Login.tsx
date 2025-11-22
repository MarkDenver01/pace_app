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
import LoginBG from "../../assets/pace/login_half_bg.jpg";

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
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${LoginBG})` }}
    >
      {/* CLEAN, CORPORATE LOGIN CARD */}
      <div
        className="
          flex w-full max-w-6xl rounded-2xl overflow-hidden 
          bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]
          border border-gray-200
        "
      >

        {/* LEFT PANEL (40%) */}
        <div
          className="w-[40%] hidden md:flex flex-col justify-center items-center px-8 py-10 relative"
          style={{
            backgroundImage: `url(${LoginBG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20" />

          <img src={PaceLogo} className="h-32 z-10 mb-5" />
          <img src={HeroStudent} className="h-72 z-10 drop-shadow-xl" />

          <h3 className="mt-6 text-center text-xl text-white font-extrabold z-10">
            Smart Management <br /> for a Smarter Future
          </h3>
        </div>

        {/* RIGHT PANEL (60%) */}
        <div className="w-[60%] bg-white px-10 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-700">
              Welcome Back
            </h2>
            <h1 className="text-4xl font-extrabold text-orange-600">
              to PACE!
            </h1>

            <p className="mt-3 text-gray-600 text-sm">
              Smart Management for a Smarter Future
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {/* EMAIL */}
            <div>
              <label className="font-semibold text-sm">Email Address</label>
              <div className="relative mt-1">
                <HiUser className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-sm">Password</label>
              <div className="relative mt-1">
                <HiLockClosed className="absolute left-3 top-3 text-orange-600 text-xl" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-3 border rounded-xl bg-gray-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 cursor-pointer text-gray-600 text-xl"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </span>
              </div>
            </div>

            {/* REMEMBER ME */}
            <div className="flex justify-between items-center text-sm text-gray-600">
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

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="
                w-full py-3 rounded-xl bg-orange-600 
                text-white font-bold text-lg
                hover:bg-orange-700 transition
              "
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            © 2025 PACE System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";

import {
  login,
  activateAccount,
  findUniversity,
} from "../../libs/ApiResponseService";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../libs/models/Login";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

import PaceLogo from "../../assets/pace/transpa_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";
import LoginLeftBG from "../../assets/pace/login_half_bg.jpg";
import LoginFullBG from "../../assets/pace/login_half_bg.jpg";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const { universityId: routeId } = useParams();
  const [searchParams] = useSearchParams();

  const queryId = searchParams.get("universityId");
  const storedId = localStorage.getItem("selectedUniversityId");

  /** Final university Id selection */
  const universityId = routeId || queryId || storedId || null;

  /** Make sure we always store it if found */
  if (universityId) localStorage.setItem("selectedUniversityId", universityId);

  // FORM STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** --------------------------
   * LOGIN FLOW WITH ACTIVATION
   --------------------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response: LoginResponse = await login({ email, password });

      /** Store auth temporarily so dashboard can use it later */
      setAuth(response);

      /** 🟧 ADMIN LOGIN */
      if (response.role === "ADMIN") {
        const adminStatus = response.adminResponse.accountStatus;

        // GET UNIVERSITY NAME
        let universityName = "your university";
        try {
          const uni = await findUniversity(Number(universityId));
          universityName = uni.universityName ?? "your university";
        } catch (e) {
          // ignore
        }

        /** CASE 1: Admin is PENDING → Ask to activate */
        if (adminStatus === "PENDING") {
          const confirmUpdate = await Swal.fire({
            title: `Hi ${response.username}!`,
            html: `
              Your admin account under <strong>"${universityName}"</strong> is not yet activated.
              <br/><br/>
              Tap <strong>Proceed</strong> to activate your account automatically.
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed",
            cancelButtonText: "Cancel",
            ...getSwalTheme(),
          });

          if (confirmUpdate.isConfirmed) {
            const activationSuccess = await activateAccount(
              response.adminResponse.email,
              Number(universityId)
            );

            if (!activationSuccess) {
              Swal.fire({
                icon: "error",
                title: "Activation Failed",
                text: "Please contact system administrator.",
                ...getSwalTheme(),
              });
              return;
            }

            Swal.fire({
              icon: "success",
              title: "Account Activated!",
              text: "Your account has been successfully activated.",
              confirmButtonText: "Continue",
              ...getSwalTheme(),
            }).then(() => {
              navigate("/admin/dashboard");
            });
          }

          return;
        }

        /** CASE 2: Already active / verified */
        if (
          adminStatus === "VERIFIED" ||
          adminStatus === "ACTIVATE" ||
          adminStatus === "ACTIVE" // in case you renamed
        ) {
          Swal.fire({
            icon: "success",
            title: `Welcome to "${universityName}", ${response.username}!`,
            confirmButtonText: "PROCEED",
            ...getSwalTheme(),
          }).then(() => navigate("/admin/dashboard"));
          return;
        }

        /** Invalid status */
        Swal.fire({
          icon: "error",
          title: "Access Denied",
          text: `Your account status (${adminStatus}) does not allow login.`,
          ...getSwalTheme(),
        });
        return;
      }

      /** 🟩 SUPER ADMIN */
      if (response.role === "SUPER_ADMIN") {
        Swal.fire({
          icon: "success",
          title: `Welcome ${response.username}!`,
          confirmButtonText: "PROCEED",
          ...getSwalTheme(),
        }).then(() => navigate("/superadmin/dashboard"));
        return;
      }

      /** ❌ Other roles */
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You are not allowed to access this system.",
        ...getSwalTheme(),
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.message || "Invalid credentials.",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  /** Forgot Password: must have email filled first */
  const handleForgotPasswordClick = async () => {
    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your registered email address first.",
        ...getSwalTheme(),
      });
      return;
    }

    navigate(`/forgot-password?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${LoginFullBG})` }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/15 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full px-4 sm:px-6">
        {/* Glow under card */}
        <div className="mx-auto max-w-4xl pointer-events-none">
          <div className="mx-auto h-6 w-3/4 rounded-full bg-orange-500/40 blur-2xl opacity-75" />
        </div>

        {/* LOGIN CARD */}
        <div
          className="
            relative mx-auto mt-3 max-w-4xl
            rounded-3xl bg-white/96 backdrop-blur-xl
            border border-white/80 shadow-[0_22px_60px_rgba(0,0,0,0.4)]
            overflow-hidden
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* LEFT IMAGE PANEL */}
            <div
              className="
                md:col-span-2 relative flex flex-col items-center justify-center
                p-6 sm:p-7
              "
              style={{
                backgroundImage: `url(${LoginLeftBG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/35" />

              <div className="relative flex flex-col items-center">
                <img
                  src={PaceLogo}
                  alt="PACE Logo"
                  className="h-[200px] md:h-[240px] lg:h-[320px] w-auto drop-shadow-2xl"
                />
                <img
                  src={HeroStudent}
                  alt="Student"
                  className="h-44 sm:h-52 md:h-60 drop-shadow-[0_18px_40px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>

            {/* RIGHT FORM PANEL */}
            <div className="md:col-span-3 p-6 sm:p-8 bg-white/98">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-orange-700">
                  Smart Management
                </h2>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 tracking-wide">
                  for a Smarter Future
                </h1>
              </div>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
                {/* EMAIL */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <HiUser className="absolute left-3 top-2.5 text-orange-500 group-focus-within:text-orange-600 transition" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="
                        w-full pl-10 pr-3 py-2.5 rounded-xl
                        bg-white/90 border border-orange-300
                        text-gray-800 text-sm
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        outline-none transition
                      "
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute left-3 top-2.5 text-orange-500 group-focus-within:text-orange-600 transition" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="
                        w-full pl-10 pr-10 py-2.5 rounded-xl
                        bg-white/90 border border-orange-300
                        text-gray-800 text-sm
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        outline-none transition
                      "
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-orange-600 transition"
                    >
                      {showPassword ? <HiEyeOff /> : <HiEye />}
                    </button>
                  </div>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="accent-orange-600" />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="text-orange-600 hover:text-orange-700 font-medium"
                    onClick={handleForgotPasswordClick}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-2.5 sm:py-3
                    rounded-full
                    bg-gradient-to-r from-orange-500 to-orange-600
                    text-white text-sm sm:text-base font-semibold
                    shadow-lg hover:shadow-[0_14px_30px_rgba(249,115,22,0.55)]
                    hover:translate-y-[-1px]
                    transition-all disabled:opacity-60
                  "
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-[10px] sm:text-xs text-gray-500 text-center">
                © 2025 PACE System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

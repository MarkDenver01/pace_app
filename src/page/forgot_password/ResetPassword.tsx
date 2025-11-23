// src/page/login/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";
import { resetPassword } from "../../libs/ApiResponseService";

import PaceLogo from "../../assets/pace/transpa_logo.png";
import HeroStudent from "../../assets/pace/hero_student.png";
import LoginLeftBG from "../../assets/pace/login_half_bg.jpg";
import LoginFullBG from "../../assets/pace/login_half_bg.jpg";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Invalid link",
        text: "Reset token is missing or invalid.",
        confirmButtonText: "Back to Login",
        ...getSwalTheme(),
      }).then(() => navigate("/login"));
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return;

    if (!newPassword || !confirm) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter and confirm your new password.",
        ...getSwalTheme(),
      });
      return;
    }

    if (newPassword !== confirm) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please make sure both password fields are the same.",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been reset successfully.",
        confirmButtonText: "Back to Login",
        ...getSwalTheme(),
      }).then(() => navigate("/login"));
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Reset Failed",
        text:
          error?.message ||
          "The link may be expired or invalid. Please request a new reset link.",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
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

        {/* CARD */}
        <div
          className="
            relative mx-auto mt-3 max-w-4xl
            rounded-3xl bg-white/96 backdrop-blur-xl
            border border-white/80 shadow-[0_22px_60px_rgba(0,0,0,0.4)]
            overflow-hidden
          "
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* LEFT PANEL */}
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

            {/* RIGHT PANEL */}
            <div className="md:col-span-3 p-6 sm:p-8 bg-white/98">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-orange-700">
                  Reset Password
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Set a new password for your administrator account.
                </p>
              </div>

              <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
                {/* New Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute left-3 top-2.5 text-orange-500 group-focus-within:text-orange-600 transition" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute left-3 top-2.5 text-orange-500 group-focus-within:text-orange-600 transition" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="
                        w-full pl-10 pr-10 py-2.5 rounded-xl
                        bg-white/90 border border-orange-300
                        text-gray-800 text-sm
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        outline-none transition
                      "
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
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
                  {loading ? "Updating..." : "Update Password"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full text-center text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium mt-2"
                >
                  Back to Login
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

export default ResetPassword;

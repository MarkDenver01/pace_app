import React, { useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";
import { login } from "../../libs/ApiResponseService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { LoginResponse } from "../../libs/models/Login";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";

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
            cancelButtonColor: "#6b7280", // gray-500
            confirmButtonText: "Yes, PROCEED",
            cancelButtonText: "Cancel",
            ...getSwalTheme(),
          });
          
          if (result.isConfirmed) {
            navigate(`/login/update-password?universityId=${universityId}&email=${encodeURIComponent(email)}`, { replace: true });
          }
        } else if(adminStatus  === "VERIFIED" || adminStatus  === "ACTIVATE") {
          Swal.fire({
            icon: "success",
            title: `Welcome ${response.username} - ${response.adminResponse.universityName}!`,
            text: "Tap proceed to continue.",
            confirmButtonText: "PROCEED",
            ...getSwalTheme(),
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/admin/dashboard", { replace: true });
            }
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Access Denied",
            text: `Your account status "${adminStatus}" does not allow access.`,
            confirmButtonText: "CLOSE",
            ...getSwalTheme(),
          });
        }
      } else if (response.role === "SUPER_ADMIN") {
        Swal.fire({
          icon: "success",
          title: `Welcome ${response.username}!`,
          text: "Tap proceed to the super dashboard.",
          confirmButtonText: "PROCEED",
          ...getSwalTheme(),
        }).then((result) => {
          if (result.isConfirmed) navigate("/superadmin/dashboard", { replace: true });
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
    <div className="w-full max-w-md min-w-[340px] card-theme rounded-2xl shadow-xl overflow-hidden">
      <div className="w-full p-8 text-white text-center" style={{ backgroundColor: "var(--button-color)" }}>
        <h2 className="text-2xl font-bold mb-2 leading-tight">PACE ADMIN PORTAL</h2>
        <p className="text-sm opacity-90">Please input your valid account.</p>
      </div>

      <form onSubmit={handleLogin} className="p-8 space-y-5">
        <h3 className="text-center font-semibold tracking-wide text-sm" style={{ color: "var(--button-color)" }}>
          ADMIN LOGIN
        </h3>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]"><HiUser /></span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
            required
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]"><HiLockClosed /></span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
            required
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer">
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>

        <Button type="submit" disabled={loading} className="w-full text-white rounded-full py-2 text-sm" style={{ backgroundColor: "var(--button-color)" }}>
          {loading ? "Logging in..." : "LOGIN"}
        </Button>
      </form>
    </div>
  );
};

export default Login;

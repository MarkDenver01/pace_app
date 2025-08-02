import React, { useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";
import { login } from "../../libs/loginService";
import { saveAuthInfo } from "../../utils/authUtils";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      setAuth(response.jwtToken, response.role);

       // Navigate based on role
      if (response.role === "ADMIN") {
        setLoading(false);
        navigate("/admin/dashboard");
      } else if (response.role === "SUPER_ADMIN") {
        setLoading(false);
        navigate("/superadmin/dashboard");
      } else {
        setLoading(false);
        navigate("/");
        setErrorMessage("Login failed: Unauthorized role");
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Login failed");
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

        {errorMessage && (
          <div className="text-red-600 text-sm text-center">{errorMessage}</div>
        )}

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)]
              border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            required
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiLockClosed />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)]
              border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-full py-2 text-sm"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          {loading ? 'Logging in...' : 'LOGIN'}
        </Button>
      </form>
    </div>
  );
};

export default Login;

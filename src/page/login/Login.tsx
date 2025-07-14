import React, { useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in with", email, password);
  };

  return (
    <div className="w-full max-w-md min-w-[340px] card-theme rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div
        className="w-full p-8 text-white text-center"
        style={{
          backgroundColor: "var(--button-color)",
        }}
      >
        <h2 className="text-2xl font-bold mb-2 leading-tight">
          PACE ADMIN PORTAL
        </h2>
        <p className="text-sm opacity-90">Please input your valid account.</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="p-8 space-y-5">
        <h3
          className="text-center font-semibold tracking-wide text-sm"
          style={{ color: "var(--button-color)" }}
        >
          ADMIN LOGIN
        </h3>

        {/* Email */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="email"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)]
              border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            required
          />
        </div>

        {/* Password */}
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

        {/* Actions */}
        <div className="flex justify-between text-xs text-gray-500">
          <label className="flex items-center gap-1">
            <input type="checkbox" className="accent-[var(--button-color)]" />
            Remember
          </label>
          <a href="#" className="hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full text-white rounded-full py-2 text-sm"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default Login;

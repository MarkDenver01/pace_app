import React, { useState, useEffect } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";
import { updatePassword } from "../../libs/ApiResponseService";

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setAuth } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user?.adminResponse?.userId) {
    Swal.fire({
      icon: "error",
      title: "User ID not found",
      text: "Cannot update password because user information is missing.",
      confirmButtonText: "CLOSE",
      ...getSwalTheme(),
    });
    return;
  }

  if (password !== confirmPassword) {
    Swal.fire({
      icon: "error",
      title: "Passwords do not match",
      text: "Please make sure both password fields are the same.",
      confirmButtonText: "CLOSE",
      ...getSwalTheme(),
    });
    return;
  }

  setLoading(true);

  try {
    const success = await updatePassword(user?.adminResponse?.userId, password);

    if (success) {
      Swal.fire({
        icon: "success",
        title: "Password Updated",
        text: "Your password has been successfully updated. Please login again.",
        confirmButtonText: "LOGIN",
        ...getSwalTheme(),
      }).then(() => {
        setAuth(null);
        navigate("/", { replace: true });
      });
    } else {
      Swal.fire({
        icon: "error",  
        title: "Update Failed",
        text: `Unable to update password. Please try again.`,
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md min-w-[340px] card-theme rounded-2xl shadow-xl overflow-hidden">
      <div
        className="w-full p-8 text-white text-center"
        style={{ backgroundColor: "var(--button-color)" }}
      >
        <h2 className="text-2xl font-bold mb-2 leading-tight">
          UPDATE ADMIN ACCOUNT
        </h2>
        <p className="text-sm opacity-90">Please update your password.</p>
      </div>

      <form onSubmit={handleUpdate} className="p-8 space-y-5">
        <h3
          className="text-center font-semibold tracking-wide text-sm"
          style={{ color: "var(--button-color)" }}
        >
          CHANGE PASSWORD
        </h3>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="text"
            readOnly
            placeholder="User name"
            value={username}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
          />
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiLockClosed />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
          >
            {showPassword ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiLockClosed />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
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
          {loading ? "Updating..." : "CHANGE PASSWORD"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;

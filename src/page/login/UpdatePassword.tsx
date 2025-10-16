import React, { use, useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";
import { validateTempPassword, updatePassword, generateActivationLink  } from "../../libs/ApiResponseService";

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { universityId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("universityId");
  const queryEmail = searchParams.get("email");
  const { user, setAuth } = useAuth();
  const universityId = paramId || queryId;
  const email = queryEmail || user?.adminResponse?.email;

  const [username, setUsername] = useState(`University-${universityId}`); // default label
  const [tempPassword, setTempPassword] = useState("");
  const [isTempValid, setIsTempValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Validate temporary password */
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityId) {
      Swal.fire({
        icon: "error",
        title: "University ID missing",
        text: "Invalid link. Please request a new activation link.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);
    try {
      const isValid = await validateTempPassword(
        Number(universityId),
        tempPassword
      );

      if (isValid) {
        setIsTempValid(true);
        const result = await generateActivationLink(Number(universityId));
        Swal.fire({
          icon: "success",
          title: "Temporary Password Validated",
          html: `
            <p>Your temporary password is valid.</p>
            <p>You may now activate your account using the link below:</p>
            <a href="${result.link}" target="_blank" style="color:#2563eb;text-decoration:underline;word-break:break-all;">
              ${result.link}
            </a>
          `,
          confirmButtonText: "OK",
          ...getSwalTheme(),
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Invalid Temporary Password",
          text: "Please check your temporary password and try again.",
          confirmButtonText: "CLOSE",
          ...getSwalTheme(),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  /** Update password */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (!universityId) {
      Swal.fire({
        icon: "error",
        title: "University ID missing",
        text: "Invalid link. Please request a new activation link.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);
    try {
      const success = await updatePassword(email!, Number(universityId), password);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          text: "Your account has been activated successfully.",
          confirmButtonText: "PROCEED",
          ...getSwalTheme(),
        }).then(() => {
          setAuth(null);
          navigate("/admin", { replace: true }); // or navigate("/") if general user
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
          ACTIVATE ADMIN ACCOUNT
        </h2>
        <p className="text-sm opacity-90">
          Please validate your temporary password and set a new one.
        </p>
      </div>

      <form
        onSubmit={isTempValid ? handleUpdate : handleActivate}
        className="p-8 space-y-5"
      >
        <h3
          className="text-center font-semibold tracking-wide text-sm"
          style={{ color: "var(--button-color)" }}
        >
          {isTempValid ? "SET NEW PASSWORD" : "VALIDATE TEMPORARY PASSWORD"}
        </h3>

        {/* Username field */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="text"
            readOnly
            placeholder="University ID"
            value={username}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
          />
        </div>

        {/* Temporary password field */}
        {!isTempValid && (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
              <HiLockClosed />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Temporary Password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>
        )}

        {/* New + confirm password fields */}
        {isTempValid && (
          <>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
                <HiLockClosed />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
                required
              />
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
                className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)]"
                required
              />
            </div>
          </>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-full py-2 text-sm"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          {loading
            ? "Processing..."
            : isTempValid
            ? "UPDATE PASSWORD"
            : "ACTIVATE ACCOUNT"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;

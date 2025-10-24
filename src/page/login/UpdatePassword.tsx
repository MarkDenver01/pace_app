import React, { useState, useEffect } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff, HiMail } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";
import {
  validateTempPassword,
  updatePassword,
  getEmailDomain,
} from "../../libs/ApiResponseService";

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { universityId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("universityId");
  const queryEmail = searchParams.get("email");
  const { user, setAuth } = useAuth();
  const universityId = paramId || queryId;
  const email = queryEmail || user?.adminResponse?.email;

  const [username, setUsername] = useState(`University-${universityId}`);
  const [tempPassword, setTempPassword] = useState("");
  const [isTempValid, setIsTempValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailDomain, setEmailDomain] = useState<string | null>(null);
  const [isDomainDisabled, setIsDomainDisabled] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** Fetch email domain when temporary password is validated */
  const fetchEmailDomain = async (id: number) => {
    try {
      const domain = await getEmailDomain(id);
      if (domain) {
        setEmailDomain(domain);
        setIsDomainDisabled(true);
      } else {
        setEmailDomain("");
        setIsDomainDisabled(false);
      }
    } catch (error) {
      console.error("Error fetching email domain:", error);
      setEmailDomain("");
      setIsDomainDisabled(false);
    }
  };

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
      const isValid = await validateTempPassword(Number(universityId), tempPassword);

      if (isValid) {
          await fetchEmailDomain(Number(universityId)); // wait first
          setIsTempValid(true); // then show new password + domain fields
          Swal.fire({
            icon: "success",
            title: "Temporary Password Validated",
            text: "Your temporary password is valid.",
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

    if (!emailDomain?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Domain Required",
        text: "Please enter an email domain before proceeding.",
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
      const success = await updatePassword(email!, Number(universityId), password, emailDomain);

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Password Updated",
          html: `
            <p>Your account has been activated successfully.</p>
            <p><strong>Email Domain Set:</strong> ${emailDomain}</p>
          `,
          confirmButtonText: "PROCEED",
          ...getSwalTheme(),
        }).then(() => {
          setAuth(null);
          navigate("/admin", { replace: true });
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

        {/* New + confirm password + email domain */}
        {isTempValid && (
          <>
            {/* New Password */}
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

            {/* Confirm Password */}
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

            {/* Email Domain */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
                <HiMail />
              </span>
              <input
                type="text"
                placeholder="Set Email Domain (e.g. @university.edu)"
                value={emailDomain || ""}
                onChange={(e) => setEmailDomain(e.target.value)}
                disabled={isDomainDisabled}
                className={`w-full pl-10 pr-4 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] ${
                  isDomainDisabled ? "opacity-70 cursor-not-allowed" : ""
                }`}
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

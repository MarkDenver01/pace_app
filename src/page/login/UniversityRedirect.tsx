import React, { useState } from "react";
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
  const { user, setAuth } = useAuth();

  /** ------------ Resolve universityId safely ------------ */
  const { universityId: routeUniversityId } = useParams(); // /update-password?...
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("universityId");
  const storedId = localStorage.getItem("selectedUniversityId");

  const universityId = routeUniversityId || queryId || storedId || null;

  if (universityId) {
    localStorage.setItem("selectedUniversityId", universityId);
  }

  /** ------------ Resolve Email safely ------------ */
  const queryEmail = searchParams.get("email");
  const email = queryEmail || user?.adminResponse?.email || null;

  /** ------------ States ------------ */
  const [username] = useState(`University-${universityId}`);
  const [tempPassword, setTempPassword] = useState("");
  const [isTempValid, setIsTempValid] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailDomain, setEmailDomain] = useState<string | null>(null);
  const [isDomainDisabled, setIsDomainDisabled] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /** ---------------------------------------------------
   *  FETCH EMAIL DOMAIN (after validating temp password)
   --------------------------------------------------- */
  const fetchDomain = async (id: number) => {
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
      console.error("Failed to get email domain", error);
      setEmailDomain("");
      setIsDomainDisabled(false);
    }
  };

  /** ---------------------------------------------------
   *  VALIDATE TEMP PASSWORD
   --------------------------------------------------- */
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityId) {
      Swal.fire({
        icon: "error",
        title: "Missing University ID",
        text: "Invalid link. Please request a new activation link.",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);
    try {
      const isValid = await validateTempPassword(Number(universityId), tempPassword);

      if (!isValid) {
        Swal.fire({
          icon: "error",
          title: "Invalid Temporary Password",
          text: "Please try again.",
          ...getSwalTheme(),
        });
        return;
      }

      /** TEMP PASSWORD VALID → LOAD EMAIL DOMAIN */
      await fetchDomain(Number(universityId));
      setIsTempValid(true);

      Swal.fire({
        icon: "success",
        title: "Temporary Password Validated",
        text: "You can now set your new password.",
        ...getSwalTheme(),
      });
    } finally {
      setLoading(false);
    }
  };

  /** ---------------------------------------------------
   *  UPDATE PASSWORD
   --------------------------------------------------- */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityId) {
      Swal.fire({
        icon: "error",
        title: "Missing University ID",
        text: "Invalid link. Please request a new activation link.",
        ...getSwalTheme(),
      });
      return;
    }

    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Missing Email",
        text: "No email detected. Try logging in again.",
        ...getSwalTheme(),
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords Do Not Match",
        text: "Make sure both passwords match.",
        ...getSwalTheme(),
      });
      return;
    }

    if (!emailDomain?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Domain Required",
        text: "Please enter a valid domain.",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);

    try {
      const success = await updatePassword(
        email,
        Number(universityId),
        password,
        emailDomain
      );

      if (!success) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: "Unable to update password.",
          ...getSwalTheme(),
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Password Updated",
        html: `
          <p>Your account has been activated successfully.</p>
          <p><strong>Email Domain:</strong> ${emailDomain}</p>
        `,
        confirmButtonText: "PROCEED",
        ...getSwalTheme(),
      }).then(() => {
        setAuth(null);
        navigate("/admin", { replace: true });
      });
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
        <h2 className="text-2xl font-bold mb-2">ACTIVATE ADMIN ACCOUNT</h2>
        <p className="text-sm opacity-90">
          Validate your temporary password, then set a new one.
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
          {isTempValid ? "SET NEW PASSWORD" : "VALIDATE TEMP PASSWORD"}
        </h3>

        {/* USERNAME */}
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="text"
            readOnly
            value={username}
            className="w-full pl-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)]"
          />
        </div>

        {/* TEMP PASSWORD */}
        {!isTempValid && (
          <div className="relative">
            <HiLockClosed className="absolute left-3 top-2.5 text-[var(--button-color)]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Temporary Password"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>
        )}

        {/* NEW PASSWORD FIELDS */}
        {isTempValid && (
          <>
            {/* New Password */}
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-2.5 text-[var(--button-color)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)]"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-2.5 text-[var(--button-color)]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)]"
              />
            </div>

            {/* Email Domain */}
            <div className="relative">
              <HiMail className="absolute left-3 top-2.5 text-[var(--button-color)]" />
              <input
                type="text"
                placeholder="Set Email Domain (e.g. @university.edu)"
                value={emailDomain ?? ""}
                onChange={(e) => setEmailDomain(e.target.value)}
                disabled={isDomainDisabled}
                required
                className={`w-full pl-10 pr-4 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] border-[var(--button-color)]
                  ${isDomainDisabled ? "opacity-70 cursor-not-allowed" : ""}
                `}
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

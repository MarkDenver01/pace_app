import React, { useState } from "react";
import { HiUser } from "react-icons/hi";
import { Button } from "flowbite-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { getSwalTheme } from "../../utils/getSwalTheme";
import { activateAccount } from "../../libs/ApiResponseService";

const UpdatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { universityId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("universityId");
  const queryEmail = searchParams.get("email");
  const { user } = useAuth();

  const universityId = paramId || queryId;
  const email = queryEmail || user?.adminResponse?.email;

  const [loading, setLoading] = useState(false);

  const username = `University-${universityId}`;

  /** ACTIVATE ACCOUNT ONLY */
  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!universityId || !email) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "Missing required info. Request a new activation link.",
        confirmButtonText: "CLOSE",
        ...getSwalTheme(),
      });
      return;
    }

    setLoading(true);

    try {
      const success = await activateAccount(email, Number(universityId));

      if (!success) {
        Swal.fire({
          icon: "error",
          title: "Activation Failed",
          text: "Unable to activate your account. Please try again.",
          confirmButtonText: "CLOSE",
          ...getSwalTheme(),
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Account Activated!",
        text: "Redirecting to your dashboard...",
        confirmButtonText: "PROCEED",
        ...getSwalTheme(),
      }).then(() => {
        navigate("/admin/dashboard", { replace: true });
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
        <h2 className="text-2xl font-bold mb-2 leading-tight">
          ACTIVATE ADMIN ACCOUNT
        </h2>
        <p className="text-sm opacity-90">
          Click Activate to continue.
        </p>
      </div>

      <form onSubmit={handleActivate} className="p-8 space-y-5">
        <h3
          className="text-center font-semibold tracking-wide text-sm"
          style={{ color: "var(--button-color)" }}
        >
          ACCOUNT INFORMATION
        </h3>

        {/* University ID */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
            <HiUser />
          </span>
          <input
            type="text"
            readOnly
            value={username}
            className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm border-[var(--button-color)]"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full text-white rounded-full py-2 text-sm"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          {loading ? "Activating..." : "ACTIVATE ACCOUNT"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePasswordPage;

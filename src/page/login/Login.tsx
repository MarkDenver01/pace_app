import React, { use, useEffect, useState } from "react";
import { HiLockClosed, HiUser, HiEye, HiEyeOff } from "react-icons/hi";
import { Button } from "flowbite-react";
import { login } from "../../libs/loginService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
//import AlertDialog from "../../components/AlertDialog";
import { type LoginResponse } from "../../libs/models/response/LoginResponse";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Alert dialog state
  //const [alertOpen, setAlertOpen] = useState(false);
  // const [alertType, setAlertType] = useState<"success" | "error">("success");
  // const [alertTitle, setAlertTitle] = useState("");
  // const [alertMessage, setAlertMessage] = useState("");
  // const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // const showAlert = (
  //   type: "success" | "error",
  //   title: string,
  //   message: string,
  //   redirectTo?: string
  // ) => {
  //   setAlertType(type);
  //   setAlertTitle(title);
  //   setAlertMessage(message);
  //   setRedirectPath(redirectTo || null);
  //   setAlertOpen(true);
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setLoading(true);
        try {
      const response: LoginResponse = await login({ email, password });
      setAuth(response);
      setLoginSuccess(true); // Trigger useEffect
    } catch (error: any) {
      setLoading(false);
      //setErrorMessage(error.message || "Login failed");
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

   // Safe useEffect for redirection after login
  useEffect(() => {
    if (loginSuccess && user) {
      const redirect = async () => {
        if (user.role === "ADMIN") {
          Swal.fire({
              icon: "success",
              title: "Welcome " + user.username + "!",
              text: "Tap proceed to the admin dashboard.",
              confirmButtonText: "PROCEED",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/admin/dashboard", { replace: true });
              }
            });
        } else if (user.role === "SUPER_ADMIN") {
          Swal.fire({
              icon: "success",
              title: "Welcome " + user.username + "!",
              text: "Tap proceed to the super dashboard.",
              confirmButtonText: "PROCEED",
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/superadmin/dashboard", { replace: true });
              }
            });
        } else {
          await Swal.fire("Unauthorized", "Login failed: Unauthorized role", "error");
          Swal.fire({
              icon: "error",
              title: "Unauthorized",
              text: "Your role is not authorized to access this application.",
              confirmButtonText: "CLOSE",
          });  
        }
      };

      redirect();
    }
  }, [loginSuccess, user, navigate]);

  useEffect(() => {
    if(loginError) {
      setLoginError(false);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        confirmButtonText: "CLOSE",
      });
    }
  });

  // const handleAlertClose = () => {
  //   setAlertOpen(false);
  //   if (redirectPath) {
  //     navigate(redirectPath);
  //   }
  // };

  return (
    <>
      <div className="w-full max-w-md min-w-[340px] card-theme rounded-2xl shadow-xl overflow-hidden">
        <div
          className="w-full p-8 text-white text-center"
          style={{ backgroundColor: "var(--button-color)" }}
        >
          <h2 className="text-2xl font-bold mb-2 leading-tight">PACE ADMIN PORTAL</h2>
          <p className="text-sm opacity-90">Please input your valid account.</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <h3
            className="text-center font-semibold tracking-wide text-sm"
            style={{ color: "var(--button-color)" }}
          >
            ADMIN LOGIN
          </h3>

          {/* {errorMessage && (
            <div className="text-red-600 text-sm text-center">{errorMessage}</div>
          )} */}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--button-color)]">
              <HiUser />
            </span>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-full bg-[var(--card-color)] text-sm text-[var(--text-color)] 
              border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
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
              border-[var(--button-color)] focus:outline-none focus:ring-2 focus:ring-[var(--button-color)] focus:border-[var(--button-color)]"
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
            {loading ? "Logging in..." : "LOGIN"}
          </Button>
        </form>
      </div>

      {/* Alert Dialog */}
      {/* <AlertDialog
        isOpen={alertOpen}
        type={alertType}
        title={alertTitle}
        message={alertMessage}
        onClose={handleAlertClose}
      /> */}
    </>
  );
};

export default Login;

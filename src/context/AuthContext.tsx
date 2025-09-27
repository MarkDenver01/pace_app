import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../libs/models/Login";
import { useThemeContext, type Theme } from "./ThemeContext";
import type { CustomizationResponse } from "../libs/models/Customization";
import { getTheme } from "../libs/ApiResponseService";

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  logout: () => void;
  setAuth: (user: LoginResponse | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  logout: () => {},
  setAuth: () => {},
});

function isTheme(value: string): value is Theme {
  const ALL_THEMES: Theme[] = [
    "light",
    "dark",
    "redish",
    "purplelish",
    "brownish",
    "super_admin",
    "custom_admin",
  ];
  return ALL_THEMES.includes(value as Theme);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { setThemeName } = useThemeContext();

  const [user, setUser] = useState<LoginResponse | null>(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("authorized_role");
    const username = localStorage.getItem("authorized_username");
    const adminInfo = localStorage.getItem("authorized_admin_info");
    const universityId = localStorage.getItem("authorized_university_id");

    if (!token || !role || !username || !adminInfo) return null;

    let parsedAdmin = {} as any;
    try {
      parsedAdmin = JSON.parse(adminInfo);
    } catch {
      parsedAdmin = { accountStatus: "UNKNOWN" };
    }

    return { jwtToken: token, role, username, adminResponse: parsedAdmin, universityId };
  });

  const getSavedTheme = (): Theme => {
    const savedTheme = localStorage.getItem("themeName");
    if (savedTheme && isTheme(savedTheme)) return savedTheme;
    return "light";
  };

  useEffect(() => {
    if (user?.role === "SUPER_ADMIN") setThemeName("super_admin");
    else if (user) setThemeName(getSavedTheme());
    else setThemeName("light");
  }, [user, setThemeName]);

  const setAuth = (userData: LoginResponse | null) => {
    if (userData) {
      localStorage.setItem("jwtToken", userData.jwtToken);
      localStorage.setItem("authorized_role", userData.role);
      localStorage.setItem("authorized_username", userData.username);
      localStorage.setItem("authorized_admin_info", JSON.stringify(userData.adminResponse));

      if (userData.role === "ADMIN" && userData.adminResponse?.universityId) {
        localStorage.setItem("authorized_university_id", String(userData.adminResponse.universityId));
      }

      setUser(userData);

      if (userData.role === "SUPER_ADMIN") {
        setThemeName("super_admin");
      } else if (userData.role === "ADMIN" && userData.adminResponse?.universityId) {
        getTheme(Number(userData.adminResponse.universityId))
          .then((customization: CustomizationResponse) => {
            console.log("[AuthContext] Loaded theme from API:", customization.themeName);
            setThemeName(
              isTheme(customization.themeName) ? customization.themeName : "custom_admin"
            );
          })
          .catch(err => {
            console.warn("[AuthContext] No theme found, falling back to saved/local:", err);
            setThemeName(getSavedTheme());
          });
      } else {
        setThemeName(getSavedTheme());
      }
    } else {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("authorized_role");
      localStorage.removeItem("authorized_username");
      localStorage.removeItem("authorized_admin_info");
      localStorage.removeItem("authorized_university_id");
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("authorized_role");
    localStorage.removeItem("authorized_username");
    localStorage.removeItem("authorized_admin_info");
    localStorage.removeItem("authorized_university_id"); 
    setUser(null);
    setThemeName("light");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

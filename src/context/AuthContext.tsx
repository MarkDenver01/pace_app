import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginResponse } from "../libs/models/Login";
import { useThemeContext, type Theme } from "./ThemeContext";

interface AuthContextType {
  user: LoginResponse | null;
  isAuthenticated: boolean;
  logout: () => void;
  setAuth: (user: LoginResponse) => void;
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

    if (!token || !role || !username || !adminInfo) return null;

    let parsedAdmin = {} as any;
    try {
      parsedAdmin = JSON.parse(adminInfo);
    } catch {
      parsedAdmin = { accountStatus: "UNKNOWN" };
    }

    return { jwtToken: token, role, username, adminResponse: parsedAdmin };
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

  const setAuth = (userData: LoginResponse) => {
    localStorage.setItem("jwtToken", userData.jwtToken);
    localStorage.setItem("authorized_role", userData.role);
    localStorage.setItem("authorized_username", userData.username);
    localStorage.setItem("authorized_admin_info", JSON.stringify(userData.adminResponse));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("authorized_role");
    localStorage.removeItem("authorized_username");
    localStorage.removeItem("authorized_admin_info");
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

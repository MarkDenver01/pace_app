import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type LoginResponse } from "../libs/models/response/LoginResponse";

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginResponse | null>(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("authorized_role");
    const username = localStorage.getItem("authorized_username");
    return token && role && username ? { jwtToken: token, role, username } : null;
  });

  const setAuth = (userData: LoginResponse) => {
    localStorage.setItem("jwtToken", userData.jwtToken);
    localStorage.setItem("authorized_role", userData.role);
    localStorage.setItem("authorized_username", userData.username);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("authorized_role");
    localStorage.removeItem("authorized_username");
    setUser(null);
    navigate("/login");
  };

    useEffect(() => {
    // Optional: could validate token expiration here
  }, []);

    return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

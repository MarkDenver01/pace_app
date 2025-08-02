import React, { createContext, useContext, useEffect, useState } from "react";
import { getToken, getUserRole } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token: string | null;
  role: string;
  isAuthenticated: boolean;
  logout: () => void;
  setAuth: (token: string, role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  role: "",
  isAuthenticated: false,
  logout: () => {},
  setAuth: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getToken());
  const [role, setRole] = useState<string>(getUserRole());

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('authorized_role');
    localStorage.removeItem('authorized_username');
    setToken(null);
    setRole("");
    navigate("/login");
  };

  const setAuth = (newToken: string, newRole: string) => {
    localStorage.setItem("jwtToken", newToken);
    localStorage.setItem("authorized_role", newRole);
    setToken(newToken);
    setRole(newRole);
  };

  useEffect(() => {
    const storedToken = getToken();
    const storedRole = getUserRole();

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: !!token,
        logout,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

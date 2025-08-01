

import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "@/api/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/api/auth/login", {
        email,
        password,
      });

      const userData = res.data.user;
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", res.data.token);
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
      });

      const userData = res.data.user;
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", res.data.token);
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Try again.");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);

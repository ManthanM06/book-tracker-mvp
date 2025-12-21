import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <--- New Loading State

  useEffect(() => {
    // Check local storage on initial load
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false); // <--- Done checking, stop loading
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await axios.post("/api/users", {
        username,
        email,
        password,
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

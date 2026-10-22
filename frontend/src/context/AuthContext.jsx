import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/API";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("smartnotes_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // ignore
      }
    }
    const legacyId = localStorage.getItem("userId");
    return legacyId ? { id: legacyId, name: "Student", email: "student@smartnotes.app" } : null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("smartnotes_user");
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem("token", receivedToken);
      localStorage.setItem("userId", receivedUser.id);
      localStorage.setItem("smartnotes_user", JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", { name, email, password });
      return { success: true, user: res.data.user };
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Signup failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("smartnotes_user");
  };

  const updateUserProfile = (updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("smartnotes_user", JSON.stringify(updated));
      return updated;
    });
  };

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


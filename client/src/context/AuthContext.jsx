import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import API, { extractApiErrorMessage } from "../services/api.js";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await API.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    setUser(data.user);
    return data;
  };

  const login = async (payload) => {
    const { data } = await API.post("/auth/login", payload);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await API.post("/auth/logout");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      fetchCurrentUser,
      register,
      login,
      logout,
      getErrorMessage: extractApiErrorMessage,
    }),
    [user, loading, fetchCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
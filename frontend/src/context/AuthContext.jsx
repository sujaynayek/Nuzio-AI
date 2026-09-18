import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import Login from "../pages/Login";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await api.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem("nuzio_user", JSON.stringify(response.user));
        } else {
          setUser(null);
          localStorage.removeItem("nuzio_user");
        }
      } catch (error) {
        setUser(null);
        localStorage.removeItem("nuzio_user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("nuzio_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || "Login failed" };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Check your credentials.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const data = await api.register(userData);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("nuzio_user", JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || "Registration failed" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.warn(
        "Logout request failed, continuing client-side signout.",
        error,
      );
    }

    setUser(null);
    localStorage.removeItem("nuzio_user");
    return true;
  };

  const updatePreferences = async (newPrefs) => {
    try {
      if (user) {
        const updated = {
          ...user,
          preferences: { ...(user.preferences || {}), ...newPrefs },
        };
        setUser(updated);
        localStorage.setItem("nuzio_user", JSON.stringify(updated));
        await api.updatePreferences(newPrefs);
      }
    } catch (e) {
      console.error("Failed to update preferences:", e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

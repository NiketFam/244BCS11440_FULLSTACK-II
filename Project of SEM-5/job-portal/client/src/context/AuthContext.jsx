import { createContext, useContext, useState, useEffect } from "react";
import api, { errorMessage } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (userData) => {
    const updated = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  };

  // Keep user profile up-to-date with backend on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then(({ data }) => {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        })
        .catch(() => {
          // Token expired or invalid
          // logout();
        });
    }
  }, []);

  const toggleBookmark = async (jobId) => {
    if (!user) return { success: false, message: "Please log in first" };
    try {
      const { data } = await api.post(`/jobs/${jobId}/save`);
      const updatedUser = { ...user, savedJobs: data.savedJobs };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, saved: data.saved, message: data.message };
    } catch (err) {
      return { success: false, message: errorMessage(err) };
    }
  };

  const isJobSaved = (jobId) => {
    if (!user || !user.savedJobs) return false;
    return user.savedJobs.some((id) => (typeof id === "object" ? id._id === jobId : id === jobId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        toggleBookmark,
        isJobSaved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

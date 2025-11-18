import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(() => {
    const u = safeParse(localStorage.getItem("user"));
    if (!u) return null;
    return { ...u, role: u.role?.toLowerCase() };
  });

  const login = (token, userData) => {
    const normalizedUser = {
      ...userData,
      role: userData.role?.toLowerCase(),
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = safeParse(localStorage.getItem("user"));
    if (storedUser) {
      storedUser.role = storedUser.role?.toLowerCase();
      setUser(storedUser);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import { MockService } from "../services/mockService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize DB
    MockService.init();
    
    // Check for existing session
    const data = MockService.getAll();
    if (data.auth) {
      setUser(data.auth);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const result = MockService.login(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const register = (userData) => {
    const result = MockService.register(userData);
    if (result.success) {
       setUser(result.user);
    }
    return result;
  };

  const logout = () => {
    MockService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a default value or warning to prevent crashing during development/hot-reload
    // if the provider is temporarily unavailable or mistakenly nested.
    console.warn('useAuth used outside AuthProvider');
    return { user: null, loading: true, login: () => {}, register: () => {}, logout: () => {} };
  }
  return context;
};

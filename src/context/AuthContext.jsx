import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'nutique_admin_auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted auth on mount (sessionStorage - cleared when tab closes)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setAuth(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = useCallback((authData) => {
    setAuth(authData);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    auth,
    isAuthenticated: !!auth?.token,
    token: auth?.token,
    fullName: auth?.fullName,
    username: auth?.username,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

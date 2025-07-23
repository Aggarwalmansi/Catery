'use client';

import { createContext, useContext,useEffect, useState, ReactNode, use } from 'react';

type AuthContextType = {
  user: any;
  login: (user: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
   
    const storedUser = localStorage.getItem('occasionUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
}, []);
const login = (userData:any) => {
    setUser(userData);
    localStorage.setItem('occasionUser', JSON.stringify(userData));
  }
const logout = () => {
    setUser(null);
    localStorage.removeItem('occasionUser');
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};

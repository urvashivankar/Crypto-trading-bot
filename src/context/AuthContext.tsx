
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type User as ApiUser } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and get user info
      authService.getCurrentUser()
        .then((apiUser) => {
          setUser({
            id: apiUser.id.toString(),
            email: apiUser.email,
            name: apiUser.full_name || apiUser.username,
          });
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('token');
        });
    }
  }, []);

  // Real login function with API call
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.access_token);

      // Get user info
      const apiUser = await authService.getCurrentUser();
      setUser({
        id: apiUser.id.toString(),
        email: apiUser.email,
        name: apiUser.full_name || apiUser.username,
      });

      toast({
        title: "Login successful!",
        description: `Welcome back, ${apiUser.username}!`,
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Real signup function with API call
  const signup = async (email: string, password: string, name: string) => {
    try {
      const username = email.split('@')[0]; // Generate username from email
      await authService.register({ email, username, password, full_name: name });

      toast({
        title: "Registration successful!",
        description: "Please login with your credentials.",
      });

      // Auto-login after signup
      await login(email, password);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

// Default context value
const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  resetPassword: async () => false,
  updateProfile: async () => false,
};

// Create context
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Mock user data (in a real app, this would come from a database)
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@connectai.com',
    password: 'password123', // In a real app, never store plain-text passwords
    name: 'Admin User',
    role: 'admin' as const,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User',
    role: 'user' as const,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  },
];

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing auth session on component mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('connectai_user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse stored user data', error);
          localStorage.removeItem('connectai_user');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user
      const foundUser = MOCK_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (!foundUser) {
        toast.error('Invalid email or password');
        return false;
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Save to state and local storage
      setUser(userWithoutPassword);
      localStorage.setItem('connectai_user', JSON.stringify(userWithoutPassword));
      
      toast.success('Logged in successfully');
      return true;
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (MOCK_USERS.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toast.error('Account with this email already exists');
        return false;
      }
      
      // Create new user (in a real app, this would be saved to a database)
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        name,
        role: 'user' as const,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      
      // Save to state and local storage
      setUser(newUser);
      localStorage.setItem('connectai_user', JSON.stringify(newUser));
      
      toast.success('Account created successfully');
      return true;
    } catch (error) {
      console.error('Signup failed', error);
      toast.error('Signup failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('connectai_user');
    toast.success('Logged out successfully');
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userExists = MOCK_USERS.some(
        u => u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (!userExists) {
        toast.error('No account found with this email');
        return false;
      }
      
      toast.success('Password reset instructions sent to your email');
      return true;
    } catch (error) {
      console.error('Password reset failed', error);
      toast.error('Password reset failed. Please try again.');
      return false;
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        toast.error('You must be logged in to update your profile');
        return false;
      }
      
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('connectai_user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update failed', error);
      toast.error('Profile update failed. Please try again.');
      return false;
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
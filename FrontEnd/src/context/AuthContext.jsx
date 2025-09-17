// ============================================================================
// 1. AuthContext.jsx - Global Authentication State Management
// ============================================================================
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create authentication context - this will store and share auth state across the app
const AuthContext = createContext();

/**
 * Custom hook to use authentication context
 * Ensures components using auth are wrapped in AuthProvider
 * @returns {Object} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the entire app to provide auth state to all components
 * @param {Object} children - Child components to wrap
 */
export const AuthProvider = ({ children }) => {
  // Current user data (null if not authenticated)
  const [user, setUser] = useState(null);
  // Loading state to show spinner during auth checks
  const [loading, setLoading] = useState(true);

  /**
   * Check for existing authentication data on app startup
   * This allows users to stay logged in after page refresh
   */
  useEffect(() => {
    // Retrieve stored tokens and user data from localStorage
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    // If both exist, try to restore the user session
    if (token && userData) {
      try {
        // Parse the stored user data JSON
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Restore user to state
      } catch (error) {
        // If parsing fails, clear corrupted data
        console.error('Error parsing user data:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
      }
    }
    // Set loading to false once auth check is complete
    setLoading(false);
  }, []);

  /**
   * Login function - stores tokens and user data
   * Called after successful authentication from SignIn component
   * @param {Object} tokens - JWT access and refresh tokens
   * @param {Object} userData - User information (id, email, role, etc.)
   */
  const login = (tokens, userData) => {
    // Store tokens in localStorage for persistence
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    // Update user state to trigger re-renders across app
    setUser(userData);
  };

  /**
   * Logout function - clears all authentication data
   * Called when user manually logs out or session expires
   */
  const logout = () => {
    // Remove all auth data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Reset user state to null
    setUser(null);
  };

  // Context value object provided to all child components
  const value = {
    user,                    // Current user data
    login,                   // Login function
    logout,                  // Logout function
    loading,                 // Loading state
    isAuthenticated: !!user, // Boolean: true if user exists
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
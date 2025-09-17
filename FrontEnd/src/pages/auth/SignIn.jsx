// ============================================================================
// 3. SignIn.jsx - Login Form Component
// ============================================================================
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signIn } from '../../services/SignInAPI';
import GradientButton from '../../components/GradientButton';

const SignIn = () => {
  // Form data state - stores email and password inputs
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Error message state - displays login errors to user
  const [error, setError] = useState('');
  
  // Loading state - shows spinner during API call
  const [loading, setLoading] = useState(false);
  
  // Get authentication functions from context
  const { login } = useAuth();
  
  // React Router hooks for navigation
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handle form input changes
   * Updates formData state and clears any existing errors
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error message when user starts typing
    if (error) setError('');
  };

  /**
   * Determine where to redirect user after successful login
   * Based on their user role (admin, doctor, staff, patient)
   * @param {string} userType - User's role from backend
   * @returns {string} Redirect path for the user role
   */
  const getRoleBasedRedirectPath = (userType) => {
    switch (userType) {
      case 'admin':
        return '/admin/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'staff':
        return '/staff/home';
      case 'patient':
        return '/patient/home';
      default:
        return '/patient/home'; // Default fallback for unknown roles
    }
  };

  /**
   * Handle form submission
   * Authenticates user and redirects to appropriate dashboard
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);   // Show loading spinner
    setError('');       // Clear any previous errors

    try {
      // Call API to authenticate user
      const result = await signIn(formData);
      
      // Update global auth state with user data and tokens
      login(result.tokens, result.user);

      // Determine redirect destination
      // Priority: 1. Where they were trying to go, 2. Role-based dashboard
      const from = location.state?.from?.pathname;
      const redirectPath = from || getRoleBasedRedirectPath(result.user.user_type);
      
      // Navigate to appropriate page and replace current history entry
      navigate(redirectPath, { replace: true });
      
    } catch (err) {
      // Display error message to user
      setError(err.message);
    } finally {
      // Always hide loading spinner
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        {/* Header Section */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back to BukCare
          </p>
        </div>
        
        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          {/* Form Fields */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <GradientButton
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </GradientButton>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
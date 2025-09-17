// ============================================================================
// 2. SignInAPI.js - API Communication Layer
// ============================================================================

// Base URL for all API calls - matches Django backend configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Sign In API Function
 * Handles user authentication with the Django backend
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.email - User's email address
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Authentication response with tokens and user data
 */
export const signIn = async (credentials) => {
  try {
    // Make POST request to Django login endpoint
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Validate response content type - Django should return JSON
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Server returned non-JSON response:', text);
      throw new Error('Server error: Expected JSON response but received HTML or plain text');
    }

    // Parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid response from server');
    }

    // Check if request was successful (status 200-299)
    if (!response.ok) {
      // Use server error message if available, otherwise generic message
      throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Validate that response contains required JWT tokens
    if (!data.access || !data.refresh) {
      throw new Error('Invalid login response: Missing authentication tokens');
    }

    // Decode JWT access token to extract user information
    let tokenPayload;
    try {
      // JWT tokens have 3 parts separated by dots: header.payload.signature
      // We decode the middle part (payload) which contains user data
      tokenPayload = JSON.parse(atob(data.access.split('.')[1]));
    } catch (jwtError) {
      console.error('Failed to decode JWT:', jwtError);
      throw new Error('Invalid authentication token received');
    }
    
    // Try to get additional user details from backend user endpoint
    let userData = null;
    try {
      const userResponse = await fetch(`${API_BASE_URL}/auth/user/`, {
        headers: {
          // Include JWT token in Authorization header
          'Authorization': `Bearer ${data.access}`,
        },
      });

      // If user endpoint succeeds, use that data
      if (userResponse.ok) {
        const userContentType = userResponse.headers.get('Content-Type');
        if (userContentType && userContentType.includes('application/json')) {
          userData = await userResponse.json();
        }
      }
    } catch (userError) {
      console.warn('Failed to fetch user details:', userError);
      // Continue with fallback data from JWT token
    }

    // If user endpoint failed, use data from JWT token as fallback
    if (!userData) {
      userData = {
        id: tokenPayload.user_id,
        email: tokenPayload.email,
        user_type: tokenPayload.user_type || 'patient', // Default to patient role
        first_name: tokenPayload.first_name || '',
        last_name: tokenPayload.last_name || '',
      };
    }

    // Return both tokens and user data for AuthContext
    return {
      tokens: data,      // JWT access and refresh tokens
      user: userData,    // User information for state management
    };
  } catch (error) {
    // Handle network errors specifically
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    // Re-throw other errors with original message
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
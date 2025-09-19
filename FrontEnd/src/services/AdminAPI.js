// ============================================================================
// AdminAPI.js - API Communication Layer for Admin Management Endpoints
// ============================================================================

// Base URL for all API calls - matches Django backend configuration
const API_BASE_URL = 'http://localhost:8000/api/v1/admin';

/**
 * Helper function to handle fetch requests with JWT Authorization
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @param {string} token - Optional JWT access token for authorization
 * @returns {Promise<Object>} Parsed JSON response
 */
const apiRequest = async (endpoint, options = {}, token = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Validate response content type
    const contentType = response.headers.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Server returned non-JSON response:', text);
      throw new Error('Server error: Expected JSON response but received HTML or plain text');
    }

    // Parse JSON safely
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('Invalid response from server');
    }

    // Handle error status codes
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    throw new Error(error.message || 'An unexpected error occurred');
  }
};

// ============================================================================
// Dashboard Endpoints
// ============================================================================

/**
 * Get dashboard statistics
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Dashboard statistics data
 */
export const getDashboardStats = (token) => {
  return apiRequest('/dashboard/stats/', { method: 'GET' }, token);
};

/**
 * Get recent activities for dashboard
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Recent activity data
 */
export const getRecentActivities = (token) => {
  return apiRequest('/dashboard/activities/', { method: 'GET' }, token);
};

// ============================================================================
// User Management Endpoints
// ============================================================================

/**
 * Search for users
 * @param {string} query - Search term
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} List of matching users
 */
export const searchUsers = (query, token) => {
  return apiRequest(`/users/search/?query=${encodeURIComponent(query)}`, { method: 'GET' }, token);
};

/**
 * Invite a new user
 * @param {Object} data - User invitation data
 * @param {string} data.email - Email of the user
 * @param {string} data.role - Role assigned (doctor, staff, etc.)
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Invitation response
 */
export const inviteUser = (data, token) => {
  return apiRequest('/users/invite/', {
    method: 'POST',
    body: JSON.stringify(data),
  }, token);
};

// ============================================================================
// Invitation Management Endpoints
// ============================================================================

/**
 * Get all pending invitations
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} List of pending invitations
 */
export const getPendingInvitations = (token) => {
  return apiRequest('/invitations/pending/', { method: 'GET' }, token);
};

/**
 * Resend an invitation
 * @param {string} invitationId - UUID of the invitation
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Resend response
 */
export const resendInvitation = (invitationId, token) => {
  return apiRequest(`/invitations/${invitationId}/resend/`, { method: 'POST' }, token);
};

/**
 * Cancel an invitation
 * @param {string} invitationId - UUID of the invitation
 * @param {string} token - JWT access token
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelInvitation = (invitationId, token) => {
  return apiRequest(`/invitations/${invitationId}/cancel/`, { method: 'DELETE' }, token);
};

export default {
  getDashboardStats,
  getRecentActivities,
  searchUsers,
  inviteUser,
  getPendingInvitations,
  resendInvitation,
  cancelInvitation,
};

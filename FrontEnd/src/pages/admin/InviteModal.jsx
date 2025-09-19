// pages/admin/InviteModal.jsx
import React, { useState } from 'react';
import { Mail, XCircle, AlertCircle } from 'lucide-react';
import { validateEmail } from '../../utils/validation';
import adminAPI from '../../services/AdminAPI';

const InviteModal = ({ 
  showInviteModal, 
  setShowInviteModal, 
  onInvitationSent 
}) => {
  const [inviteForm, setInviteForm] = useState({ email: "", role: "doctor" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!inviteForm.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(inviteForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!inviteForm.role) {
      newErrors.role = 'Please select a role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await adminAPI.inviteUser(inviteForm.email, inviteForm.role);
      setInviteForm({ email: "", role: "doctor" });
      setErrors({});
      setShowInviteModal(false);
      if (onInvitationSent) {
        onInvitationSent({
          type: 'success',
          message: `Invitation sent successfully to ${inviteForm.email}`,
          data: result
        });
      }
    } catch (error) {
      console.error('Invitation failed:', error);
      if (error.message.includes('already exists')) {
        setErrors({ email: 'A user with this email already exists' });
      } else if (error.message.includes('pending invitation')) {
        setErrors({ email: 'A pending invitation already exists for this email' });
      } else {
        if (onInvitationSent) {
          onInvitationSent({
            type: 'error',
            message: error.message || 'Failed to send invitation. Please try again.'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setInviteForm({ email: "", role: "doctor" });
    setErrors({});
    setShowInviteModal(false);
  };

  if (!showInviteModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* modal box only (no dark background) */}
      <div className="relative bg-white border border-gray-300 rounded-2xl max-w-md w-full shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Invite New User</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                placeholder="Enter email address"
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  errors.email 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  errors.role 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select a role</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.role}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">How it works</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    An invitation email will be sent to the recipient. They can click the link to complete their account setup.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex space-x-3">
            <button 
              type="button"
              onClick={handleClose} 
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;

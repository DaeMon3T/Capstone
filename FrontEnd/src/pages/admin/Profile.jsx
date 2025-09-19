// src/pages/admin/Profile.jsx
import React from 'react';

const AdminProfile = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Admin Profile</h1>
      <p>Profile page content will go here.</p>
    </div>
  );
};

export default AdminProfile;

// // pages/admin/Profile.jsx
// import React, { useState, useEffect } from 'react';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar,
//   Shield,
//   Edit3,
//   Save,
//   X,
//   Camera,
//   Lock,
//   Settings,
//   Bell,
//   Globe
// } from 'lucide-react';
// import Notification from '../../components/Notification';
// import { validateEmail, validatePhone, validateName } from '../../utils/validation';

// const AdminProfile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [notification, setNotification] = useState(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);

//   // Profile data state
//   const [profile, setProfile] = useState({
//     first_name: 'Admin',
//     last_name: 'User',
//     email: 'admin@bukcare.com',
//     phone: '+63 912 345 6789',
//     address: 'Cagayan de Oro City, Philippines',
//     bio: 'System Administrator at BukCare Healthcare Platform',
//     joined_date: '2024-01-15',
//     avatar: null,
//     role: 'admin',
//     permissions: ['full_access', 'user_management', 'system_settings'],
//     last_login: '2024-03-15T10:30:00Z'
//   });

//   // Form state for editing
//   const [editForm, setEditForm] = useState({ ...profile });
//   const [errors, setErrors] = useState({});

//   // Settings state
//   const [settings, setSettings] = useState({
//     email_notifications: true,
//     push_notifications: true,
//     security_alerts: true,
//     marketing_emails: false,
//     two_factor_enabled: false,
//     theme: 'light'
//   });

//   useEffect(() => {
//     // Load profile data
//     loadProfileData();
//   }, []);

//   const loadProfileData = async () => {
//     try {
//       // API call would go here
//       // const data = await adminAPI.getProfile();
//       // setProfile(data);
//     } catch (error) {
//       console.error('Failed to load profile:', error);
//       showNotification('error', 'Failed to load profile data');
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!validateName(editForm.first_name)) {
//       newErrors.first_name = 'Please enter a valid first name';
//     }

//     if (!validateName(editForm.last_name)) {
//       newErrors.last_name = 'Please enter a valid last name';
//     }

//     if (!validateEmail(editForm.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (editForm.phone && !validatePhone(editForm.phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // API call would go here
//       // await adminAPI.updateProfile(editForm);
      
//       setProfile({ ...editForm });
//       setIsEditing(false);
//       showNotification('success', 'Profile updated successfully');
//     } catch (error) {
//       console.error('Failed to update profile:', error);
//       showNotification('error', 'Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     setEditForm({ ...profile });
//     setErrors({});
//     setIsEditing(false);
//   };

//   const handleInputChange = (field, value) => {
//     setEditForm({ ...editForm, [field]: value });
//     if (errors[field]) {
//       setErrors({ ...errors, [field]: '' });
//     }
//   };

//   const handleSettingChange = (setting, value) => {
//     setSettings({ ...settings, [setting]: value });
//     // Auto-save settings
//     saveSettings({ ...settings, [setting]: value });
//   };

//   const saveSettings = async (newSettings) => {
//     try {
//       // API call would go here
//       // await adminAPI.updateSettings(newSettings);
//       showNotification('
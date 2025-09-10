// utils/validation.js

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength (minimum 6 characters)
 * @param {string} password 
 * @returns {boolean}
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate password confirmation
 * @param {string} password 
 * @param {string} confirmPassword 
 * @returns {boolean}
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Validate phone number (Philippine format 09XXXXXXXXX)
 * @param {string} phone 
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  return /^09\d{9}$/.test(phone);
};

/**
 * Validate required name fields
 * @param {string} name 
 * @returns {boolean}
 */
export const validateName = (name) => {
  return name && name.trim().length > 0;
};

/**
 * Validate date of birth (must be in the past and minimum 13 years old)
 * @param {string} dateOfBirth - YYYY-MM-DD format
 * @returns {boolean}
 */
export const validateDOB = (dateOfBirth) => {
  if (!dateOfBirth) return false;
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  // Check if date is in the past
  if (birthDate >= today) return false;
  
  // Check minimum age (13 years old)
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13;
  }
  return age >= 13;
};

/**
 * Validate OTP format (6 digits)
 * @param {string} otp 
 * @returns {boolean}
 */
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

/**
 * Validate required fields for signup
 * @param {Object} userData - User data object
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateSignupData = (userData) => {
  const errors = [];
  
  if (!validateEmail(userData.email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (!validateName(userData.first_name)) {
    errors.push('First name is required');
  }
  
  if (!validateName(userData.last_name)) {
    errors.push('Last name is required');
  }
  
  if (!validatePhone(userData.contact_number)) {
    errors.push('Please enter a valid Philippine phone number (09XXXXXXXXX)');
  }
  
  if (!validatePassword(userData.password)) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!userData.sex || !['M', 'F', 'male', 'female'].includes(userData.sex.toLowerCase())) {
    errors.push('Please select a valid gender');
  }
  
  if (!validateDOB(userData.date_of_birth)) {
    errors.push('Please enter a valid date of birth (must be at least 13 years old)');
  }
  
  if (!validateName(userData.street)) {
    errors.push('Street address is required');
  }
  
  if (!validateName(userData.barangay)) {
    errors.push('Barangay is required');
  }
  
  if (!validateName(userData.city_municipality)) {
    errors.push('City/Municipality is required');
  }
  
  if (!validateName(userData.province)) {
    errors.push('Province is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Export all validators as a single object for backward compatibility
export const validators = {
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  phone: validatePhone,
  name: validateName,
  dob: validateDOB,
  otp: validateOTP,
  signupData: validateSignupData
};

// Default export
export default {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateName,
  validateDOB,
  validateOTP,
  validateSignupData,
  validators
};
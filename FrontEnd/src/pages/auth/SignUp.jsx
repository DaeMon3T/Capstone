import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, KeyRound, User, Phone, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import { validateEmail, validateOTP, validateConfirmPassword } from "@/utils/validation";
import { sendOTP, verifyOTP, completeSignup, resendOTP } from "@/services/SignUpAPI";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "", phone: "", password: "", confirmPassword: "",
    sex: "", dateOfBirth: "", street: "", barangay: "", cityMunicipality: "", province: "", zipCode: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateOTP(otp)) {
      setError("OTP must be 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(email, otp);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      setError("Passwords do not match");
      return;
    }
    
    const userData = {
      email, first_name: formData.firstName, middle_name: formData.middleName, last_name: formData.lastName,
      contact_number: formData.phone, password: formData.password, sex: formData.sex, date_of_birth: formData.dateOfBirth,
      street: formData.street, barangay: formData.barangay, city_municipality: formData.cityMunicipality,
      province: formData.province, zip_code: formData.zipCode
    };
    
    setIsLoading(true);
    try {
      await completeSignup(userData);
      alert("Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setIsLoading(true);
    try {
      await resendOTP(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sign Up for BukCare</h2>

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSubmitEmail} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">Enter your email to get started</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email Address *</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>
            <GradientButton type="submit" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
            </GradientButton>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleSubmitOTP} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">We sent a verification code to</p>
              <p className="font-medium text-gray-800">{email}</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Verification Code *</label>
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-center text-lg tracking-widest"
                  disabled={isLoading}
                />
              </div>
            </div>
            <GradientButton type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </GradientButton>
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-blue-600 hover:underline text-sm"
                disabled={isLoading}
              >
                Didn't receive code? Resend
              </button>
              <br />
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(""); setError(""); }}
                className="text-gray-600 hover:underline text-sm"
                disabled={isLoading}
              >
                Change email address
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Complete Signup */}
        {step === 3 && (
          <form onSubmit={handleSubmitSignup} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-gray-600">Complete your patient profile</p>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email Address ✓</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 bg-green-50 text-gray-700"
                />
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">First Name *</label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateFormField('firstName', e.target.value)}
                    required
                    placeholder="First name"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => updateFormField('middleName', e.target.value)}
                  placeholder="Middle name (optional)"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => updateFormField('lastName', e.target.value)}
                  required
                  placeholder="Last name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Gender *</label>
                <select
                  value={formData.sex}
                  onChange={(e) => updateFormField('sex', e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={isLoading}
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormField('dateOfBirth', e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute top-3 left-3 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormField('phone', e.target.value)}
                  required
                  placeholder="09XXXXXXXXX"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <MapPin className="mr-2" size={20} />
                Address Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Street Address *</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => updateFormField('street', e.target.value)}
                    required
                    placeholder="House No., Street Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Barangay *</label>
                    <input
                      type="text"
                      value={formData.barangay}
                      onChange={(e) => updateFormField('barangay', e.target.value)}
                      required
                      placeholder="Barangay"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">City/Municipality *</label>
                    <input
                      type="text"
                      value={formData.cityMunicipality}
                      onChange={(e) => updateFormField('cityMunicipality', e.target.value)}
                      required
                      placeholder="City/Municipality"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Province *</label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => updateFormField('province', e.target.value)}
                      required
                      placeholder="Province"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => updateFormField('zipCode', e.target.value)}
                      placeholder="ZIP Code (optional)"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Lock className="mr-2" size={20} />
                Security Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateFormField('password', e.target.value)}
                      required
                      placeholder="Create password (min. 6 characters)"
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormField('confirmPassword', e.target.value)}
                      required
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GradientButton type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Patient Account'}
            </GradientButton>
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setStep(2); setError(""); }}
                className="text-gray-600 hover:underline text-sm"
                disabled={isLoading}
              >
                ← Back to verification
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm mt-6">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, KeyRound, User, Phone, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import GradientButton from "@/components/GradientButton";
import { validateEmail, validatePassword, validateConfirmPassword, validatePhone, validateName } from "@/utils/validation";

export default function SignUp() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = complete signup
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Step 3 form fields - Updated with all required fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState(""); // Optional middle name
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Additional patient fields
  const [sex, setSex] = useState(""); // M/F
  const [dateOfBirth, setDateOfBirth] = useState("");
  
  // Address fields
  const [street, setStreet] = useState("");
  const [barangay, setBarangay] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Send email for OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/send-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.error && data.error.includes("already exists")) {
          setError("Email already exists. Please sign in.");
        } else {
          setStep(2); // proceed to OTP step
        }
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/auth/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) setStep(3);
      else setError(data.error || "Invalid OTP");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete signup with all patient data
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate required fields
    if (!validateName(firstName)) { setError("First name is required"); setIsLoading(false); return; }
    if (!validateName(lastName)) { setError("Last name is required"); setIsLoading(false); return; }
    if (!validatePhone(phone)) { setError("Phone number must be in 09XXXXXXXXX format"); setIsLoading(false); return; }
    if (!validatePassword(password)) { setError("Password must be at least 6 characters"); setIsLoading(false); return; }
    if (!validateConfirmPassword(password, confirmPassword)) { setError("Passwords do not match"); setIsLoading(false); return; }
    
    // Additional validations
    if (!sex) { setError("Gender is required"); setIsLoading(false); return; }
    if (!dateOfBirth) { setError("Date of birth is required"); setIsLoading(false); return; }
    if (!street || !barangay || !cityMunicipality || !province) { 
      setError("Complete address is required"); setIsLoading(false); return; 
    }

    // Validate age (must be at least 18 or adjust as needed)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) { setError("You must be at least 13 years old"); setIsLoading(false); return; }

    try {
      console.log("Attempting to create patient account...");
      
      const response = await fetch("http://localhost:8000/api/auth/complete-signup/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email,
          username: email.split('@')[0], // Use email prefix as username
          first_name: firstName,
          middle_name: middleName || null, // Optional middle name
          last_name: lastName,
          contact_number: phone,
          password,
          sex,
          date_of_birth: dateOfBirth,
          
          street,
          barangay,
          city_municipality: cityMunicipality,
          province,
          zip_code: zipCode || null
          
        }),
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        console.log("Patient registration successful:", data);
        // Show success message
        alert("Account created successfully! Please sign in.");
        navigate("/signin");
      } else {
        if (response.status === 400) {
          setError(data.error || "Invalid data provided. Please check your inputs.");
        } else if (response.status === 409) {
          setError("Account with this email or phone already exists.");
        } else if (response.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError(data.error || `Error ${response.status}: Registration failed`);
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError("Cannot connect to server. Please check your internet connection and try again.");
      } else if (err.name === 'AbortError') {
        setError("Request timed out. Please try again.");
      } else {
        setError(`Network error: ${err.message}. Please try again.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation between steps
  const handleBackToEmail = () => { setStep(1); setOtp(""); setError(""); };
  const handleBackToOTP = () => { setStep(2); setError(""); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Sign Up for BukCare</h2>

        {/* Progress indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{s}</div>
                {s < 3 && <div className={`w-8 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div className="text-center mb-4">
              <p className="text-gray-600">Enter your email to get started</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
              </div>
            </div>
            <GradientButton type="submit" disabled={isLoading}>{isLoading ? 'Sending OTP...' : 'Send Verification Code'}</GradientButton>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOTPSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div className="text-center mb-4">
              <p className="text-gray-600">We sent a verification code to</p>
              <p className="font-medium text-gray-800">{email}</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Verification Code</label>
              <div className="relative">
                <KeyRound className="absolute top-3 left-3 text-gray-400" size={20} />
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter 6-digit code" maxLength={6} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-center text-lg tracking-widest" disabled={isLoading} />
              </div>
            </div>
            <GradientButton type="submit" disabled={isLoading}>{isLoading ? 'Verifying...' : 'Verify Code'}</GradientButton>
            <div className="text-center space-y-2">
              <button type="button" onClick={() => handleEmailSubmit({ preventDefault: () => {} })} className="text-blue-600 hover:underline text-sm" disabled={isLoading}>Didn't receive code? Resend</button>
              <br />
              <button type="button" onClick={handleBackToEmail} className="text-gray-600 hover:underline text-sm" disabled={isLoading}>Change email address</button>
            </div>
          </form>
        )}

        {/* Step 3: Complete Signup */}
        {step === 3 && (
          <form onSubmit={handleSignUpSubmit} className="space-y-6">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
            <div className="text-center mb-4">
              <p className="text-gray-600">Complete your patient profile</p>
            </div>

            {/* Verified email */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email Address ✓</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-green-400" size={20} />
                <input type="email" value={email} readOnly className="w-full pl-10 pr-4 py-2 rounded-lg border border-green-300 bg-green-50 text-gray-700" />
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">First Name *</label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First name" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Middle Name</label>
                <input type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} placeholder="Middle name (optional)" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Last Name *</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Last name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Gender *</label>
                <select value={sex} onChange={(e) => setSex(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading}>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Birth *</label>
                <div className="relative">
                  <Calendar className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute top-3 left-3 text-gray-400" size={20} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="09XXXXXXXXX" className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
              </div>
            </div>

            {/* Address Section */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <MapPin className="mr-2" size={20} />
                Address Information
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Street Address *</label>
                  <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="House No., Street Name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Barangay *</label>
                    <input type="text" value={barangay} onChange={(e) => setBarangay(e.target.value)} required placeholder="Barangay" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">City/Municipality *</label>
                    <input type="text" value={cityMunicipality} onChange={(e) => setCityMunicipality(e.target.value)} required placeholder="City/Municipality" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Province *</label>
                    <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} required placeholder="Province" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">ZIP Code</label>
                    <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="ZIP Code (optional)" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                <Lock className="mr-2" size={20} />
                Security Information
              </h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Password *</label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create password (min. 6 characters)" className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirm password" className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none" disabled={isLoading} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" disabled={isLoading}>
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <GradientButton type="submit" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Create Patient Account'}</GradientButton>

            <div className="text-center">
              <button type="button" onClick={handleBackToOTP} className="text-gray-600 hover:underline text-sm" disabled={isLoading}>← Back to verification</button>
            </div>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm mt-6">
          Already have an account? <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
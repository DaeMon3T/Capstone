import React, { useState } from "react";
import GradientButton from "../../components/GradientButton";
import { validateDoctorSignupData } from "../../utils/validation";

const DoctorSignUp = () => {
  const [formData, setFormData] = useState({
    fname: "",
    mname: "",
    lname: "",
    ext: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
    specialization: [],
    otherSpecialization: "",
  });

  const specializationOptions = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Psychiatry",
    "Neurology",
    "Orthopedics",
    "General Medicine",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecializationChange = (e) => {
    const { value, checked } = e.target;

    if (value === "Other") {
      if (checked) {
        setFormData({ ...formData, specialization: [...formData.specialization, value] });
      } else {
        setFormData({
          ...formData,
          specialization: formData.specialization.filter((s) => s !== value),
          otherSpecialization: "",
        });
      }
      return;
    }

    if (checked) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, value],
      });
    } else {
      setFormData({
        ...formData,
        specialization: formData.specialization.filter((s) => s !== value),
      });
    }
  };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validation = validateDoctorSignupData(formData);

        if (!validation.isValid) {
            alert(validation.errors.join("\n"));
            return;
        }

        console.log("Doctor SignUp Data:", formData);
        };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Doctor Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              value={formData.fname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              value={formData.lname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="mname"
              placeholder="Middle Name (Optional)"
              value={formData.mname}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="text"
              name="ext"
              placeholder="Extension (Optional)"
              value={formData.ext}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />

          {/* Phone & License Number */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              name="licenseNumber"
              placeholder="License Number"
              value={formData.licenseNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Specialization */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              Specialization <span className="text-gray-500 text-sm">(Select one or more)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {specializationOptions.map((spec) => (
                <label
                  key={spec}
                  className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border hover:border-blue-400 transition"
                >
                  <input
                    type="checkbox"
                    value={spec}
                    checked={formData.specialization.includes(spec)}
                    onChange={handleSpecializationChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{spec}</span>
                </label>
              ))}
            </div>

            {/* Other Specialization Input */}
            {formData.specialization.includes("Other") && (
              <input
                type="text"
                name="otherSpecialization"
                placeholder="Please specify your specialization"
                value={formData.otherSpecialization}
                onChange={handleChange}
                className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            )}
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Submit Button */}
          <GradientButton type="submit">Create Doctor Account</GradientButton>
        </form>
      </div>
    </div>
  );
};

export default DoctorSignUp;

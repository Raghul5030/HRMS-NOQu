import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InterviewForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    NAME: "",
    GENDER: "",
    DOB: "",
    EMAIL: "",
    PHONE_NUMBER: "",
    ADDRESS: "",
    EXPERIANCE: "",
    INTERVIEW_MODE: "",
    DOI: "",
    DESIGNATION: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.NAME.trim()) newErrors.NAME = "Name is required";
    if (!formData.GENDER) newErrors.GENDER = "Gender is required";
    if (!formData.DOB) newErrors.DOB = "Date of birth is required";
    if (!formData.EMAIL) newErrors.EMAIL = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.EMAIL)) newErrors.EMAIL = "Email is invalid";
    if (!formData.PHONE_NUMBER) newErrors.PHONE_NUMBER = "Phone number is required";
    if (!formData.ADDRESS.trim()) newErrors.ADDRESS = "Address is required";
    if (!formData.EXPERIANCE.trim()) newErrors.EXPERIANCE = "Experience is required";
    if (!formData.INTERVIEW_MODE) newErrors.INTERVIEW_MODE = "Interview mode is required";
    if (!formData.DOI) newErrors.DOI = "Date of interview is required";
    if (!formData.DESIGNATION.trim()) newErrors.DESIGNATION = "Designation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/addInterviewForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      navigate("/interview-success", {
        state: { data: formData, response: result },
      });
    } catch (error) {
      navigate("/interview-success", {
        state: { data: formData, error: error.message },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center py-8 px-4">
      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">

        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-[#F1B501] to-[#FFD166] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#28375E] to-[#1E40AF] bg-clip-text text-transparent mb-3">
            Interview Application
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Complete the form below to schedule your interview. We're excited to learn more about you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#F1B501] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#28375E]">Personal Information</h2>
            </div>

            {/* ROW 1 → Name + Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-error={!!errors.NAME}>
                <label className="block mb-3 font-semibold text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="NAME"
                    placeholder="Enter your full name"
                    value={formData.NAME}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.NAME ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                {errors.NAME && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.NAME}
                </p>}
              </div>

              <div data-error={!!errors.DESIGNATION}>
                <label className="block mb-3 font-semibold text-gray-700">
                  Designation *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="DESIGNATION"
                    placeholder="Eg: Frontend Developer"
                    value={formData.DESIGNATION}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.DESIGNATION ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {errors.DESIGNATION && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.DESIGNATION}
                </p>}
              </div>
            </div>

            {/* ROW 2 → Gender + DOB + Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {/* Gender */}
              <div data-error={!!errors.GENDER}>
                <label className="block mb-3 font-semibold text-gray-700">Gender *</label>
                <div className={`p-4 rounded-xl border-2 ${errors.GENDER ? "border-red-300" : "border-gray-200"} bg-white`}>
                  <div className="flex flex-wrap gap-4">
                    {["Male", "Female", "Other"].map((g) => (
                      <label key={g} className="flex items-center gap-3 text-gray-700 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="radio"
                            name="GENDER"
                            value={g}
                            checked={formData.GENDER === g}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 ${formData.GENDER === g ? "border-[#F1B501] bg-[#F1B501]" : "border-gray-300"} transition-all duration-200 group-hover:border-[#F1B501]`}>
                            {formData.GENDER === g && (
                              <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            )}
                          </div>
                        </div>
                        <span className="group-hover:text-[#28375E] transition-colors">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {errors.GENDER && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.GENDER}
                </p>}
              </div>

              {/* DOB */}
              <div data-error={!!errors.DOB}>
                <label className="block mb-3 font-semibold text-gray-700">Date of Birth *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    max={getCurrentDate()}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.DOB ? "border-red-300" : "border-gray-200"} rounded-xl px-5 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                </div>
                {errors.DOB && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.DOB}
                </p>}
              </div>

              {/* Interview Mode */}
              <div data-error={!!errors.INTERVIEW_MODE}>
                <label className="block mb-3 font-semibold text-gray-700">Interview Mode *</label>
                <div className="relative">
                  <select
                    name="INTERVIEW_MODE"
                    value={formData.INTERVIEW_MODE}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.INTERVIEW_MODE ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white appearance-none`}
                  >
                    <option value="">Select Mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Telephonic">Telephonic</option>
                  </select>
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {errors.INTERVIEW_MODE && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.INTERVIEW_MODE}
                </p>}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#F1B501] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#28375E]">Contact Information</h2>
            </div>

            {/* ROW 3 → Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-error={!!errors.EMAIL}>
                <label className="block mb-3 font-semibold text-gray-700">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="EMAIL"
                    placeholder="example@mail.com"
                    value={formData.EMAIL}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.EMAIL ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                {errors.EMAIL && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.EMAIL}
                </p>}
              </div>

              <div data-error={!!errors.PHONE_NUMBER}>
                <label className="block mb-3 font-semibold text-gray-700">Phone Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="PHONE_NUMBER"
                    placeholder="+91 98765 43210"
                    value={formData.PHONE_NUMBER}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.PHONE_NUMBER ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                {errors.PHONE_NUMBER && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.PHONE_NUMBER}
                </p>}
              </div>
            </div>

            {/* ROW 4 → Address full width */}
            <div className="mt-6" data-error={!!errors.ADDRESS}>
              <label className="block mb-3 font-semibold text-gray-700">Residential Address *</label>
              <div className="relative">
                <textarea
                  name="ADDRESS"
                  placeholder="Enter your complete residential address"
                  value={formData.ADDRESS}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full border-2 ${errors.ADDRESS ? "border-red-300" : "border-gray-200"} rounded-xl p-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white resize-none`}
                ></textarea>
                <svg className="w-5 h-5 text-gray-400 absolute right-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {errors.ADDRESS && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {errors.ADDRESS}
              </p>}
            </div>
          </div>

          {/* Professional Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#F1B501] rounded-full"></div>
              <h2 className="text-2xl font-bold text-[#28375E]">Professional Information</h2>
            </div>

            {/* ROW 5 → Experience + DOI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div data-error={!!errors.EXPERIANCE}>
                <label className="block mb-3 font-semibold text-gray-700">Professional Experience *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="EXPERIANCE"
                    placeholder="Eg: 3 years in Frontend Development"
                    value={formData.EXPERIANCE}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.EXPERIANCE ? "border-red-300" : "border-gray-200"} rounded-xl px-5 pr-12 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {errors.EXPERIANCE && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.EXPERIANCE}
                </p>}
              </div>

              <div data-error={!!errors.DOI}>
                <label className="block mb-3 font-semibold text-gray-700">Interview Date *</label>
                <div className="relative">
                  <input
                    type="date"
                    name="DOI"
                    value={formData.DOI}
                    min={getCurrentDate()}
                    onChange={handleChange}
                    className={`w-full h-14 border-2 ${errors.DOI ? "border-red-300" : "border-gray-200"} rounded-xl px-5 focus:ring-2 focus:ring-[#F1B501] focus:border-[#F1B501] outline-none transition-all duration-200 bg-white`}
                  />
                </div>
                {errors.DOI && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {errors.DOI}
                </p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-[#F1B501] to-[#FFD166] text-[#28375E] font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-center text-gray-500 text-sm mt-8">
          We'll contact you within 24-48 hours to confirm your interview schedule.
        </p>
      </div>
    </div>
  );
};

export { InterviewForm };
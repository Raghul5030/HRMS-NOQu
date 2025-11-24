import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * InterviewSuccess
 * Expects navigate state: { data: formData, response?: backendResponse, error?: errorMessage }
 */
const InterviewSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const data = state.data || {};
  const backendResponse = state.response;
  const error = state.error;

  const formatKey = (k) =>
    k
      .toLowerCase()
      .replace(/_/g, " ")
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

  const getStatusIcon = () => {
    if (error) {
      return (
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  };

  const getStatusMessage = () => {
    if (error) {
      return "Submission Completed with Issues";
    }
    return "Application Submitted Successfully!";
  };

  const getStatusDescription = () => {
    if (error) {
      return "Your information has been recorded, but we encountered an issue with the backend service.";
    }
    return "Thank you for your application! We've received your information and will contact you shortly.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 py-8">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-[#28375E] to-[#1E40AF] p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              {getStatusIcon()}
              <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left">
                {getStatusMessage()}
              </h1>
              <p className="mt-3 text-blue-100 text-center md:text-left max-w-2xl">
                {getStatusDescription()}
              </p>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 justify-center">
            {backendResponse && (
              <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-800 font-medium">Backend: Success</span>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl border border-red-200">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-800 font-medium">Backend Error</span>
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-blue-800 font-medium">Form Submitted</span>
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Submitted Data Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#F1B501] rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800">Application Details</h2>
            </div>

            {Object.keys(data).length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-500 text-lg">No form data available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors duration-200">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-500 mb-1">{formatKey(key)}</div>
                        <div className="text-lg font-semibold text-gray-800 truncate">
                          {value ? String(value) : <span className="text-gray-400 italic">Not provided</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Details Section */}
          {error && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-800">Error Details</h2>
              </div>
              
              <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Backend Service Error</h3>
                    <p className="text-red-700 font-mono bg-red-100 px-3 py-2 rounded-lg border border-red-200">
                      {String(error)}
                    </p>
                    <p className="text-red-600 text-sm mt-3">
                      Don't worry - your form data has been saved locally. Please try submitting again or contact support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 border-2 border-[#28375E] text-[#28375E] font-semibold rounded-xl hover:bg-[#28375E] hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
              </svg>
              Print Summary
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gradient-to-r from-[#F1B501] to-[#FFD166] text-[#28375E] font-bold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Form
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@company.com" className="text-[#28375E] hover:underline">
              support@company.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export { InterviewSuccess };
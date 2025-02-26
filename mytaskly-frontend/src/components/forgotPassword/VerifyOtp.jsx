import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  if (!email)
    return <p className="text-center text-red-500 font-semibold">Error: No email found. Please restart the process.</p>;

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:9091/api/v1/forgot-password/verify-otp", null, {
        params: { email, otp }, 
      });

      setMessage(response.data);
      navigate("/reset-password", { state: { email } }); 
    } catch (error) {
      setMessage(error.response?.data || "Invalid OTP");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setMessage(""); 

    try {
      const response = await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
        params: { email },
      });

      setMessage("A new OTP has been sent to your email.");
    } catch (error) {
      setMessage(error.response?.data || "Error resending OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-4">
          Enter the OTP sent to <span className="font-semibold">{email}</span>.
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleVerifyOtp}
        >
          Verify OTP
        </button>

        <button
          className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          onClick={handleResendOtp}
          disabled={isResending}
        >
          {isResending ? "Resending..." : "Resend OTP"}
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm p-2 rounded-lg ${
              message.includes("Invalid") || message.includes("Error") ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;

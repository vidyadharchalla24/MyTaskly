import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
        params: { email },
      });

      setMessage(response.data);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      setMessage(error.response?.data || "Error sending OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">Enter your email to receive an OTP.</p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleSendOtp}
        >
          Send OTP
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700 bg-gray-200 p-2 rounded-lg">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

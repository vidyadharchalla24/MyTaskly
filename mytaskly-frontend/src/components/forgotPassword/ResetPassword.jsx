import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; 

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (!email) return <p className="text-center text-red-500 font-semibold">Error: No email found. Please restart the process.</p>;

  const handleSetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:9091/api/v1/forgot-password/set-password", null, {
        params: { email, newPassword },
      });

      setMessage(response.data);
      setTimeout(() => navigate("/login"), 1000); 
    } catch (error) {
      setMessage(error.response?.data || "Error setting password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Reset Password</h2>
        <p className="text-gray-600 text-center mb-4">Set a new password for <span className="font-semibold">{email}</span>.</p>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          onClick={handleSetPassword}
        >
          Submit
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm p-2 rounded-lg ${message.includes("Error") ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

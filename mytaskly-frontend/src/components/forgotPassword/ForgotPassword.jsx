import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../utils/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors({ ...errors, email: "" });
  };

  const handleSendOtp = async () => {
    if (!validate()) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
       "/api/v1/forgot-password/send-otp",
        null,
        {
          params: { email },
        }
      );
      console.log(response.data);
      toast.success(response?.data || "Otp sent successfully to email");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.log(error.response);
      const errorMessage =
        error.response?.data || "Error sending OTP. Try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to receive an OTP.
        </p>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:outline-none transition duration-200 ${
                errors.email
                  ? "border-red-500"
                  : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-l mt-1">{errors.email}</p>
            )}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            onClick={handleSendOtp}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

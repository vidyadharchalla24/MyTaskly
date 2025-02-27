import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!email) {
    toast.error("Error: No email found. Please restart the process.");
    return (
      <p className="text-center text-red-500 font-semibold mt-10">
        Error: No email found. Please restart the process.
      </p>
    );
  }

  const validatePasswords = () => {
    let newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = "Password is required.";
      // toast.error("Password is required.");
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters.";
      // toast.error("Password must be at least 8 characters.");
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword = "Include at least one uppercase letter.";
      // toast.error("Include at least one uppercase letter.");
    } else if (!/\d/.test(newPassword)) {
      newErrors.newPassword = "Include at least one number.";
      // toast.error("Include at least one number.");
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
      // toast.error("Confirm Password is required.");
    } 
    else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      // toast.error("Passwords do not match.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
    setErrors({ ...errors, [name]: "" });
  };
  

  const handleSetPassword = async () => {
     if (!validatePasswords()) {
          toast.error("Please fix the errors before proceeding.");
          return;
        }
    
   
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:9091/api/v1/forgot-password/set-password",
        null,
        { params: { email, newPassword } }
      );

      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data || "Error setting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Set a new password for <span className="font-semibold">{email}</span>.
        </p>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className={`w-full p-3 border rounded-lg focus:outline-none transition duration-200 ${
                errors.newPassword ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={newPassword}
              onChange={handleChange}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-l mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm new password"
              className={`w-full p-3 border rounded-lg focus:outline-none transition duration-200 ${
                errors.confirmPassword ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-l mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            onClick={handleSetPassword}
            disabled={loading}
          >
            {loading ? "Updating Password..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

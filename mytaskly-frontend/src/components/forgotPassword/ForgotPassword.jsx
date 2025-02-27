



// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const validate = () => {
//     let newErrors = {};

//     if (!email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       newErrors.email = "Enter a valid email address.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSendOtp = async () => {
//     if (!validate()) {
//       toast.error("Please enter a valid email.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
//         params: { email },
//       });

//       toast.success(response.data || "OTP sent successfully!");
//       navigate("/verify-otp", { state: { email } });
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || "Error sending OTP. Try again.";
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Forgot Password</h2>
//         <p className="text-gray-600 text-center mb-6">Enter your email to receive an OTP.</p>

//         <input
//           type="email"
//           placeholder="Enter your email"
//           className={`w-full p-3 border rounded-lg focus:outline-none ${
//             errors.email ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
//           }`}
//           value={email}
//           onChange={(e) => {
//             setEmail(e.target.value);
//             setErrors({ ...errors, email: "" }); 
//           }}
//         />
//         {errors.email && <p className="text-red-500 text-l mt-1">{errors.email}</p>}

//         <button
//           className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//           onClick={handleSendOtp}
//           disabled={loading}
//         >
//           {loading ? "Sending OTP..." : "Send OTP"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      const response = await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
        params: { email },
      });
      console.log(response.data);
      toast.success(response?.data || "Otp sent successfully to email");
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      console.log(error.response);
      const errorMessage = error.response?.data || "Error sending OTP. Try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>
        <p className="text-gray-600 text-center mb-6">Enter your email to receive an OTP.</p>

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:outline-none transition duration-200 ${
                errors.email ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={email}
              onChange={handleChange} 
            />
            {errors.email && <p className="text-red-500 text-l mt-1">{errors.email}</p>}
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

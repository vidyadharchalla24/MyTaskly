// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// const VerifyOtp = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const email = location.state?.email;

//   const [otp, setOtp] = useState("");
//   const [message, setMessage] = useState("");
//   const [isResending, setIsResending] = useState(false);

//   if (!email)
//     return <p className="text-center text-red-500 font-semibold">Error: No email found. Please restart the process.</p>;

//   const handleVerifyOtp = async () => {
//     try {
//       const response = await axios.post("http://localhost:9091/api/v1/forgot-password/verify-otp", null, {
//         params: { email, otp }, 
//       });

//       setMessage(response.data);
//       navigate("/reset-password", { state: { email } }); 
//     } catch (error) {
//       setMessage(error.response?.data || "Invalid OTP");
//     }
//   };

//   const handleResendOtp = async () => {
//     setIsResending(true);
//     setMessage(""); 

//     try {
//       const response = await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
//         params: { email },
//       });

//       setMessage("A new OTP has been sent to your email.");
//     } catch (error) {
//       setMessage(error.response?.data || "Error resending OTP.");
//     } finally {
//       setIsResending(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify OTP</h2>
//         <p className="text-gray-600 text-center mb-4">
//           Enter the OTP sent to <span className="font-semibold">{email}</span>.
//         </p>

//         <input
//           type="text"
//           placeholder="Enter OTP"
//           className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//         />

//         <button
//           className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//           onClick={handleVerifyOtp}
//         >
//           Verify OTP
//         </button>

//         <button
//           className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200"
//           onClick={handleResendOtp}
//           disabled={isResending}
//         >
//           {isResending ? "Resending..." : "Resend OTP"}
//         </button>

//         {message && (
//           <p
//             className={`mt-4 text-center text-sm p-2 rounded-lg ${
//               message.includes("Invalid") || message.includes("Error") ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"
//             }`}
//           >
//             {message}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VerifyOtp;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [isResending, setIsResending] = useState(false);

  if (!email) {
    toast.error("Error: No email found. Please restart the process.");
    return (
      <p className="text-center text-red-500 font-semibold mt-10">
        Error: No email found. Please restart the process.
      </p>
    );
  }

  // Handle OTP Input Change
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Allow only 6-digit numbers
    setOtp(value);
    setErrors({ ...errors, otp: "" }); 
  };
  

  const validateOtp = () => {
    let newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required.";
      // toast.error("OTP is required.");
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = "OTP must be a 6-digit number.";
      // toast.error("OTP must be a 6-digit number.");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp()) {
      toast.error("Please fix the errors before proceeding.");
      return;
    }


    

    try {
      await axios.post(
        "http://localhost:9091/api/v1/forgot-password/verify-otp",
        null,
        { params: { email, otp } }
      );
      navigate("/reset-password", { state: { email } });

      toast.success("OTP Verified! Redirecting...");
   
    } catch (error) {
      toast.error(error.response?.data || "Invalid OTP. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setErrors({}); 

    try {
     const response= await axios.post("http://localhost:9091/api/v1/forgot-password/send-otp", null, {
        params: { email },
      });
      console.log(response)
      toast.success(response?.data || "A new OTP has been sent to your email.");
    } catch (error) {
      toast.error(error.response?.data || "Error resending OTP. Try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-4">
          Enter the OTP sent to <span className="font-semibold">{email}</span>.
        </p>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              className={`w-full p-3 border rounded-lg focus:outline-none transition duration-200 ${
                errors.otp ? "border-red-500" : "focus:ring-2 focus:ring-blue-500"
              }`}
              value={otp}
              onChange={handleChange} 
            />
            {errors.otp && <p className="text-red-500 text-l mt-1">{errors.otp}</p>}
          </div>

          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>

          <button
            className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-200 disabled:bg-gray-300"
            onClick={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

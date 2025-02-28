import { useState, useContext } from "react";
import { BASE_URL } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../../assets/feature.jpg";
import { TokenContext } from "../../utils/TokenContext";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { setToken } = useContext(TokenContext);

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields.");
      return;
    }
    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/v1/login`, formData);
      if (response.data?.token) {
        setToken(response.data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid login credentials.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen items-center justify-center px-4 bg-gray-100">
      <div className="hidden md:flex w-full md:w-1/2 items-center justify-center p-4">
        <img
          src={loginImage}
          alt="Login"
          className="w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.email
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-indigo-400"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-l mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                  errors.password
                    ? "border-red-500"
                    : "focus:ring-2 focus:ring-indigo-400"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-l mt-1">{errors.password}</p>
              )}
            </div>
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-indigo-500 text-l hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-4 text-l text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

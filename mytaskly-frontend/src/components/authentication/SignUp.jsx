import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import signupImage from "../../assets/home2.png";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full Name is required.";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter.";
        } else if (!/\d/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password.";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match.";
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
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:9091/api/v1/register", formData);
            console.log(formData);
            alert("Signup successful! Please log in.");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center -mt-10">
            {/* Left Image Section */}
            <div className="hidden md:flex w-1/2 items-center justify-center">
                <img src={signupImage} alt="Signup" className="w-3/4 h-auto rounded-lg shadow-lg" />
            </div>

            {/* Signup Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                                    errors.name ? "border-red-500" : "focus:ring-2 focus:ring-indigo-400"
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                                    errors.email ? "border-red-500" : "focus:ring-2 focus:ring-indigo-400"
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                                    errors.password ? "border-red-500" : "focus:ring-2 focus:ring-indigo-400"
                                }`}
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
                                    errors.confirmPassword ? "border-red-500" : "focus:ring-2 focus:ring-indigo-400"
                                }`}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-indigo-500 hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;

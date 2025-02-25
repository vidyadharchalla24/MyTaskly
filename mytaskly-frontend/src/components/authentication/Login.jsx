import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../../assets/feature.jpg";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login submitted", formData);
        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen items-center justify-center -mt-10">
            {/* Left Image */}
            <div className="hidden md:flex w-1/2 items-center justify-center">
                <img src={loginImage} alt="Login" className="w-3/4 h-auto rounded-lg shadow-lg" />
            </div>

            {/* Login Form */}
            <div className="w-full md:w-1/2 flex items-center justify-center ">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                required
                            />
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-indigo-500 text-sm hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-300"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-gray-600 text-center">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-indigo-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

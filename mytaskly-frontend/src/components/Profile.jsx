import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const Profile = () => {
    const userId = "123";
    const [user, setUser] = useState({});
    const [newData, setNewData] = useState({ name: "" });
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    useEffect(() => {
        axios
            .get(`http://localhost:9091/api/v1/users/${userId}`)
            .then((response) => {
                setUser(response.data);
                setNewData({ name: response.data.name });
            })
            .catch((error) => console.error("Error fetching user data:", error));
    }, [userId]);

    const handleChange = (e) => {
        setNewData({ ...newData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        axios
            .put(`http://localhost:9091/api/v1/users/${userId}`, newData)
            .then(() => alert("Profile updated successfully!"))
            .catch((error) => console.error("Error updating profile:", error));
    };

    const handleTogglePassword = () => {
        setShowPasswordFields(!showPasswordFields);
    };

    const handleChangePassword = async () => {
        if (!passwords.oldPassword || !passwords.newPassword) {
            alert("Please enter both old and new passwords.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:9091/api/v1/users/${userId}/changePassword`,
                passwords
            );

            if (response.data === "Password didn't match!!") {
                alert("Incorrect old password! Please try again.");
            } else if (response.data === "No User Found!!") {
                alert("User not found. Please try again.");
            } else {
                alert("Password changed successfully!");
                setPasswords({ oldPassword: "", newPassword: "" });
                setShowPasswordFields(false);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg border">
            {/* Title */}
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile Settings</h2>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-6">
                <label className="relative cursor-pointer">
                    {user.profilePic ? (
                        <img
                            src={user.profilePic}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                        />
                    ) : (
                        <FaUserCircle className="w-24 h-24 text-gray-400" />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={() => {}}
                    />
                </label>
                <p className="text-sm text-gray-500 mt-2">Click to upload photo</p>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Email Field */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email || ""}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Update Profile Button */}
                <div className="mt-4">
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Update Profile
                    </button>
                </div>

                {/* Toggle Change Password */}
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <label className="block text-gray-700 text-sm font-semibold">Change Password</label>
                    <input
                        type="checkbox"
                        onChange={handleTogglePassword}
                        className="cursor-pointer w-5 h-5 accent-blue-600"
                    />
                </div>

                {/* Password Fields (Only Show When Toggle is ON) */}
                {showPasswordFields && (
                    <div className="mt-3">
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-semibold">Old Password</label>
                            <input
                                type="password"
                                name="oldPassword"
                                onChange={handlePasswordChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-semibold">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                onChange={handlePasswordChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                            />
                        </div>

                        {/* Change Password Button */}
                        <button
                            onClick={handleChangePassword}
                            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
                        >
                            Save New Password
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

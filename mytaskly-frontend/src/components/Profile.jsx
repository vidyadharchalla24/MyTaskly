import { useEffect, useState, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { TokenContext } from "../utils/TokenContext";

const Profile = () => {
    const { decodedToken } = useContext(TokenContext);
    const userId = decodedToken?.user_id;

    const [user, setUser] = useState({});
    const [newData, setNewData] = useState({ name: "" });
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!userId) return;

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

    const handleUpdate = () => {
        axios
            .put(`http://localhost:9091/api/v1/users/${userId}`, newData)
            .then(() => alert("Profile updated successfully!"))
            .catch((error) => console.error("Error updating profile:", error));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Upload profile picture
    const handleUploadProfilePicture = async () => {
        if (!selectedFile) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await axios.post(
                `http://localhost:9091/api/v1/users/${userId}/upload`,
                formData
            );

            alert("Profile picture updated successfully!");
            setUser({ ...user, profilePic: response.data });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    // Remove profile picture
    const handleRemoveProfilePicture = async () => {
        if (!user.profilePic) {
            alert("No profile picture to remove.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to remove your profile picture?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(
                `http://localhost:9091/api/v1/users/${userId}/remove`
            );

            alert(response.data);
            setUser({ ...user, profilePic: null });
        } catch (error) {
            console.error("Error removing profile picture:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-md rounded-lg border">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile Settings</h2>

            {/* 🔹 Profile Picture Section */}
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
                        onChange={handleFileChange}
                    />
                </label>
                <div className="mt-2 space-x-2">
                    <button
                        onClick={handleUploadProfilePicture}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Upload Photo
                    </button>
                    {user.profilePic && (
                        <button
                            onClick={handleRemoveProfilePicture}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Remove Photo
                        </button>
                    )}
                </div>
            </div>

            {/* 🔹 Profile Form */}
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={newData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email || ""}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <button
                    onClick={handleUpdate}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    Update Profile
                </button>

                {/* 🔹 Change Password Section */}
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <label className="block text-gray-700 text-sm font-semibold">Change Password</label>
                    <input
                        type="checkbox"
                        onChange={() => setShowPasswordFields(!showPasswordFields)}
                        className="cursor-pointer w-5 h-5"
                    />
                </div>

                {showPasswordFields && (
                    <div className="mt-3 space-y-3">
                        <input
                            type="password"
                            name="oldPassword"
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Old Password"
                        />
                        <input
                            type="password"
                            name="newPassword"
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="New Password"
                        />
                        <button
                            onClick={handleChangePassword}
                            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
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

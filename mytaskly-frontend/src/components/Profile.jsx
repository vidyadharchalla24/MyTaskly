import { useEffect, useState, useContext, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { TokenContext } from "../utils/TokenContext";
import { toast } from "react-toastify";

const Profile = () => {
    const { decodedToken } = useContext(TokenContext);
    const userId = decodedToken?.user_id;

    const [user, setUser] = useState({ name: "", email: "", profilePic: "" });
    const [newName, setNewName] = useState("");
    const [showOptions, setShowOptions] = useState(false);
    const fileInputRef = useRef(null);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
      const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:9091/api/v1/users/${userId}`)
            .then((response) => {
                setUser(response.data);
                setNewName(response.data.name);
            })
            .catch(() => toast.error("Error fetching user data."));
    }, [userId]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`http://localhost:9091/api/v1/users/${userId}/upload`, formData);
            setUser({ ...user, profilePic: response.data });
            toast.success("Profile picture updated!");
        } catch {
            toast.error("Error uploading profile picture.");
        }
    };

    const handleRemoveProfilePicture = async () => {
        if (!user.profilePic) return;
        const confirmDelete = window.confirm("Are you sure you want to remove your profile picture?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:9091/api/v1/users/${userId}/remove`);
            setUser({ ...user, profilePic: null });
            toast.success("Profile picture removed!");
        } catch {
            toast.error("Error removing profile picture.");
        }
    };

    const handleProfileClick = () => {
        if (!user.profilePic) {
            fileInputRef.current.click();
        } else {
            setShowOptions(true);
        }
    };

    const handleProfileUpdate = async () => {
        if (!newName.trim()) {
            toast.error("Name cannot be empty!");
            return;
        }
        try {
            await axios.put(`http://localhost:9091/api/v1/users/${userId}`, { name: newName });
            setUser({ ...user, name: newName });
            toast.success("Profile updated successfully!");
        } catch {
            toast.error("Error updating profile.");
        }
    };

    const handlePasswordChange = async () => {
        const { oldPassword, newPassword, confirmPassword } = passwords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required.");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:9091/api/v1/users/${userId}/changePassword`, { oldPassword, newPassword });
            if (response.data === "Password didn't match!!") {
                toast.error("Incorrect old password!");
            } else {
                toast.success("Password changed successfully!");
                setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
                setShowPasswordFields(false);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg border">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Profile Settings</h2>

            {/* Profile Picture */}
            <div className="flex flex-col items-center mb-6 relative">
                <div className="relative">
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <div className="cursor-pointer relative" onClick={handleProfileClick}>
                        {user.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover" />
                        ) : (
                            <FaUserCircle className="w-24 h-24 text-gray-400" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm">Change</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Name Input */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                />
            </div>

            {/* Email Display */}
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-1">Email</label>
                <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                />
            </div>

            <button onClick={handleProfileUpdate} className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg">Update Profile</button>


  {/* Profile Picture Options Modal */}
            {showOptions && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                     <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                         <p className="text-lg font-semibold mb-4">Update Profile Picture</p>
                        <button onClick={() => { fileInputRef.current.click(); setShowOptions(false); }} className="block w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-2">Update</button>
                       <button onClick={() => { handleRemoveProfilePicture(); setShowOptions(false); }} className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Remove</button>
                       <button onClick={() => setShowOptions(false)} className="block w-full mt-2 text-gray-600">Cancel</button>
                    </div>
                </div>
            )}
            <button onClick={() => setShowPasswordFields(!showPasswordFields)} className="w-full mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg">
                {showPasswordFields ? "Cancel" : "Change Password"}
            </button>

            {/* Password Change Fields */}
            {showPasswordFields && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <input 
                        type="password" 
                        placeholder="Old Password" 
                        className="w-full p-3 mb-2 border rounded" 
                        onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                    />
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        className="w-full p-3 mb-2 border rounded" 
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm Password" 
                        className="w-full p-3 mb-2 border rounded" 
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    />
                    <button onClick={handlePasswordChange} className="w-full bg-green-500 text-white px-4 py-2 rounded-lg">Save New Password</button>
                </div>
            )}
        </div>
    );
};

export default Profile;

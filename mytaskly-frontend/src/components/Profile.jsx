import { useEffect, useState, useContext, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BASE_URL } from "../utils/api";
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
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${BASE_URL}/api/v1/users/${userId}`)
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
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/${userId}/upload`,
        formData
      );
      setUser({ ...user, profilePic: response.data });
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Error uploading profile picture.");
    }
  };

  const handleProfileClick = () => {
    if (!user.profilePic) {
      fileInputRef.current.click();
    } else {
      setShowOptions(true);
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user.profilePic) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/api/v1/users/${userId}/remove`);
      setUser({ ...user, profilePic: null });
      toast.success("Profile picture removed!");
    } catch {
      toast.error("Error removing profile picture.");
    }
  };

  const validate = () => {
    let newErrors = {};
    const { oldPassword, newPassword, confirmPassword } = passwords;

    if (!newName.trim()) {
      newErrors.name = "Name is required";
    }

    if (showPasswordFields) {
      if (!oldPassword) newErrors.oldPassword = "Old password is required.";
      if (!newPassword) newErrors.newPassword = "New password is required.";
      if (!confirmPassword)
        newErrors.confirmPassword = "Confirm password is required.";
      if (newPassword && newPassword.length < 8)
        newErrors.newPassword =
          "New password must be at least 8 characters long.";
      if (newPassword !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/v1/users/${userId}`, {
        name: newName,
      });
      setUser({ ...user, name: newName });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Error updating profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "newName") {
      setNewName(value);
    } else {
      setPasswords((prevPasswords) => ({
        ...prevPasswords,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name === "newName" ? "name" : name]: "",
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    const { oldPassword, newPassword } = passwords;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/users/${userId}/changePassword`,
        { oldPassword, newPassword }
      );
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl mx-auto mt-10 mb-4 p-8 bg-white shadow-lg rounded-lg border">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Profile Settings
        </h2>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div
              className="cursor-pointer relative"
              onClick={handleProfileClick}
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
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
            name="newName"
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          {errors.name && (
            <p className="text-red-500 text-l mt-1">{errors.name}</p>
          )}
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

        <button
          onClick={handleProfileUpdate}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Update Profile
        </button>

        {/* Profile Picture Options Modal */}
        {showOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <p className="text-lg font-semibold mb-4">
                Update Profile Picture
              </p>
              <button
                onClick={() => {
                  fileInputRef.current.click();
                  setShowOptions(false);
                }}
                className="block w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-2"
              >
                Update
              </button>
              <button
                onClick={() => {
                  handleRemoveProfilePicture();
                  setShowOptions(false);
                }}
                className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
              <button
                onClick={() => setShowOptions(false)}
                className="block w-full mt-2 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowPasswordFields(!showPasswordFields)}
          className="w-full mt-4 bg-gray-600 text-white px-6 py-3 rounded-lg"
        >
          {showPasswordFields ? "Cancel" : "Change Password"}
        </button>

        {showPasswordFields && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            {["oldPassword", "newPassword", "confirmPassword"].map(
              (field, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="password"
                    name={field}
                    placeholder="enter password"
                    className="w-full p-3 border rounded"
                    onChange={handleChange}
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
                  )}
                </div>
              )
            )}
            <button
              onClick={handlePasswordChange}
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg"
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

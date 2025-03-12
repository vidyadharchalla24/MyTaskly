import { useEffect, useState, useContext, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { TokenContext } from "../utils/TokenContext";
import { toast } from "react-toastify";
import { MdEdit, MdDelete } from "react-icons/md";
import api from "../utils/api";
const Profile = () => {
  const { decodedToken } = useContext(TokenContext);
  const userId = decodedToken?.user_id;

  const [user, setUser] = useState({ name: "", email: "", imageUrl:"" });
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
    api
      .get(`api/v1/users/${userId}`)
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
      const response = await api.post(
        `/api/v1/users/${userId}/upload`,
        formData
      );
      setUser({ ...user, imageUrl: response.data });
      toast.success("Profile picture updated!");
    } catch {
      toast.error("Error uploading profile picture.");
    }
  };
  const handleProfileClick = () => {
    if (user.imageUrl) {  
      setShowOptions(true); 
    } else {
      fileInputRef.current.click();  
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!user.imageUrl) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/v1/users/${userId}/remove`);
      setUser({ ...user, imageUrl: null });
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
      await api.put(`/api/v1/users/${user.email}/changeUsername`, null,
        {
          params: { username: newName, },
        } 
        
      );
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
      const response = await api.post(
        `/api/v1/users/${userId}/changePassword`,
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
    <div className="min-h-screen  flex items-center justify-center font-[Poppins]">
      <div className="w-full max-w-xl mx-auto mt-10 mb-4 p-8 bg-white shadow-lg rounded-lg border">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Profile 
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
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover"
                />
              ) : (
                <FaUserCircle className="w-40 h-40 text-gray-400" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-white text-sm">Change</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Profile Picture Options Modal */}
          {showOptions && (
            <div className="">
              <div className="">
                <p className="text-lg flex justify-center font-semibold mb-4">
                  Update Profile Picture
                </p>
                <div className="flex flex-row justify-center gap-5">
                  <button
                    onClick={() => {
                      fileInputRef.current.click();
                      setShowOptions(false);
                    }}
                    className="block w-40 bg-blue-500 text-white mt-2 px-2 py-3 rounded-lg hover:bg-blue-600 mb-2"
                  >
                    <div className="flex flex-col items-center">
                      <MdEdit size={24} />
                     
                    </div>

                  </button>
                  <button
                    onClick={() => {
                      handleRemoveProfilePicture();
                      setShowOptions(false);
                    }}
                    className="block w-40 bg-red-500 text-white mt-2 px-2 py-3 rounded-lg hover:bg-red-600 mb-2"
                  >
                    <div className="flex flex-col items-center">
                      <MdDelete size={24} />
                     
                    </div>
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowOptions(false)}
                    className="block w-40 py-3 px-3 mt-2 mb-5 text-white bg-green-400 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Name Input */}
          <div className="lg:w-1/2">
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="newName"
              value={newName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            {errors.name && <p className="text-red-500 text-l mt-1">{errors.name}</p>}
          </div>

          {/* Email Input (Disabled) */}
          <div className="lg:w-1/2">
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* Update Profile Button */}
        <div className="flex flex-col justify-center gap-10 sm:flex-row mt-5">
          <button
            onClick={handleProfileUpdate}
            className="w-40  bg-blue-600 text-white px-2 py-2 rounded-lg mt-4"
          >
            Update Profile
          </button>

          <button
            onClick={() => setShowPasswordFields(!showPasswordFields)}
            className="w-40  bg-gray-600 text-white px-2 py-2 rounded-lg mt-4"
          >
            {showPasswordFields ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordFields && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            {[
              { name: "oldPassword", placeholder: "Enter Old Password" },
              { name: "newPassword", placeholder: "Enter New Password" },
              { name: "confirmPassword", placeholder: "Confirm New Password" },
            ].map((field, index) => (
              <div key={index} className="mb-2">
                <input
                  type="password"
                  name={field.name}
                  placeholder={field.placeholder}
                  className="w-full p-3 border rounded"
                  onChange={handleChange}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
            <div className="flex justify-center">
              <button
                onClick={handlePasswordChange}
                className="w-40  items-center mt-5 bg-green-500 text-white px-3 py-2 rounded-lg"
              >
                Save New Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
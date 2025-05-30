import React, { useContext, useEffect, useState } from "react";
import { FaUserPlus, FaArrowLeft, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import api from "../../utils/api";

const Avatar = ({ name, image_url }) => {
  if (image_url) {
    return (
      <img src={image_url} alt={name} className="w-10 h-10 rounded-full" />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg font-bold">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

export default function CollaborationList() {
  const [collaborators, setCollaborators] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { userDetails } = useContext(UserContext);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { projectId } = useParams();
  const userEmail = userDetails?.email;
  const navigate = useNavigate();
  const [isUpdated,setIsUpdated] = useState(false);

  // Fetch all users and collaborators on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsUpdated(false);
      try {
        const [userResponse, collabResponse] = await Promise.all([
          api.get(`/api/v1/users/all-users/${userEmail}`),
          api.get(`/api/v1/projects-assignments/${projectId}/collaborators`)
        ]);        
        setAllUsers(userResponse?.data || []);
        setCollaborators(collabResponse?.data || []);
        // Initialize filtered users for display when dropdown opens
        const initialFiltered = (userResponse?.data || [])
          .filter(user => !(collabResponse?.data || []).some(c => c?.userId === user?.userId))
          .slice(0, 3);
          // console.log(initialFiltered);
        setFilteredUsers(initialFiltered);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail, projectId,isUpdated]);

  // Filter users when search term changes or dropdown is opened
  useEffect(() => {
    const lowerSearch = searchTerm?.toLowerCase() || "";
  
    const nonCollaborators = allUsers
      ?.filter(user => !collaborators.some(c => c?.userId === user?.userId));
    
    const filtered = nonCollaborators
      .filter(user => user?.email?.toLowerCase().includes(lowerSearch))
      .slice(0, 5); // limit to 5 results maximum
  
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers, collaborators]);
  
  const toggleCollaborator = async (email) => {
    try {
      setIsLoading(true);
      const response = await api.post(`/api/v1/invitations/send/${email}/${projectId}`);
      // console.log(response);
      setNotification(`Invitation sent to ${email}.`);
      setShowDropdown(false);
      setSearchTerm("");

      // Auto-dismiss after 4 seconds
      setTimeout(() => setNotification(""), 4000);
    } catch (error) {
      console.error("Error sending invitation", error);
      setNotification(
        `Failed to send invitation to ${email}.`
      );
      setTimeout(() => setNotification(""), 4000);
    }finally{
      setIsLoading(false);
    }
  };

  const removeCollaborator = async (userId) => {
    try {
      // Add your API call to remove collaborator
      await api.delete(`/api/v1/projects-assignments/${projectId}/collaborators/${userId}`);
      setCollaborators((prev) => prev.filter((c) => c.userId !== userId));
      setNotification("Collaborator removed successfully.");
      setTimeout(() => setNotification(""), 2000);
      setIsUpdated(true);
    } catch (error) {
      console.error("Error removing collaborator", error);
      setNotification("Failed to remove collaborator.");
      setTimeout(() => setNotification(""), 4000);
    }
  };
  
  const handleDropdownToggle = () => {
    const shouldOpen = !showDropdown;
    setShowDropdown(shouldOpen);
    
    if (shouldOpen) {
      // Reset search and refresh filtered users when opening dropdown
      setSearchTerm("");
      const initialFiltered = allUsers
        .filter(user => !collaborators.some(c => c?.userId === user?.userId))
        .slice(0, 3);
      setFilteredUsers(initialFiltered);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Collaborators</h2>
          <button
            onClick={handleDropdownToggle}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <FaUserPlus /> Invite Collaborators
          </button>
        </div>

        {showDropdown && (
          <div className="mt-4 border p-3 rounded bg-gray-50 space-y-2">
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="max-h-40 overflow-y-auto">
              {isLoading ? (
                <div className="text-sm text-gray-500 p-2">Loading...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((email) => (
                  <div
                    key={`email-${email}`}
                    onClick={() => toggleCollaborator(email)}
                    className="cursor-pointer p-2 hover:bg-blue-100 rounded flex items-center gap-2"
                  >
                    <div>
                      <p className="text-sm text-gray-600">{email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 p-2">
                  {searchTerm ? "No matching users found" : "No available users to invite"}
                </div>
              )}
            </div>
          </div>
        )}

        {notification && (
          <div className="mt-4 text-sm text-green-700 bg-green-100 border border-green-400 p-3 rounded">
            {notification}
          </div>
        )}

        <div className="mt-4 space-y-3">
          {collaborators.length > 0 ? (
            collaborators.map((collab) => (
              <div
                key={collab.password || `collab-${collab.email}`}
                className="flex items-center justify-between border p-3 rounded-md bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={collab.name} image_url={collab.image_url} />
                  <div>
                    <p className="font-medium text-gray-900">{collab.name || "Unnamed User"}</p>
                    <p className="text-sm text-gray-600">{collab.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeCollaborator(collab.password)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Remove collaborator"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No collaborators for this project yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
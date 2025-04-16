import React, { useState } from 'react';
import { FaUserPlus, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const usersList = [
  { userId: '1', name: 'Alice', email: 'alice@example.com', image_url: '' },
  { userId: '2', name: 'Bob', email: 'bob@example.com', image_url: '' },
  { userId: '3', name: 'Charlie', email: 'charlie@example.com', image_url: '' },
  { userId: '4', name: 'David', email: 'david@example.com', image_url: '' },
  { userId: '5', name: 'Eva', email: 'eva@example.com', image_url: '' },
  // Add more mock users
];

const Avatar = ({ name, image_url }) => {
  if (image_url) {
    return <img src={image_url} alt={name} className="w-10 h-10 rounded-full" />;
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg font-bold">
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default function CollaborationList() {
  const [collaborators, setCollaborators] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const {projectId} = useParams();
  const navigate = useNavigate();
  const filteredUsers = usersList
    .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 3);

  const toggleCollaborator = (user) => {
    setCollaborators(prev => {
      if (prev.find(c => c.userId === user.userId)) return prev;
      return [...prev, user];
    });
    setShowDropdown(false);
  };

  const removeCollaborator = (userId) => {
    setCollaborators(prev => prev.filter(c => c.userId !== userId));
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
            onClick={() => setShowDropdown(!showDropdown)}
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
            />
            <div className="max-h-40 overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => toggleCollaborator(user)}
                    className="cursor-pointer p-2 hover:bg-blue-100 rounded text-sm"
                  >
                    {user.email}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 p-2">No users found</div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {collaborators.map(collab => (
            <div key={collab.userId} className="flex items-center justify-between border p-3 rounded-md bg-gray-100">
              <div className="flex items-center gap-3">
                <Avatar name={collab.name} image_url={collab.image_url} />
                <div>
                  <p className="font-medium text-gray-900">{collab.name}</p>
                  <p className="text-sm text-gray-600">{collab.email}</p>
                </div>
              </div>
              <button onClick={() => removeCollaborator(collab.userId)} className="text-red-500 hover:text-red-700">
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
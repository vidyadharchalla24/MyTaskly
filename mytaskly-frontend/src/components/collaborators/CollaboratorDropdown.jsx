import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import Avatar from "./Avatar";
import AvatarComponent from "./AvatarComponent";


const CollaboratorDropdown = ({ projectId, value, onChange }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const res = await api.get(`/api/v1/projects-assignments/${projectId}/collaborators`);
        setCollaborators(res.data || []);
      } catch (err) {
        console.error("Failed to fetch collaborators", err);
      }
    };

    if (projectId) fetchCollaborators();
  }, [projectId]);

  const filtered = collaborators.filter((c) =>
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCollaborator = collaborators.find((c) => c.email === value);

  return (
    <div className="relative">
      <div
        onClick={() => setShowDropdown((prev) => !prev)}
        className="w-full px-4 py-2 border rounded-lg mb-3 bg-white cursor-pointer focus:ring focus:ring-blue-300 flex items-center justify-between"
      >
        {selectedCollaborator ? (
          <div className="flex items-center gap-2">
            <Avatar name={selectedCollaborator.name} image_url={selectedCollaborator.image_url} />
            <div>
              <p className="text-sm font-medium">{selectedCollaborator.name}</p>
              <p className="text-xs text-gray-600">{selectedCollaborator.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-gray-500">Select assignee</span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-md max-h-60 overflow-y-auto">
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b"
          />
          {filtered.length ? (
            filtered.map((collab) => (
              <div
                key={collab.password}
                className="p-2 hover:bg-blue-100 cursor-pointer flex gap-2 items-center"
                onClick={() => {
                  onChange(collab.email);
                  setShowDropdown(false);
                }}
              >
                <AvatarComponent name={collab.name}
                email={collab.email}
                image_url={collab.image_url}
                />
              </div>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No collaborators found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollaboratorDropdown;

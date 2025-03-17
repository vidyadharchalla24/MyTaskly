import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const Organization = () => {
  const [data, setData] = useState([]);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const location = useLocation();
  const { organizationName } = location.state;

  useEffect(() => {
    fetchProjects();
  }, [organizationName]);

  const fetchProjects = () => {
    api
      .get(`/api/v1/projects/${organizationName}/organizationName`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log("Error fetching organizations:", err));
  };

  const handleEdit = (projectId) => {
    console.log("Edit project:", projectId);
    // Add edit logic here
  };

  // Show Modal Before Deleting
  const handleDeleteClick = (projectId) => {
    setDeleteProjectId(projectId);
    setShowModal(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/api/v1/projects/${deleteProjectId}`);
      console.log(response.data);
      
      // Remove deleted project from state
      setData(data.filter((project) => project.projectId !== deleteProjectId));

      // Show success message
      setSuccessMessage(`Project with ID ${deleteProjectId} deleted successfully!`);
      
      // Close modal
      setShowModal(false);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="p-6 font-[Poppins]">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Project Details</h1>

      {successMessage && (
        <div className="text-center text-green-600 font-bold mb-4">{successMessage}</div>
      )}

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((project, index) => (
            <div
              key={project.projectId}
              className={`p-6 rounded-lg shadow-lg text-white flex flex-col justify-between ${
                index % 2 === 0 ? "bg-[#EFB036]" : "bg-[#23486A]"
              }`}
            >
              <div>
                <strong className="text-xl font-semibold mt-1">Project Name:</strong> 
                <span className="text-1xl"> {project.projectName}</span>
                <br />              

                <strong className="font-bold">Project Description:</strong>
                <p className="mt-2">{project.projectDescription}</p>
                <p className="mt-2 font-bold">Status: {project.projectStatus}</p>

                {project.projectAssignments && project.projectAssignments.length > 0 && (
                  <ul className="mt-3">
                    {project.projectAssignments.map((assignment) => (
                      <li key={assignment.projectAssignmentsId} className="mt-1">
                        <strong>Role:</strong> {assignment.role}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Edit & Delete Buttons */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleEdit(project.projectId)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#23486A] hover:bg-gray-200 mr-3"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteClick(project.projectId)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-red-600 hover:bg-gray-200"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this project?
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-3"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;

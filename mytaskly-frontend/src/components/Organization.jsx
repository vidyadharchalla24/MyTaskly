import React, { useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useLocation } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { OrganizationContext } from "../context/OrganizationContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Organization = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const {organizationName, setOrganizationName} = useContext(OrganizationContext);
  const {isProjectUpdated, setIsProjectUpdated} = useContext(UserContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [loading,setLoading] = useState(false);

  const location = useLocation();

  const goToSprintsPage = (projectId) => {
    navigate(`/SprintsPage/${projectId}`); 
  };
  
  useEffect(() => {
    // Fixed the way organizationName is accessed and set
    const orgName = location.state?.organizationName || "";
    setOrganizationName(orgName);
    fetchProjects(orgName);
    setIsProjectUpdated(false);
  }, [location.state, isProjectUpdated, setOrganizationName, setIsProjectUpdated]);

  const fetchProjects = (orgName) => {
    if (!orgName) return;
    
    api
      .get(`/api/v1/projects/${orgName}/organizationName`)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log("Error fetching organizations:", err));
  };

  const handleEdit = (projectId) => {
    console.log("Edit clicked for project ID:", projectId);
    // Find the project to edit
    const project = data.find(project => project.projectId === projectId);
    console.log("Found project:", project);
    if (project) {
      setProjectToEdit(project);
      setShowEditModal(true);
    }
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

  // Close edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setProjectToEdit(null);
  };

  const handleGantChartGenration = async (projectId,projectName) =>{
    try {
      setLoading(true);
      const response = await api.get(`/api/v1/sprints/project/${projectId}`);
      setLoading(false);
      navigate('/gantchart',{state:{sprints: response?.data,
        projectName: projectName
      }});
    } catch (error) {
      
    }
  }

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
              </div>

              {/* Edit & Delete Buttons */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleGantChartGenration(project.projectId,project.projectName)}
                  className="flex items-center justify-center p-2 h-10 rounded-full bg-white text-[#23486A] hover:bg-gray-200 mr-3"
                  disabled={loading}
                >
                  {!loading? "GantChartt": "GanttChart...."}
                </button>
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
              <button
                onClick={()=>goToSprintsPage(project.projectId)}
                className="leading-relaxed text-base mb-2 underline decoration-1"
              >
                Click Here To View SprintsPage
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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

      {/* Edit Project Modal */}
      {showEditModal && projectToEdit && (
        <EditProject 
          project={projectToEdit} 
          onClose={handleCloseEditModal} 
          setSuccessMessage={setSuccessMessage}
          organizationName={organizationName}
          setIsProjectUpdated={setIsProjectUpdated}
        />
      )}
    </div>
  );
};

// Create a new EditProject component based on the CreateProject component
const EditProject = ({ project, onClose, setSuccessMessage, organizationName, setIsProjectUpdated }) => {
  const [projectName, setProjectName] = useState(project.projectName || "");
  const [projectDescription, setProjectDescription] = useState(project.projectDescription || "");
  const [projectStatus, setProjectStatus] = useState(project.projectStatus || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [localSuccessMessage, setLocalSuccessMessage] = useState("");

  const handleSubmit = async () => {
    setErrorMessage("");
    setLocalSuccessMessage("");

    if (!organizationName) {
      setErrorMessage("Organization name is missing!");
      return;
    }

    if (!projectName || !projectDescription || !projectStatus) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      // Use the project ID from the project being edited
      const response = await api.put(
        `/api/v1/projects/${project.projectId}`,
        { projectName, projectDescription, projectStatus }
      );
      
      setLocalSuccessMessage("Project updated successfully!");
      setSuccessMessage("Project updated successfully!");
      setIsProjectUpdated(true);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("API Error:", error.response?.data);
      setErrorMessage(error.response?.data?.message || "Error updating project.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full font-[Poppins] z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h1 className="text-center font-bold text-xl">Edit Project</h1>

        <div className="text-center mt-5">
          <label>Please update project details</label>
        </div>

        <div className="flex flex-col items-center mt-6 gap-3">
          {[
            { label: "Project Name", type: "text", value: projectName, setter: setProjectName },
            { label: "Project Description", type: "textarea", value: projectDescription, setter: setProjectDescription },
          ].map(({ label, type, value, setter }, index) => (
            <div key={index} className="flex flex-col w-96">
              <label className="text-left font-semibold">{label}</label>
              {type === "text" ? (
                <input
                  type="text"
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 rounded-md"
                />
              ) : (
                <textarea
                  placeholder={`Enter ${label.toLowerCase()}`}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="mt-2 p-3 border border-gray-300 rounded-md resize-none"
                  rows="4"
                />
              )}
            </div>
          ))}

          <div className="flex flex-col w-96">
            <label className="text-left font-semibold">Project Status</label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value)}
              className="mt-2 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none w-full"
            >
              <option value="">Select Status</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 text-red-600 font-semibold text-center">
            {errorMessage}
          </div>
        )}

        {localSuccessMessage && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            {localSuccessMessage}
          </div>
        )}

        <div className="flex justify-end mt-7 space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
            Cancel
          </button>
          <button
            className="bg-[#EFB036] text-white px-4 py-2 rounded-lg"
            onClick={handleSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Organization;
import { useState } from "react";
import api from "../../utils/api";

const CreateProject = ({ organizationName, onClose, onSuccess }) => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStatus, setProjectStatus] = useState(" ");

    const handleSubmit = async () => {
        if (!projectName.trim() || !projectDescription.trim()) {
            alert("Please enter all project details!");
            return;
        }

        try {
            const response = await api.post(`/api/v1/projects/${organizationName}`, {
                projectName,
                projectDescription,
                projectStatus,
            });

            if (response.status === 200 || response.status === 201) {
                alert("Project Created Successfully!");
                setProjectName("");
                setProjectDescription("");
                setProjectStatus("PLANNED");
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full font-[Poppins]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h1 className="text-center font-bold text-xl">Create Project</h1>

                <div className="text-center mt-5">
                    <label>Please provide project details here</label>
                </div>

                <div className="flex flex-col items-center mt-6 gap-3">
                    {/* Project Name */}
                    <div className="flex flex-col w-96">
                        <label className="text-left font-semibold">Project Name</label>
                        <input
                            type="text"
                            placeholder="Enter project name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="mt-2 p-3 border rounded-md"
                        />
                    </div>

                    {/* Project Description */}
                    <div className="flex flex-col w-96">
                        <label className="text-left font-semibold">Project Description</label>
                        <textarea
                            placeholder="Enter project description"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            className="mt-2 p-3 border rounded-md resize-none"
                            rows="4"
                        />
                    </div>

                    {/* Project Status Dropdown */}
                    <div className="flex flex-col w-96">
                        <label className="text-left font-semibold">Project Status</label>
                        <select
                            value={projectStatus}
                            onChange={(e) => setProjectStatus(e.target.value)}
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-300 outline-none w-full"
                            placeholder="select your status"
                        >
                            <option value="">select  status</option>
                            <option value="PLANNED">Planned</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="ON_HOLD">On Hold</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end mt-7 space-x-2">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button className="bg-[#EFB036] text-white px-4 py-2 rounded-lg" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;

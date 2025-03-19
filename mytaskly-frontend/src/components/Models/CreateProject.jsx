import { useContext, useState } from "react";
import api from "../../utils/api";
import { OrganizationContext } from "../../context/OrganizationContext";
import { UserContext } from "../../context/UserContext";

const CreateProject = ({ onClose }) => {
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {organizationName} = useContext(OrganizationContext);
    const {setIsProjectUpdated} = useContext(UserContext);

    const handleSubmit = async () => {
        setSuccessMessage("");
        setErrorMessage("");

        if (!organizationName) {
            setErrorMessage("Organization name is missing in the URL!");
            return;
        }

        if (!projectName || !projectDescription || !projectStatus) {
            setErrorMessage("All fields are required.");
            return;
        }

        try {
            const response = await api.post(
                `/api/v1/projects/${organizationName}`,
                { projectName, projectDescription, projectStatus }
            );
            setIsProjectUpdated(true);
            setSuccessMessage("Project created successfully!");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error("API Error:", error.response?.data); // Debugging log
            setErrorMessage(error.response?.data?.message || "Error creating project.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 w-full font-[Poppins]">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h1 className="text-center font-bold text-xl">Create Project</h1>

                <div className="text-center mt-5">
                    <label>Please provide project details here</label>
                </div>

                {/* Show error if organization name is missing */}
                {!organizationName && (
                    <div className="mt-4 text-red-600 font-semibold text-center">
                        Organization name is missing in the URL.
                    </div>
                )}

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

                {successMessage && (
                    <div className="mt-4 text-green-600 font-semibold text-center">
                        {successMessage}
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
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProject;

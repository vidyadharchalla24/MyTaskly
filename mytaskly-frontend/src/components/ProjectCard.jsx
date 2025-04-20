// components/ProjectCard.jsx
import React, { useEffect } from "react";
import { FaChartBar, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

const ProjectCard = ({
  project,
  index,
  onEdit,
  onDeleteClick,
  onGanttChart,
  onViewSprints,
  onCollaborators,
  loading,
  role,
}) => {
    // useEffect(()=>{
    //  console.log(role);   
    // },[])
  return (
    <div
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

      {/* Action Buttons */}
      <div className="flex justify-center mt-6 space-x-3">
        <button
          onClick={() => onGanttChart(project.projectId, project.projectName)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#23486A] border border-gray-300 shadow-sm hover:bg-gray-100 transition"
          disabled={loading}
          title="Gantt Chart"
        >
          <FaChartBar size={16} />
        </button>

        {!role && (
          <>
            <button
              onClick={() => onCollaborators(project.projectId)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#23486A] border border-gray-300 shadow-sm hover:bg-gray-100 transition"
              title="Collaborators"
            >
              <FaUsers size={16} />
            </button>
            <button
              onClick={() => onEdit(project.projectId)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#23486A] border border-gray-300 shadow-sm hover:bg-gray-100 transition"
              title="Edit Project"
            >
              <FaEdit size={16} />
            </button>

            <button
              onClick={() => onDeleteClick(project.projectId)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-red-600 border border-gray-300 shadow-sm hover:bg-gray-100 transition"
              title="Delete Project"
            >
              <FaTrash size={16} />
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => onViewSprints(project.projectId,role)}
        className="leading-relaxed text-base mb-2 underline decoration-1"
      >
        Click Here To View SprintsPage
      </button>
    </div>
  );
};

export default ProjectCard;

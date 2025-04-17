import React, { useEffect, useState } from "react";
import CollaboratorDropdown from "../collaborators/CollaboratorDropdown";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/api";

const CreateIssue = ({ projectId, isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [issueData, setIssueData] = useState(null);
  const navigate = useNavigate();

  const { editProjectId, issueId } = useParams();
  // Fetch issue if editing
  useEffect(() => {
    const fetchIssue = async () => {
      if (!issueId) return;

      try {
        const response = await api.get(`/api/v1/issues/${issueId}`);
        const issue = response?.data;
        setIssueData(issue);
        setTitle(issue.title || "");
        setAssignee(issue.assigneeEmail || "");
        setDescription(issue.description || "");
        setPriority(issue.issuePriority || "MEDIUM");
      } catch (error) {
        console.error("Failed to fetch issue data", error);
      }
    };

    fetchIssue();
  }, []);

  if (!isOpen && !issueId) return null;

  const resetForm = () => {
    setTitle("");
    setAssignee("");
    setDescription("");
    setPriority("MEDIUM");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }

    onSubmit({
      title,
      assignee,
      description,
      priority,
    });

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleCancelEdit = () => {
    resetForm();
    navigate(-1);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const response = await api.put(`/api/v1/issues/updateIssue/${issueId}`, {
        title: title,
        description: description,
        issuePriority: priority,
        assigneeEmail: assignee,
        reporterEmail: issueData?.reporterEmail,
        issueStatus: issueData?.issueStatus,
        projectId: projectId,
      });
      // console.log("edit response", response);
      navigate(`/SprintsPage/${editProjectId}`);
    } catch (error) {
      console.error("Failed to update issue", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {issueId ? "Edit Issue" : "Create Issue"}
        </h2>

        <form onSubmit={!issueId ? handleSubmit : handleEditSubmit}>
          {/* Title */}
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
            placeholder="Enter issue title"
            required
          />

          {/* Assignee */}
          <label className="block text-gray-700 font-medium">Assignee</label>
          <CollaboratorDropdown
            projectId={projectId || editProjectId}
            value={assignee}
            onChange={setAssignee}
          />

          {/* Description */}
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
            placeholder="Enter issue description"
            required
          ></textarea>

          {/* Priority */}
          <label className="block text-gray-700 font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4 focus:ring focus:ring-blue-300"
          >
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={issueId ? handleCancelEdit : handleCancel}
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateIssue;

import React, { useState } from "react";

const CreateIssue = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  
  if (!isOpen) return null;

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
    onSubmit({ title, assignee, description, priority });
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Issue</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
            placeholder="Enter issue title"
            required
          />

          {/* Assignee Field */}
          <label className="block text-gray-700 font-medium">Assignee</label>
          <input
            type="text"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
            placeholder="Assign to"
          />

          {/* Description Field */}
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-3 focus:ring focus:ring-blue-300"
            placeholder="Enter issue description"
            required
          ></textarea>

          {/* Priority Dropdown */}
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

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
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

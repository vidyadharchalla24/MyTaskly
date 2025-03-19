import React, { useState } from "react";

const CreateIssue = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
        <h2 className="text-xl font-bold mb-4">Create Issue</h2>

        {/* Title Field */}
        <label className="block text-gray-700 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3 outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter issue title"
        />

        {/* Assignee Field */}
        <label className="block text-gray-700 font-medium">Assignee</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3 outline-none focus:ring focus:ring-blue-300"
          placeholder="Assign to"
        />

        {/* Description Field */}
        <label className="block text-gray-700 font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-3 outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter issue description"
        ></textarea>

        {/* Priority Dropdown */}
        <label className="block text-gray-700 font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4 outline-none focus:ring focus:ring-blue-300"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onSubmit({ title, assignee, description, priority })}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssue;

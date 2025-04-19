import React, { useState } from "react";

const CommentModal = ({ isOpen, onClose, issue, onSubmit }) => {
  const [commentText, setCommentText] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (commentText.trim()) {
      onSubmit(commentText, file);
      setCommentText("");
      setFile(null);
      onClose();
    } else {
      alert("Comment cannot be empty.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        <h2 className="text-lg font-semibold mb-3">Comment on: {issue?.title}</h2>

        <label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-1 block">
          Your Comment
        </label>
        <textarea
          id="comment"
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 text-sm text-gray-800 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-3"
        />

        <label htmlFor="file_input" className="text-sm font-medium text-gray-700 block mb-1">
          Upload File (optional)
        </label>
        <input
          type="file"
          id="file_input"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-md bg-gray-50 p-2 mb-4"
        />

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#EFB036] text-white rounded-md hover:bg-[#dfa127]"
          >
            Submit
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CommentModal;

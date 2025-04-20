import { useEffect, useState } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../utils/api";

const ViewCommentsModal = ({
  isOpen,
  onClose,
  issueId,
  issueTitle,
  isRoleFalse,
}) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/api/v1/comments/all-comments/${issueId}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/api/v1/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      toast.success("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  useEffect(() => {
    if (isOpen) fetchComments();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <FiX size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{issueTitle} Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments available.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li
                key={comment.commentId}
                className="bg-gray-100 p-3 rounded-md relative"
              >
                <div className="flex items-center gap-3 mb-1">
                  {comment.imageUrl ? (
                    <img
                      src={comment.imageUrl}
                      alt={comment.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                      {comment.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-sm">{comment.name}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{comment.content}</p>
                {comment.fileUrl && (
                  <a
                    href={comment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline"
                  >
                    View Attachment
                  </a>
                )}
                {isRoleFalse && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewCommentsModal;

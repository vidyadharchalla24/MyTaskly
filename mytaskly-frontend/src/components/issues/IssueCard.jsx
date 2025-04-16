const IssueCard = ({ issue }) => {
  const cardClasses = `relative bg-white p-4 rounded-lg shadow-md cursor-pointer`;
  let priorityColor = "bg-gray-300"; // Default gray if no priority
  if (issue.priority === "HIGH") {
    priorityColor = "bg-red-500"; // High -> Red
  } else if (issue.priority === "MEDIUM") {
    priorityColor = "bg-yellow-500"; // Medium -> Yellow
  } else if (issue.priority === "LOW") {
    priorityColor = "bg-green-500"; // Low -> Green
  }

  return (
    <div className={cardClasses}>
      <span
        className={`absolute top-2 right-2 w-3 h-3 rounded-full ${priorityColor}`}
      ></span>

      <h4 className="font-semibold">{issue?.title}</h4>
      <p className="text-gray-600">Assigned to: {issue?.reporter?.email}</p>
      <p className="text-gray-500 text-sm">{issue?.description}</p>
      <p className="text-gray-600">{issue?.issuePriority}</p>
    </div>
  );
};

export default IssueCard;

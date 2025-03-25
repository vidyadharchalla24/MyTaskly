import React, { useContext, useEffect, useState } from 'react';
import {
    DndContext,
    closestCorners,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CreateIssue from './Models/CreateIssue';
import { ProjectsContext } from '../context/ProjectsContext';
import api from '../utils/api';
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Import icons


// Sprint status enum
const SprintStatus = {
    NOT_STARTED: 'NOT_STARTED',
    ACTIVE: 'ACTIVE',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
};

export const SprintsPage = () => {
    const [sprintName, setSprintName] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeId, setActiveId] = useState(null);
    const [activeIssue, setActiveIssue] = useState(null);
    const [sprints, setSprints] = useState([]);
    const [activeSprint, setActiveSprint] = useState(null);
    const { projectId, setSprintsUpdates, sprintsUpdates } = useContext(ProjectsContext);

    useEffect(() => {
        if (projectId) {
            fetchSprints();
            console.log(projectId);
            setSprintsUpdates(false);
        }
        console.log(projectId);
    }, [projectId, sprintsUpdates]);

    const fetchSprints = async () => {
        try {
            const response = await api.get(`/api/v1/sprints/project/${projectId}`);
            // Map the response data to include the status property if it doesn't exist
            const updatedSprints = response?.data.map(sprint => ({
                ...sprint,
                status: sprint.status || SprintStatus.NOT_STARTED
            }));
            setSprints(updatedSprints);
            console.log(updatedSprints);
        } catch (err) {
            console.log(err.response?.message);
        }
    }

    // Configure sensors for drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Columns to store issues
    const [columns, setColumns] = useState({
        todo: [],
        inProgress: [],
        inReview: [],
        done: [],
    });

    // Handle issue submission
    const handleSubmitIssue = (issueData) => {
        const newIssue = {
            ...issueData,
            id: `issue-${Date.now()}`,
            columnId: 'todo',
            sprintId: activeSprint ? activeSprint.sprintId : null
        };
        setColumns(prev => ({
            ...prev,
            todo: [...prev.todo, newIssue]
        }));
        setIsModalOpen(false);
    };

    // Handle sprint creation
    const handleCreateSprint = async () => {
        if (sprintName && startDate && endDate) {
            try {
                const response = await api.post(`/api/v1/sprints/${projectId}`,
                    {
                        sprintName,
                        startDate,
                        endDate,
                        status: SprintStatus.NOT_STARTED
                    }
                );
                console.log(response?.data);
                setSprintsUpdates(true);
                if (!activeSprint) {
                    setActiveSprint(response?.data);
                }

                // Reset form
                setSprintName('');
                setStartDate(new Date().toISOString().split('T')[0]);
                setEndDate('');
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill all sprint details");
        }
    };

    // Start a sprint
    const handleStartSprint = (sprintId) => {
        setSprints(prev =>
            prev.map(sprint =>
                sprint.sprintId === sprintId
                    ? { ...sprint, status: SprintStatus.ACTIVE }
                    : sprint
            )
        );

        // If this is the active sprint, update it too
        if (activeSprint && activeSprint.sprintId === sprintId) {
            setActiveSprint(prev => ({ ...prev, status: SprintStatus.ACTIVE }));
        }
    };

    // End a sprint
    const handleEndSprint = (sprintId) => {
        setSprints(prev =>
            prev.map(sprint =>
                sprint.sprintId === sprintId
                    ? { ...sprint, status: SprintStatus.COMPLETED }
                    : sprint
            )
        );

        // If this is the active sprint, update it too
        if (activeSprint && activeSprint.sprintId === sprintId) {
            setActiveSprint(prev => ({ ...prev, status: SprintStatus.COMPLETED }));
        }
    };

    // Cancel a sprint
    const handleCancelSprint = (sprintId) => {
        setSprints(prev =>
            prev.map(sprint =>
                sprint.sprintId === sprintId
                    ? { ...sprint, status: SprintStatus.CANCELLED }
                    : sprint
            )
        );

        // If this was the active sprint, set activeSprint to null
        if (activeSprint && activeSprint.sprintId === sprintId) {
            setActiveSprint(null);
        }
    };

    // Set a sprint as active
    const handleSetActiveSprint = (sprint) => {
        setActiveSprint(sprint);
    };

    // Find the column that contains an issue
    const findColumnOfIssue = (id) => {
        for (const [columnId, issues] of Object.entries(columns)) {
            if (issues.find(issue => issue.id === id)) {
                return columnId;
            }
        }
        return null;
    };

    // Handle drag start
    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);

        // Find the issue being dragged
        const columnId = findColumnOfIssue(active.id);
        if (columnId) {
            const issue = columns[columnId].find(item => item.id === active.id);
            setActiveIssue(issue);
        }
    };

    // Handle drag end
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            setActiveIssue(null);
            return;
        }

        // Find source column
        const sourceColumnId = findColumnOfIssue(active.id);

        // Determine target column - check if over.id is a column id or an issue id
        let targetColumnId;

        // If dropped directly over a column
        if (Object.keys(columns).includes(over.id)) {
            targetColumnId = over.id;
        } else {
            // If dropped over another issue, find its column
            targetColumnId = findColumnOfIssue(over.id);
        }

        // If we have valid source and target, and they're different
        if (sourceColumnId && targetColumnId) {
            setColumns(prev => {
                // Copy the current state
                const newColumns = { ...prev };

                // Find the issue to move
                const issueToMove = newColumns[sourceColumnId].find(
                    issue => issue.id === active.id
                );

                if (!issueToMove) return prev;

                // Remove from source column
                newColumns[sourceColumnId] = newColumns[sourceColumnId].filter(
                    issue => issue.id !== active.id
                );

                // Add to target column
                newColumns[targetColumnId] = [...newColumns[targetColumnId], issueToMove];

                return newColumns;
            });
        } else if (sourceColumnId === targetColumnId) {
            // Handle reordering within same column
            // For simplicity, not implementing this part since focus is on cross-column movement
        }

        setActiveId(null);
        setActiveIssue(null);
    };

    // Get button text and action based on sprint status
    const getSprintActionButton = (sprint) => {
        switch (sprint.status) {
            case SprintStatus.NOT_STARTED:
                return {
                    text: 'Start Sprint',
                    action: () => handleStartSprint(sprint.sprintId),
                    className: 'bg-green-500 text-white hover:bg-green-600'
                };
            case SprintStatus.ACTIVE:
                return {
                    text: 'End Sprint',
                    action: () => handleEndSprint(sprint.sprintId),
                    className: 'bg-red-500 text-white hover:bg-red-600'
                };
            case SprintStatus.COMPLETED:
                return {
                    text: 'Completed',
                    action: null,
                    className: 'bg-gray-400 cursor-not-allowed'
                };
            case SprintStatus.CANCELLED:
                return {
                    text: 'Cancelled',
                    action: null,
                    className: 'bg-gray-400 cursor-not-allowed'
                };
            default:
                return {
                    text: 'Start Sprint',
                    action: () => handleStartSprint(sprint.sprintId),
                    className: 'bg-green-500 text-white hover:bg-green-600'
                };
        }
    };

    // Get sprint status badge component
    const getSprintStatusBadge = (status) => {
        let badgeClass = '';
        let text = '';

        switch (status) {
            case SprintStatus.NOT_STARTED:
                badgeClass = 'bg-yellow-100 text-yellow-800';
                text = 'Not Started';
                break;
            case SprintStatus.ACTIVE:
                badgeClass = 'bg-green-100 text-green-800';
                text = 'Active';
                break;
            case SprintStatus.COMPLETED:
                badgeClass = 'bg-blue-100 text-blue-800';
                text = 'Completed';
                break;
            case SprintStatus.CANCELLED:
                badgeClass = 'bg-red-100 text-red-800';
                text = 'Cancelled';
                break;
            default:
                badgeClass = 'bg-gray-100 text-gray-800';
                text = 'Unknown';
        }

        return (
            <span className={`${badgeClass} px-3 py-1 rounded-full text-sm font-medium`}>
                {text}
            </span>
        );
    };

    return (
        <div className="text-[Poppins] p-6">
            <div className="bg-[#3B6790] p-6 rounded-lg shadow-md w-full relative text-white">
                <h1 className="text-2xl font-bold mb-4">Create Sprint</h1>

                <div className="flex items-center text-white font[-Poppins] gap-4 mb-4">
                    <div className="w-1/3">
                        <label className="block  font-medium mb-1">Sprint Name</label>
                        <input
                            type="text"
                            value={sprintName}
                            onChange={(e) => setSprintName(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                            placeholder="Enter Sprint Name"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block font-medium mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                            min={new Date().toISOString().split('T')[0]}
                           
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="block  font-medium mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                            min={startDate}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleCreateSprint}
                        className="bg-[#EFB036] text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Create Sprint
                    </button>
                </div>
            </div>

            {/* Sprint List */}
            {sprints.length > 0 && (
                <div className="mt-6 bg-white font-[Poppins] p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-bold mb-4">Sprints</h2>
                    <div className="space-y-4">
                        {sprints.map(sprint => {
                            const actionButton = getSprintActionButton(sprint);
                            return (
                                <div key={sprint.sprintId}
                                    className={`p-4 rounded-lg shadow-md border ${activeSprint?.sprintId === sprint.sprintId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">Sprint: {sprint.sprintName}</h3>
                                            <p className="text-gray-600">
                                                {sprint.startDate} to {sprint.endDate}
                                            </p>
                                            <div className="mt-2">
                                                {getSprintStatusBadge(sprint.status)}
                                            </div>
                                        </div>
                                        <div className='flex justify-center'>
                                            {/* Edit and Delete icons */}
                                            <button

                                                className="p-2 rounded-full transition text-blue-500 hover:bg-blue-100"
                                                title="Edit Sprint"
                                            >
                                                <FiEdit size={20} />
                                            </button>
                                            <button

                                                className="text-red-500 hover:bg-red-100"
                                                title="Delete Sprint"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>

                                        </div>
                                        <div className="flex gap-2">
                                            {activeSprint?.sprintId === sprint.sprintId ? (
                                                <button
                                                    onClick={() => handleCancelSprint(sprint.sprintId)}
                                                    disabled={sprint.status === SprintStatus.COMPLETED || sprint.status === SprintStatus.CANCELLED}
                                                    className={`font-bold py-2 px-4 rounded-lg transition 
                                                    ${sprint.status === SprintStatus.COMPLETED || sprint.status === SprintStatus.CANCELLED ?
                                                            "bg-gray-400 cursor-not-allowed" :
                                                            "bg-yellow-500 text-white hover:bg-yellow-600"}`}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleSetActiveSprint(sprint)}
                                                    disabled={sprint.status === SprintStatus.COMPLETED || sprint.status === SprintStatus.CANCELLED}
                                                    className={`font-bold py-2 px-4 rounded-lg transition 
                                                    ${sprint.status === SprintStatus.COMPLETED || sprint.status === SprintStatus.CANCELLED ?
                                                            "bg-gray-400 cursor-not-allowed" :
                                                            "bg-gray-200 hover:bg-gray-300"}`}
                                                >
                                                    Set Active
                                                </button>
                                            )}

                                            <button
                                                onClick={actionButton.action}
                                                disabled={!actionButton.action}
                                                className={`font-bold py-2 px-4 rounded-lg transition ${actionButton.className}`}
                                            >
                                                {actionButton.text}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mt-6 bg-[#23486A] font-[Poppins]  p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-bold mb-4 text-white">Issues</h2>

                {/* Active Sprint Info */}
                {activeSprint && (
                    <div className="bg-blue-50 p-4 rounded-lg shadow-md mb-6 border border-blue-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Active Sprint: {activeSprint.sprintName}</h3>
                                <p className="text-gray-600">
                                    {activeSprint.startDate} to {activeSprint.endDate}
                                </p>
                            </div>
                            <div>
                                {getSprintStatusBadge(activeSprint.status)}
                            </div>
                        </div>
                    </div>
                )}

                {/* DragDrop Context */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.keys(columns).map((columnId) => (
                            <DroppableColumn
                                key={columnId}
                                id={columnId}
                                title={columnId === "todo" ? "To Do" :
                                    columnId === "inProgress" ? "In Progress" :
                                        columnId === "inReview" ? "In Review" : "Done"}
                                issues={columns[columnId].filter(issue =>
                                    !issue.sprintId || issue.sprintId === activeSprint?.sprintId
                                )}
                                setIsModalOpen={setIsModalOpen}
                                isCreateEnabled={!!activeSprint && activeSprint.status === SprintStatus.ACTIVE}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeId && activeIssue ? (
                            <IssueCard
                                issue={activeIssue}
                                isOverlay={true}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>

            {/* Issue Creation Modal */}
            <CreateIssue
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmitIssue}
            />
        </div>
    );
};

const DroppableColumn = ({ id, title, issues, setIsModalOpen, isCreateEnabled = true }) => {
    const { isOver, setNodeRef } = useSortable({
        id,
        data: {
            type: 'column',
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-gray-100 font[#Poppins] p-4 rounded-lg shadow-md min-h-[200px] 
                      ${isOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
        >
            <h3 className="text-lg font-semibold mb-2">{title}</h3>

            {id === "todo" && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={!isCreateEnabled}
                    className={`font-bold  bg-[#EFB036]  py-2 px-4 rounded-lg transition w-full
                    ${!isCreateEnabled ? 'bg-[#EFB036]  cursor-not-allowed' : 'bg-[#EFB036] text-white '}`}
                >
                    Create Issue
                </button>
            )}

            <div className="mt-4 space-y-2">
                {issues.map((issue) => (
                    <DraggableIssue
                        key={issue.id}
                        issue={issue}
                        setIsModalOpen={setIsModalOpen} 
                    />
                ))}
            </div>
        </div>
    );
};

const DraggableIssue = ({ issue,setIsModalOpen  }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: issue.id,
        data: {
            type: 'issue',
            issue,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
        >
            <h4 className="font-semibold">{issue.title}</h4>
            <p className="text-gray-600">Assigned to: {issue.assignee}</p>
            <p className="text-gray-500 text-sm">{issue.description}</p>
            <p className="text-gray-500 text-sm">{issue.priority}</p>
            <div className='flex justify-center'>
                {/* Edit and Delete icons */}
                <button

                    className="p-2 rounded-full transition text-blue-500 hover:bg-blue-100"
                    title="Edit Sprint"
                    onClick={() => setIsModalOpen(true)} 
               
                    
                >
                    <FiEdit size={20} />
                </button>
                <button

                    className="text-red-500 hover:bg-red-100"
                    title="Delete Sprint"
                >
                    <FiTrash2 size={20} />
                </button>

            </div>
        </div>
    );
};

const IssueCard = ({ issue }) => {
    const cardClasses = `relative bg-white p-4 rounded-lg shadow-md cursor-pointer`;
    let priorityColor = "bg-gray-300"; // Default gray if no priority
    if (issue.priority === "High") {
        priorityColor = "bg-red-500"; // High -> Red
    } else if (issue.priority === "Medium") {
        priorityColor = "bg-yellow-500"; // Medium -> Yellow
    } else if (issue.priority === "Low") {
        priorityColor = "bg-green-500"; // Low -> Green
    }

    return (
        <div className={cardClasses}>
            <span
                className={`absolute top-2 right-2 w-3 h-3 rounded-full ${priorityColor}`}
            ></span>

            <h4 className="font-semibold">{issue.title}</h4>
            <p className="text-gray-600">Assigned to: {issue.assignee}</p>
            <p className="text-gray-500 text-sm">{issue.description}</p>
            <p className='text-gray-600'>{issue.priority}</p>

        </div>
    );
};
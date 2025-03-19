import React, { useState } from 'react';
import CreateIssue from './Models/CreateIssue';

export const SprintsPage = () => {
    const [sprintName, setSprintName] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sprintCreated, setSprintCreated] = useState(false);
    const [sprintStarted, setSprintStarted] = useState(false);
    const [issues, setIssues] = useState([]); // Store created issues

    const handleCreateSprint = () => {
        setSprintCreated(true);
    };

    const handleStartSprint = () => {
        setSprintStarted(true);
    };

    const handleSubmitIssue = (issueData) => {
        setIssues([...issues, issueData]); // Add new issue to state
        setIsModalOpen(false);
    };

    return (
        <div className="text[-Poppins]">
            <div className="p-6">
                <div className="bg-white p-6 rounded-lg shadow-md w-full relative">
                    <button
                        onClick={sprintCreated ? handleStartSprint : handleCreateSprint}
                        disabled={sprintStarted}
                        className={`absolute top-0 right-0 mt-2 mr-2 font-bold py-2 px-4 rounded-lg transition
                        ${sprintStarted ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                    >
                        {sprintStarted ? "Sprint In Progress" : sprintCreated ? "Start Sprint" : "Create Sprint"}
                    </button>

                    <h1 className="text-2xl font-bold mb-4">Create Sprint</h1>

                    <div className="flex items-center gap-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-1">Sprint Name</label>
                            <input
                                type="text"
                                value={sprintName}
                                onChange={(e) => setSprintName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                                placeholder="Enter Sprint Name"
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-gray-700 font-medium mb-1">Sprint Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-bold mb-4">Issues</h2>

                    <div className="grid grid-cols-4 gap-4">
                        {/* To Do Column */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">To Do</h3>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition w-full"
                            >
                                Create Issue
                            </button>

                            {/* Render created issues */}
                            <div className="mt-4">
                                {issues.map((issue, index) => (
                                    <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-2">
                                        <h4 className="font-semibold">{issue.title}</h4>
                                        <p className="text-gray-600">Assigned to: {issue.assignee}</p>
                                        <p className="text-gray-500 text-sm">{issue.description}</p>
                                        <p className={`mt-2 px-2 py-1 rounded text-white w-max
                                            ${issue.priority === "High" ? "bg-red-500" :
                                                issue.priority === "Medium" ? "bg-yellow-500" :
                                                    "bg-green-500"}`}>
                                            {issue.priority} Priority
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other Columns */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">In Review</h3>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Done</h3>
                        </div>
                    </div>
                </div>
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

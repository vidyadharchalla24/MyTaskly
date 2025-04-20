import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../../utils/api';
import { userDetailsFromToken } from '../../utils/userDetailsFromToken';
import { FiX, FiClock, FiCalendar, FiAlertCircle, FiCheckCircle, FiPauseCircle } from 'react-icons/fi';

const localizer = momentLocalizer(moment);

const SprintDetailsModal = ({ sprint, onClose }) => {
    const [issueFilter, setIssueFilter] = useState('ALL');
  
    const getStatusIcon = () => {
      switch (sprint.status) {
        case 'ACTIVE': return <FiClock className="text-yellow-500" />;
        case 'COMPLETED': return <FiCheckCircle className="text-green-500" />;
        case 'PLANNED': return <FiCalendar className="text-blue-500" />;
        case 'CANCELLED': return <FiAlertCircle className="text-red-500" />;
        default: return <FiPauseCircle className="text-gray-500" />;
      }
    };
  
    const issueStatusClasses = {
      TO_DO: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      DONE: 'bg-green-100 text-green-800',
      REVIEW: 'bg-purple-100 text-purple-800',
    };
  
    const filteredIssues =
      issueFilter === 'ALL'
        ? sprint.issues
        : sprint.issues.filter(issue => issue.issueStatus === issueFilter);
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{sprint.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Sprint Details</h3>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  {getStatusIcon()}
                  <span className="capitalize">{sprint.status.toLowerCase()}</span>
                </p>
                <p><span className="font-medium">Start Date:</span> {moment(sprint.start).format('MMM D, YYYY')}</p>
                <p><span className="font-medium">End Date:</span> {moment(sprint.end).format('MMM D, YYYY')}</p>
                <p><span className="font-medium">Duration:</span> {moment(sprint.end).diff(sprint.start, 'days')} days</p>
              </div>
            </div>
          </div>
  
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-3">Issues ({filteredIssues.length})</h3>
  
            {/* Issue Status Filter */}
            <div className="flex flex-wrap gap-2 mb-3">
              {['ALL', 'TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map(status => (
                <button
                  key={status}
                  onClick={() => setIssueFilter(status)}
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    issueFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
  
            {filteredIssues.length > 0 ? (
              <div className="space-y-3">
                {filteredIssues.map(issue => (
                  <div key={issue.issueId} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{issue.title}</h4>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        issueStatusClasses[issue.issueStatus] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {issue.issueStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <span className="mr-3">Priority: {issue.issuePriority}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No issues with selected status</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  

const CalendarPopup = ({ onClose }) => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedSprint, setSelectedSprint] = useState(null);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const userId = userDetailsFromToken()?.user_id;
        const response = await api.get(`/api/v1/sprints/user/${userId}`);
        setSprints(response?.data);
      } catch (error) {
        console.error('Error fetching sprints:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSprints();
  }, []);

  const handleEventClick = (event) => {
    setSelectedSprint({
      title: event.title,
      status: event.resource.status,
      start: event.start,
      end: event.end,
      description: event.resource.description,
      issues: event.resource.issues
    });
  };

  const CustomToolbar = (toolbar) => {
    return (
      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
        <div className="flex gap-2">
          <button onClick={() => toolbar.onNavigate('TODAY')} className="bg-blue-500 text-white px-3 py-1 rounded">Today</button>
          <button onClick={() => toolbar.onNavigate('PREV')} className="bg-gray-300 px-2 rounded">◀</button>
          <button onClick={() => toolbar.onNavigate('NEXT')} className="bg-gray-300 px-2 rounded">▶</button>
        </div>
        <h2 className="font-semibold text-lg">{toolbar.label}</h2>
        <div className="flex gap-2">
          <button onClick={() => toolbar.onView('month')} className="bg-gray-200 px-3 py-1 rounded">Month</button>
          <button onClick={() => toolbar.onView('week')} className="bg-gray-200 px-3 py-1 rounded">Week</button>
          <button onClick={() => toolbar.onView('day')} className="bg-gray-200 px-3 py-1 rounded">Day</button>
        </div>
      </div>
    );
  };

  const events = sprints.map(sprint => ({
    id: sprint.sprintId,
    title: sprint.sprintName,
    start: new Date(sprint.startDate),
    end: new Date(sprint.endDate),
    allDay: true,
    resource: {
      status: sprint.sprintStatus,
      description: sprint.sprintDescription || '',
      issues: sprint.issues || []
    }
  }));

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.resource.status.toUpperCase() === filter.toUpperCase();
  });

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[90vh] overflow-auto shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sprint Calendar</h2>
            <button onClick={onClose} className="text-gray-500 text-2xl hover:text-gray-700">&times;</button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'ACTIVE', 'COMPLETED', 'PLANNED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading sprints...</p>
            </div>
          ) : (
            <div className="h-[600px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                defaultView="month"
                onSelectEvent={handleEventClick}
                components={{
                  toolbar: CustomToolbar
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: 
                      event.resource.status === 'ACTIVE' ? '#F59E0B' :
                      event.resource.status === 'COMPLETED' ? '#10B981' :
                      event.resource.status === 'PLANNED' ? '#3B82F6' :
                      '#9CA3AF',
                    borderColor: 'transparent',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '2px 4px'
                  }
                })}
              />
            </div>
          )}
        </div>
      </div>

      {selectedSprint && (
        <SprintDetailsModal 
          sprint={selectedSprint} 
          onClose={() => setSelectedSprint(null)} 
        />
      )}
    </>
  );
};

export default CalendarPopup;
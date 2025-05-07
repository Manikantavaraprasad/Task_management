'use client';

import React, { useState } from 'react';

interface TaskSearchProps {
  onSearch: (filters: {
    title?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    assigneeEmail?: string; // Add assigneeEmail to filters
  }) => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ onSearch }) => {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeEmail, setAssigneeEmail] = useState(''); // Add assigneeEmail state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ title, status, priority, dueDate, assigneeEmail }); // Include assigneeEmail in filters
  };

  const handleReset = () => {
    setTitle('');
    setStatus('');
    setPriority('');
    setDueDate('');
    setAssigneeEmail(''); // Reset assigneeEmail
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="Search by title..."
        className="p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select className="p-2 border rounded" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select className="p-2 border rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="">Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        className="p-2 border rounded"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      {/* Add assignee email input */}
      <input
        type="email"
        placeholder="Search by assignee email..."
        className="p-2 border rounded"
        value={assigneeEmail}
        onChange={(e) => setAssigneeEmail(e.target.value)}
      />

      <div className="md:col-span-4 flex justify-end space-x-2 mt-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
        <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default TaskSearch;
'use client';

import React, { useState } from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee?: { email: string; fullName: string } | null;
  creator: { email: string; fullName: string };
  createdAt: string;
}

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updatedData: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Partial<Task>>({});

  const handleEdit = (task: Task) => {
    setEditingTask(task._id);
    setEditedData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleUpdateClick = async (id: string) => {
    await onUpdate(id, editedData);
    setEditingTask(null);
    setEditedData({});
  };

  if (!tasks.length) return <p className="text-gray-600">No tasks found.</p>;

  return (
    <ul className="list-none p-0">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="bg-white border border-gray-200 rounded-md shadow-sm mb-4 p-4 hover:shadow-md transition-shadow duration-200"
        >
          {editingTask === task._id ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedData.title || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editedData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={editedData.dueDate || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <select
                    name="priority"
                    value={editedData.priority || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={editedData.status || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => handleUpdateClick(task._id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
              <p className="text-gray-700">{task.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Status:</strong> {task.status}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Priority:</strong> {task.priority}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Assigned to:</strong> {task.assignee?.fullName || 'N/A'}
              </p>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onUpdate(task._id, { status: 'Completed' })}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Image from 'next/image';
import TaskForm from '../components/TaskFormProps';
import TaskList from '../components/TaskList';
import TaskSearch from '../components/TaskSearch';
import Swal from 'sweetalert2';

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

interface UserInfo {
  name: string;
  email: string;
}

interface JWTDecoded {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  iat: number;
  exp: number;
}

const getTasks = async (token: string, filters?: { title?: string; status?: string; priority?: string; dueDate?: string; assigneeEmail?: string }) => {
  try {
    const query = new URLSearchParams(filters as Record<string, string>).toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?${query}`, {
      headers: {
        'x-auth-token': token,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    const data = await response.json();
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

const DashboardPage: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JWTDecoded = jwtDecode(token);
        setUserInfo({ name: decoded.user.fullName, email: decoded.user.email });
        tokenRef.current = token;

        const fetchTasks = async () => {
          try {
            const allTasks = await getTasks(token);
            setTasks(allTasks);
            setFilteredTasks(allTasks);
          } catch (err) {
            console.error('Failed to fetch tasks:', err);
          }
        };

        fetchTasks();
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        router.push('/');
      }
    } else {
      router.push('/');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    router.push('/');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleCreate = async (newTaskData: Omit<Task, '_id' | 'createdAt' | 'creator'>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': tokenRef.current || '',
        },
        body: JSON.stringify({ ...newTaskData, creatorEmail: userInfo.email }),
      });

      if (!res.ok) throw new Error(`Failed to create task: ${res.status}`);

      const createdTask = await res.json();
      setTasks((prev) => [...prev, createdTask]);
      setFilteredTasks((prev) => [...prev, createdTask]);

      Swal.fire({ title: 'Success!', text: 'Task added successfully!', icon: 'success', confirmButtonText: 'Cool' });
    } catch (error) {
      console.error('Error creating task:', error);
      Swal.fire({ title: 'Error!', text: 'Failed to add task.', icon: 'error', confirmButtonText: 'Ok' });
    }
  };

  const handleUpdate = async (id: string, updatedData: Partial<Task>) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': tokenRef.current || '',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error(`Failed to update task: ${res.status}`);

      const updatedTask = await res.json();
      setTasks((prev) => prev.map((task) => (task._id === id ? { ...task, ...updatedTask } : task)));
      setFilteredTasks((prev) => prev.map((task) => (task._id === id ? { ...task, ...updatedTask } : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': tokenRef.current || '',
        },
      });

      if (!res.ok) throw new Error(`Failed to delete task: ${res.status}`);

      setTasks((prev) => prev.filter((task) => task._id !== id));
      setFilteredTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSearch = async (filters: { title?: string; status?: string; priority?: string; dueDate?: string; assigneeEmail?: string }) => {
    try {
      const tasks = await getTasks(tokenRef.current || '', filters);
      setFilteredTasks(tasks);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-teal-100 to-blue-100">
      <header className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-xl border-b">
        <div className="flex items-center gap-3">
          <Image src="/images/logo2.png" alt="Logo" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <h1 className="text-2xl font-semibold tracking-wide">Task Management System</h1>
        </div>
        <div className="relative">
          <button onClick={toggleDropdown} className="p-2 rounded-full hover:bg-teal-500 transition ease-in-out duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.236 0 4.318.538 6.121 1.488M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <div ref={dropdownRef} className={`absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 transition-all ${isDropdownOpen ? 'block' : 'hidden'}`}>
            <div className="py-2 px-4 overflow-hidden">
              <p className="text-gray-800 font-semibold break-words whitespace-normal">{userInfo.name}</p>
              <p className="text-gray-600 text-sm break-words whitespace-normal">{userInfo.email}</p>
            </div>
            <hr className="my-1" />
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100">Logout</button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className={`bg-gradient-to-b from-teal-600 to-blue-700 text-white shadow-xl transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-64 p-6' : 'w-16 p-2'}`}>
          <button onClick={toggleSidebar} className="mb-6 focus:outline-none">
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <ul className="space-y-4">
            {['dashboard', 'tasks', 'search'].map((section) => (
              <li key={section} className={`cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-teal-500 flex items-center ${activeSection === section ? 'bg-teal-500' : ''}`} onClick={() => handleSectionClick(section)}>
                {section === 'dashboard' && '📊'}
                {section === 'tasks' && '📝'}
                {section === 'search' && '🔍'}
                <span className={`${isSidebarOpen ? 'ml-4' : 'hidden'}`}>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {activeSection === 'dashboard' && (
            <>
              <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Overview</h1>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h2 className="text-lg font-bold text-teal-600 mb-2">Assigned to You</h2>
                  <TaskList tasks={tasks.filter((t) => t.assignee?.fullName === userInfo.name)} onUpdate={handleUpdate} onDelete={handleDelete} />
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h2 className="text-lg font-bold text-blue-600 mb-2">Created by You</h2>
                  <TaskList tasks={tasks.filter((t) => t.creator.email === userInfo.email)} onUpdate={handleUpdate} onDelete={handleDelete} />
                </div>
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h2 className="text-lg font-bold text-red-600 mb-2">Overdue Tasks</h2>
                  <TaskList tasks={tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== 'Completed')} onUpdate={handleUpdate} onDelete={handleDelete} />
                </div>
              </div>
            </>
          )}
          {activeSection === 'tasks' && (
            <>
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">Task Management & Team Collaboration 🤝</h1>
              <TaskForm onTaskCreated={handleCreate} currentUser={userInfo} />
            </>
          )}
          {activeSection === 'search' && (
            <>
              <h1 className="text-3xl font-semibold text-gray-800 mb-4">Search & Filter Tasks</h1>
              <TaskSearch onSearch={handleSearch} />
              <TaskList tasks={filteredTasks} onUpdate={handleUpdate} onDelete={handleDelete} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
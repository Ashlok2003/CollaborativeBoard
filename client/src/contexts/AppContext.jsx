/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import api from '@/utils/api';

export const AppContext = createContext();

const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000/api';

const AppProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userActivities, setUserActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(API_URL, { query: { token } });

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        localStorage.removeItem('token');
      }
    };

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/actions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };

    fetchUser();
    fetchTasks();
    fetchLogs();

    socket.on('taskCreated', (task) => setTasks((prev) => [...prev, task]));
    socket.on('taskUpdated', (updatedTask) =>
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))
    );
    socket.on('taskDeleted', (id) => setTasks((prev) => prev.filter((t) => t._id !== id)));
    socket.on('actionLogged', (log) => setLogs((prev) => [log, ...prev.slice(0, 19)]));
    socket.on('onlineUsers', (users) => setOnlineUsers(users));
    socket.on('userActivity', ({ userId, username, taskId, action }) => {
      setUserActivities((prev) => ({
        ...prev,
        [userId]: { username, taskId, action },
      }));
    });

    return () => socket.disconnect();
  }, []);

  const createTask = async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      setTasks((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, taskData);
      setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
      return res.data;
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  const smartAssignTask = async (taskId) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      const updateData = { ...task, smartAssign: true };
      const res = await api.put(`/tasks/${taskId}`, updateData);
      setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
    } catch (err) {
      console.error('Smart Assign failed:', err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTasks([]);
    setLogs([]);
    setOnlineUsers([]);
    setUserActivities({});
  };

  const contextValue = {
    tasks,
    setTasks,
    user,
    setUser,
    logs,
    onlineUsers,
    userActivities,
    createTask,
    updateTask,
    deleteTask,
    smartAssignTask,
    logout,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;

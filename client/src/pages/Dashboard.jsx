import { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { KanbanBoard, KanbanCards, KanbanHeader, KanbanProvider } from '@/components/ui/kanban-board.jsx';
import { PlusIcon } from 'lucide-react';
import { AppContext } from '@/contexts/AppContext';
import TaskCard from '@/components/dashboard/task-card';
import TaskFormModal from '@/components/dashboard/task-form';
import ConflictModal from '@/components/dashboard/conflict-modal';
import UserPresence from '@/components/dashboard/user-preference';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000', {
  query: { token: localStorage.getItem('token') },
});

const statuses = [
  { id: '1', name: 'Todo', color: '#6B7280' },
  { id: '2', name: 'In Progress', color: '#F59E0B' },
  { id: '3', name: 'Done', color: '#10B981' },
];

const Dashboard = () => {
  const { tasks, setTasks, onlineUsers, userActivities, updateTask, createTask } = useContext(AppContext);
  const [conflict, setConflict] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let draggedTask = null;

  useEffect(() => {
    const onCreated = (task) => setTasks((prev) => [...prev, task]);
    const onUpdated = (updatedTask) =>
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    const onDeleted = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

    socket.on('taskCreated', onCreated);
    socket.on('taskUpdated', onUpdated);
    socket.on('taskDeleted', onDeleted);

    return () => {
      socket.off('taskCreated', onCreated);
      socket.off('taskUpdated', onUpdated);
      socket.off('taskDeleted', onDeleted);
    };
  }, [setTasks]);

  const handleDragStart = (task) => {
    draggedTask = task;
    socket.emit('startActivity', { taskId: task._id, action: 'editing' });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = statuses.find((status) => status.name === over.id);
    if (!newStatus) return;

    const task = tasks.find((t) => t._id === active.id);
    if (!task) return;

    draggedTask = { ...task, status: newStatus.name, version: task.version };

    try {
      await updateTask(task._id, draggedTask);
      socket.emit('endActivity', { taskId: task._id });
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict(err.response.data);
      } else {
        alert('Failed to update task status');
      }
    }
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, { ...taskData, version: editingTask.version });
      } else {
        await createTask(taskData);
      }
      setEditingTask(null);
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
      alert('Failed to save task');
    }
  };

  const handleResolveConflict = (updatedTask, newVersion) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? { ...updatedTask, version: newVersion } : t))
    );
    setConflict(null);
  };

  const openAddTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">Collaborate in real-time, stay productive.</p>
        </div>
        <div className="flex items-center gap-4">
          <UserPresence onlineUsers={onlineUsers} userActivities={userActivities} />
          <Button
            size="sm"
            onClick={openAddTaskModal}
            className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl"
          >
            <PlusIcon className="size-4" /> Add Task
          </Button>
        </div>
      </div>

      <KanbanProvider onDragEnd={handleDragEnd} className="p-4">
        {statuses.map((status) => (
          <KanbanBoard key={status.name} id={status.name}>
            <KanbanHeader name={status.name} color={status.color} />
            <KanbanCards>
              {tasks
                .filter((task) => task.status === status.name)
                .map((task, index) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    index={index}
                    parent={status.name}
                    onEdit={openEditTaskModal}
                    onDragStart={handleDragStart}
                  />
                ))}
            </KanbanCards>
          </KanbanBoard>
        ))}
      </KanbanProvider>

      <TaskFormModal
        task={editingTask}
        onSubmit={handleSubmitTask}
        open={isModalOpen}
        setOpen={setIsModalOpen}
      />

      {conflict && (
        <ConflictModal
          conflict={conflict}
          draggedTask={draggedTask}
          onResolve={handleResolveConflict}
          onCancel={() => setConflict(null)}
          socket={socket}
        />
      )}
    </div>
  );
};

export default Dashboard;

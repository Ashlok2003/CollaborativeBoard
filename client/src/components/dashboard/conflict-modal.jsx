import api from "@/utils/api";

const ConflictModal = ({ conflict, draggedTask, onResolve, onCancel, socket }) => {
  if (!conflict?.currentTask || !draggedTask) return null;

  const handleResolve = async (choice) => {
    if (choice === 'overwrite') {
      try {
        await api.put(`/tasks/${conflict.currentTask._id}`, {
          ...draggedTask,
          version: conflict.currentTask.version,
        });
        onResolve(draggedTask, conflict.currentTask.version + 1);
      } catch (err) {
        console.error(err);
        alert('Failed to resolve conflict');
      }
    }
    socket.emit('endActivity', { taskId: draggedTask._id });
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg animate-fadeIn">
        <h2 className="text-lg font-bold">Conflict Detected</h2>
        <p>Your Version: {draggedTask.title}</p>
        <p>Current Version: {conflict.currentTask.title}</p>
        <button
          className="m-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleResolve('overwrite')}
        >
          Overwrite
        </button>
        <button
          className="m-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            socket.emit('endActivity', { taskId: draggedTask._id });
            onCancel();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConflictModal;

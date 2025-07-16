import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { KanbanCard } from '@/components/ui/kanban-board';
import { AppContext } from '@/contexts/AppContext';
import { Edit, Trash2, Zap } from 'lucide-react';
import { useContext } from 'react';

const TaskCard = ({ task, index, parent, onEdit, onDragStart }) => {
  const { deleteTask, smartAssignTask } = useContext(AppContext);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(task._id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const handleSmartAssign = async () => {
    try {
      await smartAssignTask(task._id);
      console.log('Smart Assign succeeded');
    } catch (err) {
      alert(`Smart Assign failed: ${err.response?.data?.error || 'Unknown error'}`);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <KanbanCard
      key={task._id}
      id={task._id}
      name={task.title}
      parent={parent}
      index={index}
      onDragStart={() => onDragStart(task)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground leading-tight truncate">{task.title}</h4>
            {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          </div>
          {task.assignedTo && (
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={task.assignedTo.image || ''} alt={task.assignedTo.username} />
              <AvatarFallback className="text-xs">{task.assignedTo.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {task.priority && (
          <div className="flex justify-start">
            <Badge variant={getPriorityVariant(task.priority)} className="text-xs px-2 py-0.5">
              {task.priority}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-1 pt-1">
          <Button
            onClick={() => onEdit(task)}
            onPointerDown={(e) => e.stopPropagation()}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>

          <Button
            onClick={handleSmartAssign}
            onPointerDown={(e) => e.stopPropagation()}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-green-50 hover:text-green-600"
          >
            <Zap className="h-3 w-3 mr-1" />
            Assign
          </Button>

          <Button
            onClick={handleDelete}
            onPointerDown={(e) => e.stopPropagation()}
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs hover:bg-red-50 hover:text-red-600 ml-auto"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </KanbanCard>
  );
};

export default TaskCard;

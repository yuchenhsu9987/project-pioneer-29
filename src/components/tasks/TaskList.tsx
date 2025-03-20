
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskItem, { Task } from './TaskItem';
import { Plus, Filter } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type TaskListProps = {
  projectId: string;
  tasks: Task[];
  onTaskCreate: (projectId: string, task: { title: string; priority: Task['priority'] }) => void;
  onTaskStatusChange: (id: string, completed: boolean) => void;
  onTaskDelete: (id: string) => void;
};

const TaskList = ({ 
  projectId, 
  tasks, 
  onTaskCreate, 
  onTaskStatusChange, 
  onTaskDelete 
}: TaskListProps) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { toast } = useToast();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return;
    }
    
    onTaskCreate(projectId, { 
      title: newTaskTitle, 
      priority: newTaskPriority 
    });
    
    setNewTaskTitle('');
    
    toast({
      title: "Task added",
      description: "Your new task has been added successfully."
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTask} className="flex gap-2">
        <Input
          placeholder="Add a new task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1"
        />
        <Select 
          value={newTaskPriority} 
          onValueChange={(value) => setNewTaskPriority(value as Task['priority'])}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </form>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({tasks.length})
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {filter === 'all' 
            ? 'No tasks yet. Add your first task!'
            : filter === 'active' 
              ? 'No active tasks. Great job!'
              : 'No completed tasks yet.'}
        </div>
      ) : (
        <motion.div layout className="space-y-2">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={onTaskStatusChange}
                onDelete={onTaskDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default TaskList;

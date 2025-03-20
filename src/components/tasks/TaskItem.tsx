
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  comments?: number;
};

type TaskItemProps = {
  task: Task;
  onStatusChange: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
};

const TaskItem = ({ task, onStatusChange, onDelete }: TaskItemProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <motion.div 
      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
        task.completed ? 'bg-muted/50' : 'bg-card hover:bg-accent/50'
      } border`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox 
          checked={task.completed}
          onCheckedChange={(checked) => {
            onStatusChange(task.id, checked as boolean);
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`font-medium transition-all ${
              task.completed ? 'line-through text-muted-foreground' : ''
            }`}>
              {task.title}
            </p>
            <Badge 
              variant="outline" 
              className={`text-xs ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </Badge>
          </div>
          
          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(task.createdAt)}
            </div>
            {task.comments && task.comments > 0 && (
              <div className="flex items-center">
                <MessageSquare className="w-3 h-3 mr-1" />
                {task.comments}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task.id)}
        className={`h-8 w-8 p-0 opacity-0 transition-opacity ${isHovering ? 'opacity-100' : ''}`}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </motion.div>
  );
};

export default TaskItem;

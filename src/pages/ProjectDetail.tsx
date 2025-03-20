
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  initialProjects, 
  initialTasks, 
  generateId, 
  calculateProgress, 
  updateProjectStats 
} from '@/lib/data';
import Navbar from '@/components/layout/Navbar';
import TaskList from '@/components/tasks/TaskList';
import { Task } from '@/components/tasks/TaskItem';
import { Project } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, CheckCircle2, Clock, Edit, Folder, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  
  useEffect(() => {
    // Find the project
    const foundProject = initialProjects.find(p => p.id === projectId);
    
    if (!foundProject) {
      navigate('/');
      toast({
        title: "Project not found",
        description: "The project you're looking for doesn't exist.",
        variant: "destructive",
      });
      return;
    }
    
    setProject(foundProject);
    setEditedTitle(foundProject.title);
    setEditedDescription(foundProject.description);
    
    // Load associated tasks
    const projectTasks = initialTasks[projectId || ''] || [];
    setTasks(projectTasks);
  }, [projectId, navigate]);

  const handleTaskCreate = (projectId: string, { title, priority }: { title: string; priority: Task['priority'] }) => {
    const newTask: Task = {
      id: `task-${generateId()}`,
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };

    setTasks(prev => {
      const updatedTasks = [newTask, ...prev];
      
      // Update project progress
      if (project) {
        const updatedProject = updateProjectStats(project, updatedTasks);
        setProject(updatedProject);
      }
      
      return updatedTasks;
    });
  };

  const handleTaskStatusChange = (id: string, completed: boolean) => {
    setTasks(prev => {
      const updatedTasks = prev.map(task => 
        task.id === id ? { ...task, completed } : task
      );
      
      // Update project progress
      if (project) {
        const updatedProject = updateProjectStats(project, updatedTasks);
        setProject(updatedProject);
      }
      
      return updatedTasks;
    });
  };

  const handleTaskDelete = (id: string) => {
    setTasks(prev => {
      const updatedTasks = prev.filter(task => task.id !== id);
      
      // Update project progress
      if (project) {
        const updatedProject = updateProjectStats(project, updatedTasks);
        setProject(updatedProject);
      }
      
      return updatedTasks;
    });
  };

  const handleSaveProjectDetails = () => {
    if (project) {
      setProject({
        ...project,
        title: editedTitle,
        description: editedDescription,
      });
      
      setIsEditing(false);
      
      toast({
        title: "Project updated",
        description: "Project details have been updated successfully.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to projects
              </Button>
            </Link>
            
            <div className="flex items-start justify-between">
              {isEditing ? (
                <div className="space-y-3 w-full">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold"
                  />
                  <Input
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Project description"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProjectDetails} size="sm" className="gap-1">
                      <Save className="w-4 h-4" />
                      Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="gap-1">
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                  <p className="text-muted-foreground mt-1 mb-3">{project.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <div className="flex items-center mr-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created on {formatDate(project.createdAt)}
                    </div>
                    <div className="flex items-center">
                      <Folder className="w-4 h-4 mr-1" />
                      {project.tasks.total} tasks ({project.tasks.completed} completed)
                    </div>
                  </div>
                </div>
              )}
              
              {!isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-medium mb-2">Project Progress</h3>
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress 
                value={project.progress} 
                className="h-2"
              />
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold mb-1">{project.tasks.total}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold mb-1 text-primary">{project.tasks.completed}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-secondary/50">
                  <div className="text-2xl font-bold mb-1">{project.tasks.total - project.tasks.completed}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            
            <TaskList
              projectId={project.id}
              tasks={tasks}
              onTaskCreate={handleTaskCreate}
              onTaskStatusChange={handleTaskStatusChange}
              onTaskDelete={handleTaskDelete}
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;

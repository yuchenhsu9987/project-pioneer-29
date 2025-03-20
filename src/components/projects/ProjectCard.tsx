
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, MoreVertical, Clock, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export type Project = {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
  createdAt: string;
};

type ProjectCardProps = {
  project: Project;
  onDelete: (id: string) => void;
};

const ProjectCard = ({ project, onDelete }: ProjectCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      className="overflow-hidden transition-all hover-lift border border-border/80"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link to={`/project/${project.id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2 animate-fade-in">
              <Clock className="w-3 h-3 mr-1" />
              {formatDate(project.createdAt)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(project.id);
                  }}
                >
                  Delete project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-xl tracking-tight leading-none">
            {project.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 h-10">
            {project.description || "No description provided"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress} 
            className="h-2 transition-all duration-500"
          />
        </CardContent>
        <CardFooter className="flex justify-between pt-0 text-sm">
          <div className="flex items-center">
            <Folder className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{project.tasks.total} tasks</span>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
            <span>{project.tasks.completed} completed</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProjectCard;

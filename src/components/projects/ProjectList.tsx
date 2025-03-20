
import { useState } from 'react';
import ProjectCard, { Project } from './ProjectCard';
import CreateProjectButton from './CreateProjectButton';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

type ProjectListProps = {
  projects: Project[];
  onProjectCreate: (project: { title: string; description: string }) => void;
  onProjectDelete: (id: string) => void;
};

const ProjectList = ({ projects, onProjectCreate, onProjectDelete }: ProjectListProps) => {
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    onProjectDelete(id);
    toast({
      title: "Project deleted",
      description: "The project has been deleted successfully."
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {projects.length > 0 ? 'Your Projects' : 'No Projects Yet'}
        </h2>
        <CreateProjectButton onProjectCreate={onProjectCreate} />
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/50 rounded-full p-4 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M5 8h14" />
              <path d="M5 12h14" />
              <path d="M5 16h14" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-1">Start by creating a project</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Projects help you organize your tasks and track your progress
          </p>
          <CreateProjectButton 
            onProjectCreate={onProjectCreate} 
            variant="outline"
          />
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard 
                project={project} 
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ProjectList;

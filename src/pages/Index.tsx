
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import ProjectList from '@/components/projects/ProjectList';
import { initialProjects, initialTasks, generateId, updateProjectStats } from '@/lib/data';
import { Project } from '@/components/projects/ProjectCard';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Initialize with sample data
    setProjects(initialProjects);
  }, []);

  const handleProjectCreate = ({ title, description }: { title: string; description: string }) => {
    const newProject: Project = {
      id: `project-${generateId()}`,
      title,
      description,
      progress: 0,
      tasks: {
        total: 0,
        completed: 0,
      },
      createdAt: new Date().toISOString(),
    };

    setProjects(prev => [newProject, ...prev]);
  };

  const handleProjectDelete = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-6 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Project Tracker</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Track your projects and tasks with ease. Organize, prioritize, and visualize your progress.
            </p>
          </div>
          
          <ProjectList 
            projects={projects}
            onProjectCreate={handleProjectCreate}
            onProjectDelete={handleProjectDelete}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;


import { Project } from '@/components/projects/ProjectCard';
import { Task } from '@/components/tasks/TaskItem';

// Helper function to generate unique IDs
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

// Initialize sample projects data
export const initialProjects: Project[] = [
  {
    id: 'project-1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design principles',
    progress: 65,
    tasks: {
      total: 8,
      completed: 5,
    },
    createdAt: '2023-04-15T10:30:00Z',
  },
  {
    id: 'project-2',
    title: 'Mobile App Development',
    description: 'Create a native mobile application for iOS and Android platforms',
    progress: 25,
    tasks: {
      total: 12,
      completed: 3,
    },
    createdAt: '2023-05-20T14:45:00Z',
  },
  {
    id: 'project-3',
    title: 'Marketing Campaign',
    description: 'Q3 marketing initiative to increase brand awareness and generate leads',
    progress: 90,
    tasks: {
      total: 6,
      completed: 5,
    },
    createdAt: '2023-06-10T09:15:00Z',
  },
];

// Initialize sample tasks data
export const initialTasks: Record<string, Task[]> = {
  'project-1': [
    {
      id: 'task-1-1',
      title: 'Wireframe new homepage design',
      completed: true,
      priority: 'high',
      createdAt: '2023-04-16T11:30:00Z',
      comments: 3,
    },
    {
      id: 'task-1-2',
      title: 'Create style guide and design system',
      completed: true,
      priority: 'medium',
      createdAt: '2023-04-17T10:15:00Z',
    },
    {
      id: 'task-1-3',
      title: 'Develop responsive layout',
      completed: true,
      priority: 'high',
      createdAt: '2023-04-20T14:20:00Z',
      comments: 2,
    },
    {
      id: 'task-1-4',
      title: 'Implement dark mode toggle',
      completed: true,
      priority: 'low',
      createdAt: '2023-04-22T09:45:00Z',
    },
    {
      id: 'task-1-5',
      title: 'Optimize images and assets',
      completed: true,
      priority: 'medium',
      createdAt: '2023-04-25T16:30:00Z',
    },
    {
      id: 'task-1-6',
      title: 'Add animations and transitions',
      completed: false,
      priority: 'medium',
      createdAt: '2023-04-28T13:15:00Z',
    },
    {
      id: 'task-1-7',
      title: 'Cross-browser testing',
      completed: false,
      priority: 'high',
      createdAt: '2023-05-02T11:00:00Z',
      comments: 1,
    },
    {
      id: 'task-1-8',
      title: 'Performance optimization',
      completed: false,
      priority: 'high',
      createdAt: '2023-05-05T10:30:00Z',
    },
  ],
  'project-2': [
    {
      id: 'task-2-1',
      title: 'Design app wireframes',
      completed: true,
      priority: 'high',
      createdAt: '2023-05-21T09:30:00Z',
    },
    {
      id: 'task-2-2',
      title: 'Create UI mockups',
      completed: true,
      priority: 'high',
      createdAt: '2023-05-23T14:15:00Z',
      comments: 2,
    },
    {
      id: 'task-2-3',
      title: 'Setup development environment',
      completed: true,
      priority: 'medium',
      createdAt: '2023-05-25T11:45:00Z',
    },
    {
      id: 'task-2-4',
      title: 'Implement user authentication',
      completed: false,
      priority: 'high',
      createdAt: '2023-05-28T10:20:00Z',
    },
    {
      id: 'task-2-5',
      title: 'Build home screen UI',
      completed: false,
      priority: 'medium',
      createdAt: '2023-06-01T15:30:00Z',
    },
    {
      id: 'task-2-6',
      title: 'Implement API integration',
      completed: false,
      priority: 'high',
      createdAt: '2023-06-05T09:15:00Z',
      comments: 1,
    },
    {
      id: 'task-2-7',
      title: 'Add push notifications',
      completed: false,
      priority: 'medium',
      createdAt: '2023-06-08T14:45:00Z',
    },
    {
      id: 'task-2-8',
      title: 'Create user profile screen',
      completed: false,
      priority: 'medium',
      createdAt: '2023-06-10T11:30:00Z',
    },
    {
      id: 'task-2-9',
      title: 'Implement settings screen',
      completed: false,
      priority: 'low',
      createdAt: '2023-06-12T10:15:00Z',
    },
    {
      id: 'task-2-10',
      title: 'Add offline support',
      completed: false,
      priority: 'medium',
      createdAt: '2023-06-15T09:30:00Z',
    },
    {
      id: 'task-2-11',
      title: 'Testing on multiple devices',
      completed: false,
      priority: 'high',
      createdAt: '2023-06-18T14:20:00Z',
    },
    {
      id: 'task-2-12',
      title: 'Prepare for store submission',
      completed: false,
      priority: 'high',
      createdAt: '2023-06-20T11:45:00Z',
      comments: 3,
    },
  ],
  'project-3': [
    {
      id: 'task-3-1',
      title: 'Define campaign objectives',
      completed: true,
      priority: 'high',
      createdAt: '2023-06-11T10:00:00Z',
      comments: 2,
    },
    {
      id: 'task-3-2',
      title: 'Identify target audience',
      completed: true,
      priority: 'high',
      createdAt: '2023-06-12T14:30:00Z',
    },
    {
      id: 'task-3-3',
      title: 'Create content calendar',
      completed: true,
      priority: 'medium',
      createdAt: '2023-06-15T09:45:00Z',
      comments: 1,
    },
    {
      id: 'task-3-4',
      title: 'Design social media graphics',
      completed: true,
      priority: 'medium',
      createdAt: '2023-06-18T11:15:00Z',
    },
    {
      id: 'task-3-5',
      title: 'Write email newsletter copy',
      completed: true,
      priority: 'medium',
      createdAt: '2023-06-20T15:30:00Z',
    },
    {
      id: 'task-3-6',
      title: 'Setup analytics tracking',
      completed: false,
      priority: 'low',
      createdAt: '2023-06-22T10:20:00Z',
    },
  ],
};

// Calculate project progress based on completed tasks
export const calculateProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedCount = tasks.filter(task => task.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
};

// Update project stats based on tasks
export const updateProjectStats = (project: Project, tasks: Task[]): Project => {
  return {
    ...project,
    progress: calculateProgress(tasks),
    tasks: {
      total: tasks.length,
      completed: tasks.filter(task => task.completed).length,
    }
  };
};

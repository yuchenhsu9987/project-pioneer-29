
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CreateProjectButtonProps = {
  onProjectCreate: (project: { title: string; description: string }) => void;
  variant?: 'default' | 'outline' | 'ghost';
};

const CreateProjectButton = ({ 
  onProjectCreate, 
  variant = 'default' 
}: CreateProjectButtonProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Project title required",
        description: "Please enter a title for your project.",
        variant: "destructive",
      });
      return;
    }
    
    onProjectCreate({ title, description });
    setTitle('');
    setDescription('');
    setOpen(false);
    
    toast({
      title: "Project created",
      description: "Your new project has been created successfully.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} className="gap-2 group">
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl animate-scale-in">
        <DialogHeader>
          <DialogTitle>Create new project</DialogTitle>
          <DialogDescription>
            Create a new project to organize your tasks and track progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project name"
                className="col-span-3"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your project"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectButton;

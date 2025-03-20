
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

type LoadingScreenProps = {
  loadingProgress: number;
  loadingTimeout: boolean;
  handleRetry: () => void;
  modelName: string;
};

const LoadingScreen = ({ loadingProgress, loadingTimeout, handleRetry, modelName }: LoadingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-card rounded-lg border shadow-sm">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground mb-6">正在加載AI模型 ({modelName})...</p>
      
      <div className="w-full max-w-md px-8 mb-4">
        <Progress value={loadingProgress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {loadingProgress < 100 ? `加載中 ${loadingProgress}%` : '加載完成'}
        </p>
      </div>
      
      {loadingTimeout && (
        <div className="mt-6 text-center px-4">
          <div className="flex items-center justify-center mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-amber-500 font-medium">加載時間較長</p>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            模型加載需要較長時間。這可能是因為網絡連接問題或瀏覽器限制。
          </p>
          <Button onClick={handleRetry} variant="outline" size="sm">
            重試加載
          </Button>
        </div>
      )}
      
      <div className="mt-6 space-y-4 w-full max-w-md px-8">
        <p className="text-xs text-center text-muted-foreground">模型加載中，請稍候...</p>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

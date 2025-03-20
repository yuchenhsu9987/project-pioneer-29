
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { BrainCircuit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initChatModel, generateResponse, createProjectPrompt } from '@/lib/ChatHelper';

// Import the new components
import ChatContainer from '@/components/chat/ChatContainer';
import ChatInput from '@/components/chat/ChatInput';
import LoadingScreen from '@/components/chat/LoadingScreen';

type ChatModel = {
  fallback: boolean;
  __call__: (prompt: string, options?: any) => Promise<{ generated_text: string }[]>;
};

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [model, setModel] = useState<ChatModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [modelName, setModelName] = useState('google/gemma-3-1b-it');
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setInitializing(true);
        
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += 1;
          setLoadingProgress(Math.min(progress, 95));
        }, 300);
        
        timeoutRef.current = setTimeout(() => {
          setLoadingTimeout(true);
        }, 15000);
        
        const chatModel = await initChatModel();
        
        clearInterval(progressInterval);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        setLoadingProgress(100);
        setModel(chatModel);
        
        if (chatModel.fallback) {
          toast({
            title: '使用基本模式',
            description: '無法加載完整AI模型，將使用基本回應。',
            variant: 'destructive',
          });
        } else {
          toast({
            title: '專案管理助手已準備就緒',
            description: `已成功加載 ${modelName} 模型。`,
          });
        }
        
        setMessages([
          { 
            role: 'assistant', 
            content: '您好，我是您的專案管理智能助手。我可以幫您追蹤專案進度、管理任務，或回答您關於專案的問題。有什麼我能幫您的嗎？' 
          }
        ]);
      } catch (error) {
        console.error('Failed to load model:', error);
        toast({
          title: '無法加載AI助手',
          description: '請檢查您的連接並重試。',
          variant: 'destructive',
        });
      } finally {
        setInitializing(false);
      }
    };

    loadModel();
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toast, modelName]);

  const handleSendMessage = async () => {
    if (!input.trim() || !model || loading) return;
    
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const prompt = createProjectPrompt(userMessage.content, messages);
      const response = await generateResponse(model, prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: '錯誤',
        description: '無法生成回應。請重試。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoadingTimeout(false);
    setLoadingProgress(0);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">專案管理智能助手</h1>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{modelName}</span>
            </div>
            
            {initializing ? (
              <LoadingScreen 
                loadingProgress={loadingProgress}
                loadingTimeout={loadingTimeout}
                handleRetry={handleRetry}
                modelName={modelName}
              />
            ) : (
              <>
                <ChatContainer messages={messages} />
                <ChatInput 
                  input={input}
                  setInput={setInput}
                  handleSendMessage={handleSendMessage}
                  loading={loading}
                  modelName={modelName}
                />
              </>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default Chat;

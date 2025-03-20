import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Bot, BrainCircuit, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initChatModel, generateResponse, createProjectPrompt } from '@/lib/ChatHelper';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            ) : (
              <>
                <div className="bg-card rounded-lg p-4 h-[500px] mb-4 overflow-y-auto border shadow-sm">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'ml-auto' : 'mr-auto'
                      }`}
                    >
                      <Card
                        className={`p-3 max-w-[80%] ${
                          message.role === 'user'
                            ? 'ml-auto bg-primary text-primary-foreground'
                            : 'mr-auto border-primary/20 flex items-start gap-2'
                        }`}
                      >
                        {message.role === 'assistant' && (
                          <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </Card>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Textarea
                    className="flex-1 min-h-24 resize-none"
                    placeholder="輸入您的問題或請求..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      className="w-full gap-2"
                      onClick={handleSendMessage}
                      disabled={loading || !input.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          處理中...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          發送訊息
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    AI助手使用 {modelName} 模型，直接在您的瀏覽器中運行
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </PageTransition>
    </div>
  );
};

export default Chat;


import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Bot, BrainCircuit, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initChatModel, generateResponse, createProjectPrompt } from '@/lib/ChatHelper';

const Chat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setInitializing(true);
        const chatModel = await initChatModel();
        setModel(chatModel);
        toast({
          title: '專案管理助手已準備就緒',
          description: 'AI模型已成功加載。',
        });
        
        // Add welcome message
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
  }, [toast]);

  // Scroll to bottom when messages change
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
      // Create a project-focused prompt
      const prompt = createProjectPrompt(userMessage.content, messages);
      
      // Generate AI response
      const response = await generateResponse(model, prompt);
      
      // Add AI response to messages
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageTransition>
        <main className="container mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <BrainCircuit className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">專案管理智能助手</h1>
            </div>
            
            {initializing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">正在加載AI模型...</p>
                <p className="text-xs text-muted-foreground mt-2">首次加載可能需要一點時間</p>
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
                    AI助手直接在您的瀏覽器中運行，對話不會上傳至伺服器
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

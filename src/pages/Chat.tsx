
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initChatModel, generateResponse } from '@/lib/ChatHelper';

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
          title: 'AI Assistant Ready',
          description: 'The AI model has been loaded successfully.',
        });
      } catch (error) {
        console.error('Failed to load model:', error);
        toast({
          title: 'Failed to Load AI',
          description: 'Please check your connection and try again.',
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
      // Create a prompt from the conversation history
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const prompt = `${conversationHistory}\nUser: ${userMessage.content}\nAssistant:`;
      
      // Generate AI response
      const response = await generateResponse(model, prompt);
      
      // Add AI response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a response. Please try again.',
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
            <h1 className="text-3xl font-bold mb-8">AI Chat Assistant</h1>
            
            {initializing ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading AI model...</p>
                <p className="text-xs text-muted-foreground mt-2">This may take a moment on first load</p>
              </div>
            ) : (
              <>
                <div className="bg-card rounded-lg p-4 h-[400px] mb-4 overflow-y-auto">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <h3 className="font-medium text-lg mb-2">Welcome to the AI assistant</h3>
                      <p className="text-muted-foreground text-sm">
                        Ask questions about your projects or tasks. The AI runs directly in your browser.
                      </p>
                    </div>
                  )}
                  
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
                            : 'mr-auto'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </Card>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex items-end gap-2">
                  <Textarea
                    className="flex-1 min-h-24 resize-none"
                    placeholder="Type your message here..."
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
                  <Button
                    className="h-24"
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
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

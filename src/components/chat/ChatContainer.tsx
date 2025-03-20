
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChatContainerProps = {
  messages: {role: 'user' | 'assistant', content: string}[];
};

const ChatContainer = ({ messages }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ScrollArea className="bg-card rounded-lg p-4 h-[500px] mb-4 border shadow-sm">
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          role={message.role} 
          content={message.content} 
        />
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
};

export default ChatContainer;


import React from 'react';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

type ChatMessageProps = {
  content: string;
  role: 'user' | 'assistant';
};

const ChatMessage = ({ content, role }: ChatMessageProps) => {
  return (
    <div className={`mb-4 ${role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
      <Card
        className={`p-3 max-w-[80%] ${
          role === 'user'
            ? 'ml-auto bg-primary text-primary-foreground'
            : 'mr-auto border-primary/20 flex items-start gap-2'
        }`}
      >
        {role === 'assistant' && (
          <Bot className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </Card>
    </div>
  );
};

export default ChatMessage;

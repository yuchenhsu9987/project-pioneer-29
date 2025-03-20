
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Sparkles } from 'lucide-react';

type ChatInputProps = {
  input: string;
  setInput: (input: string) => void;
  handleSendMessage: () => void;
  loading: boolean;
  modelName: string;
};

const ChatInput = ({ input, setInput, handleSendMessage, loading, modelName }: ChatInputProps) => {
  return (
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
  );
};

export default ChatInput;

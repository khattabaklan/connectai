import React, { memo, KeyboardEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Using memo to prevent unnecessary re-renders
const MessageInput = memo(({
  onSendMessage,
  isLoading = false,
  value,
  onChange,
  placeholder = 'Type a message...',
}: MessageInputProps) => {
  // Handle input change
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Handle send button click
  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSendMessage(value);
    }
  };

  // Handle Enter key press (send message)
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2">
      <Textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="min-h-[40px] resize-none"
        disabled={isLoading}
        rows={1}
        maxLength={1000}
      />
      <Button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        size="icon"
        className="h-10 w-10 shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
});

// Display name for debugging
MessageInput.displayName = 'MessageInput';

export default MessageInput;
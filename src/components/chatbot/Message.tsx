import React, { memo } from 'react';
import { Message as MessageType } from '@/lib/chatbot/mock-api';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MessageProps {
  message: MessageType & { isSeparator?: boolean };
  isLast?: boolean;
}

// Using React.memo for performance optimization
const Message = memo(({ message, isLast = false }: MessageProps) => {
  const isUserMessage = message.role === 'user';
  const isSystemMessage = message.role === 'system';
  const isError = message.status === 'error';
  const isSending = message.status === 'sending';

  // Render system messages differently
  if (isSystemMessage) {
    return (
      <div className="my-2 text-center">
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full",
        isUserMessage ? "justify-end" : "justify-start",
        message.isSeparator && "mt-4"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUserMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
          isError && "border border-destructive text-destructive"
        )}
      >
        {message.content}
        
        {/* Show status indicators */}
        {isUserMessage && (
          <div className="mt-1 flex justify-end">
            {isSending && (
              <Loader2 className="h-3 w-3 animate-spin text-primary-foreground/70" />
            )}
            {isError && (
              <span className="text-[10px] text-destructive">
                Failed to send. Try again.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// Display name for debugging
Message.displayName = 'Message';

export default Message;
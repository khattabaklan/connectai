import React, { memo } from 'react';
import Message from './Message';
import { Message as MessageType } from '@/lib/chatbot/mock-api';

interface MessageListProps {
  messages: MessageType[];
  isTyping?: boolean;
}

// Using React.memo to prevent unnecessary re-renders
const MessageList = memo(({ messages, isTyping = false }: MessageListProps) => {
  // Group consecutive messages from same sender
  const groupedMessages = messages.reduce<{
    messages: MessageType[];
    lastRole?: 'user' | 'bot' | 'system';
  }>(
    (acc, message, index) => {
      // Add a visual separator if the role changes
      if (message.role !== acc.lastRole && index > 0) {
        acc.messages.push({
          ...message,
          isSeparator: true,
        } as MessageType);
      }

      acc.messages.push(message);
      acc.lastRole = message.role;
      return acc;
    },
    { messages: [], lastRole: undefined }
  ).messages;

  return (
    <div className="flex flex-col gap-3">
      {groupedMessages.map((message) => (
        <Message
          key={message.id}
          message={message}
          isLast={message.id === messages[messages.length - 1]?.id}
        />
      ))}
      
      {isTyping && (
        <div className="chat-message flex h-6 items-center">
          <div className="flex items-center">
            <span className="dot-typing"></span>
          </div>
        </div>
      )}
      
      {/* Add some padding at the bottom to ensure visibility of last message */}
      <div className="h-2"></div>
    </div>
  );
});

// Add display name for better debugging
MessageList.displayName = 'MessageList';

export default MessageList;
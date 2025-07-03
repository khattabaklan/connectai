import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  isOpen, 
  onClick, 
  unreadCount = 0 
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        'fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50',
        'flex items-center justify-center transition-all duration-300',
        isOpen && 'bg-destructive hover:bg-destructive/90'
      )}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <div className="relative">
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      )}
    </Button>
  );
};

export default ChatBubble;
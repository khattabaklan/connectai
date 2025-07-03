import React, { useState, useRef, useEffect, memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ContactForm from './ContactForm';
import { Message } from '@/lib/chatbot/mock-api';
import { UserInfo } from '@/lib/chatbot/mock-api';
import { configService } from '@/lib/services/configService';

interface ChatWindowProps {
  messages: Message[];
  typingMessage: string | null;
  isLoading: boolean;
  botState: 'idle' | 'thinking' | 'responding' | 'error';
  showContactForm: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onSubmitContactForm: (info: UserInfo) => void;
  onRequestHuman: () => void;
}

// Using memo to prevent unnecessary re-renders
const ChatWindow = memo(({
  messages,
  typingMessage,
  isLoading,
  botState,
  showContactForm,
  onClose,
  onSendMessage,
  onSubmitContactForm,
  onRequestHuman,
}: ChatWindowProps) => {
  // Get chat config
  const [config] = useState(configService.getConfig());
  
  // Keep reference to message list for scrolling
  const messageListRef = useRef<HTMLDivElement>(null);
  
  // Track typing input to avoid re-creating the component
  const [inputValue, setInputValue] = useState('');

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageListRef.current) {
      const element = messageListRef.current;
      element.scrollTop = element.scrollHeight;
    }
  }, [messages]);

  // Handle message sending
  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      onSendMessage(message);
      setInputValue('');
    }
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  return (
    <Card className="fixed bottom-20 right-4 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-lg shadow-2xl md:right-8 md:h-[600px] md:w-[400px]">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4" 
        style={{ backgroundColor: config.appearance.primaryColor || '#4f46e5' }}
      >
        <div className="flex items-center gap-2">
          {config.appearance.avatarUrl && (
            <img 
              src={config.appearance.avatarUrl} 
              alt="Bot Avatar" 
              className="h-8 w-8 rounded-full"
            />
          )}
          <h3 className="font-medium text-white">
            {config.appearance.headerText || 'Chat Support'}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>
      
      {/* Messages */}
      <div 
        ref={messageListRef} 
        className="custom-scrollbar flex-1 overflow-y-auto p-4"
      >
        <MessageList 
          messages={messages} 
          isTyping={botState === 'thinking' || botState === 'responding'} 
        />
      </div>
      
      {/* Contact Form (conditionally rendered) */}
      {showContactForm ? (
        <div className="border-t p-4">
          <ContactForm 
            onSubmit={onSubmitContactForm} 
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col border-t">
          {/* Human assistance button */}
          <div className="border-t border-gray-100 p-2 text-center text-xs text-muted-foreground">
            <button 
              className="hover:text-primary" 
              onClick={onRequestHuman}
              disabled={isLoading}
            >
              Talk to a human
            </button>
          </div>
          
          {/* Message Input */}
          <div className="p-3 pt-0">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </Card>
  );
});

// Display name for debugging
ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
import React, { useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import ChatWindow from './ChatWindow';
import { useChatbot } from '@/hooks/chatbot/useChatbot';

interface ChatWidgetProps {
  autoOpen?: boolean;
  openDelay?: number; // ms
}

// Using memo to prevent unnecessary re-renders
const ChatWidget: React.FC<ChatWidgetProps> = memo(({
  autoOpen = false,
  openDelay = 5000, // 5 seconds
}) => {
  const {
    session,
    messages,
    isOpen,
    isLoading,
    botState,
    typingMessage,
    showContactForm,
    toggleChat,
    sendMessage,
    submitContactForm,
    requestHumanAssistance,
    closeChat
  } = useChatbot();

  // Auto open chat after delay if configured
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (autoOpen && !isOpen) {
      timer = setTimeout(() => {
        toggleChat();
      }, openDelay);
    }
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoOpen, isOpen, toggleChat, openDelay]);

  return (
    <>
      <ChatBubble isOpen={isOpen} onClick={toggleChat} />
      
      {/* Only render ChatWindow when chat is open */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ChatWindow
              messages={messages}
              typingMessage={typingMessage}
              isLoading={isLoading}
              botState={botState}
              showContactForm={showContactForm}
              onClose={closeChat}
              onSendMessage={sendMessage}
              onSubmitContactForm={submitContactForm}
              onRequestHuman={requestHumanAssistance}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
});

// Display name for debugging
ChatWidget.displayName = 'ChatWidget';

export default ChatWidget;
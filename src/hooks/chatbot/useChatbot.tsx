import { useState, useEffect, useCallback } from 'react';
import { 
  loadChatHistory, 
  sendMessage, 
  submitUserInfo, 
  requestHumanAssistance, 
  clearChatHistory,
  loadUserInfo,
  Message,
  UserInfo
} from '@/lib/chatbot/mock-api';
import { configService } from '@/lib/services/configService';

// Separate state interfaces to reduce complexity
export interface ChatSession {
  id: string;
  userInfo: UserInfo | null;
  showContactForm: boolean;
  contactFormSubmitted: boolean;
}

export const useChatbot = () => {
  // Split state into smaller pieces to improve memory management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState<string | null>(null);
  const [botState, setBotState] = useState<'idle' | 'thinking' | 'responding' | 'error'>('idle');
  const [session, setSession] = useState<ChatSession>({
    id: crypto.randomUUID(),
    userInfo: null,
    showContactForm: false,
    contactFormSubmitted: false
  });

  // Load config once and memoize it instead of on every render
  const [config] = useState(() => configService.getConfig());

  // Initialize chat on mount (once only)
  useEffect(() => {
    const initChat = () => {
      try {
        const history = loadChatHistory();
        const userInfo = loadUserInfo();
        
        // Update session with user info if available
        setSession(prev => ({
          ...prev,
          userInfo,
          contactFormSubmitted: !!userInfo
        }));
        
        // Add welcome message if no history exists
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          // Add welcome message
          const welcomeMessage: Message = {
            id: 'welcome',
            role: 'bot',
            content: config.responses.welcomeMessage,
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Fallback to a basic welcome message
        const welcomeMessage: Message = {
          id: 'welcome',
          role: 'bot',
          content: "Hi there! How can I help you today?",
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }
    };
    
    initChat();
  }, []);

  // Toggle chat open/closed
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  // Close chat
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    setIsLoading(true);
    setBotState('thinking');
    
    try {
      // Create user message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
        status: 'sent'
      };
      
      // Update messages immediately with user message
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API and get response
      const botMessage = await sendMessage(content.trim(), messages);
      
      // Update with bot response
      setMessages(prev => [...prev, botMessage]);
      
      // Check if should show contact form (after 2nd user message)
      if (!session.contactFormSubmitted && 
          messages.filter(m => m.role === 'user').length >= 1) {
        setSession(prev => ({
          ...prev,
          showContactForm: true
        }));
      }
      
      setBotState('idle');
    } catch (error) {
      console.error('Error sending message:', error);
      setBotState('error');
    } finally {
      setIsLoading(false);
      setTypingMessage(null);
    }
  }, [messages, isLoading, session]);

  // Submit contact form
  const submitContactForm = useCallback(async (userInfo: UserInfo) => {
    setIsLoading(true);
    
    try {
      const success = await submitUserInfo(userInfo);
      
      if (success) {
        setSession(prev => ({
          ...prev,
          userInfo,
          showContactForm: false,
          contactFormSubmitted: true
        }));
        
        // Add confirmation message
        const thankYouMessage: Message = {
          id: crypto.randomUUID(),
          role: 'bot',
          content: config.responses.thankYouMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, thankYouMessage]);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsLoading(false);
    }
  }, [config.responses.thankYouMessage]);

  // Request human assistance
  const requestHumanAssistance = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const message = await requestHumanAssistance();
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error requesting human assistance:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    session,
    messages,
    isOpen,
    isLoading,
    botState,
    typingMessage,
    showContactForm: session.showContactForm,
    toggleChat,
    sendMessage,
    submitContactForm,
    requestHumanAssistance,
    closeChat
  };
};

export default useChatbot;
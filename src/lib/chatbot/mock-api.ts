// Type definitions for the chatbot API
export interface Message {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

export interface UserInfo {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

// Storage keys
const STORAGE_KEYS = {
  CHAT_HISTORY: 'connectai_chat_history',
  USER_INFO: 'connectai_user_info'
};

// Simple in-memory message queue (in a real app, this would be a server)
let messageQueue: Message[] = [];

/**
 * Load chat history from storage
 */
export const loadChatHistory = (): Message[] => {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    if (!storedHistory) return [];
    
    const parsed = JSON.parse(storedHistory);
    
    // Convert string dates back to Date objects
    return parsed.map((msg: {id: string; role: 'user' | 'bot' | 'system'; content: string; timestamp: string; status?: 'sending' | 'sent' | 'error'}) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Save chat history to storage
 */
export const saveChatHistory = (messages: Message[]): void => {
  try {
    // Only keep the last 50 messages to prevent storage issues
    const messagesToSave = messages.slice(-50);
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messagesToSave));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    messageQueue = [];
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }
};

/**
 * Load user info from storage
 */
export const loadUserInfo = (): UserInfo | null => {
  try {
    const storedInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return storedInfo ? JSON.parse(storedInfo) : null;
  } catch (error) {
    console.error('Error loading user info:', error);
    return null;
  }
};

/**
 * Save user info to storage
 */
export const saveUserInfo = (info: UserInfo): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(info));
  } catch (error) {
    console.error('Error saving user info:', error);
  }
};

/**
 * Generate response based on user input
 * This is a simple mock - in a real app, this would call an API
 */
export const sendMessage = async (
  message: string,
  previousMessages: Message[]
): Promise<Message> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create response based on keywords in the message
  let responseText = '';
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
    responseText = "Hello! How can I help you today?";
  } else if (lowercaseMessage.includes('price') || lowercaseMessage.includes('cost')) {
    responseText = "Our pricing starts at $49/month for the Basic plan. We also offer Pro ($99/month) and Enterprise (custom pricing) plans.";
  } else if (lowercaseMessage.includes('feature') || lowercaseMessage.includes('what can you do')) {
    responseText = "ConnectAI offers AI-powered chat, knowledge base integration, lead generation, and seamless human handoff.";
  } else if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('human')) {
    responseText = "Would you like to speak with a human? I can connect you with our support team.";
  } else if (lowercaseMessage.includes('thank')) {
    responseText = "You're welcome! Is there anything else I can help you with?";
  } else if (lowercaseMessage.includes('bye')) {
    responseText = "Goodbye! Feel free to chat again if you have more questions.";
  } else {
    // Default response
    responseText = "I understand you're interested in ConnectAI. Could you please specify what you'd like to know about our product?";
  }
  
  // Create a response message
  const response: Message = {
    id: `bot-${Date.now()}`,
    role: 'bot',
    content: responseText,
    timestamp: new Date()
  };
  
  // Save to message queue and local storage
  const updatedMessages = [...previousMessages, {
    id: `user-${Date.now()}`,
    role: 'user',
    content: message,
    timestamp: new Date()
  }, response];
  
  // Save the updated history (but limit the size)
  saveChatHistory(updatedMessages);
  
  return response;
};

/**
 * Submit user information
 */
export const submitUserInfo = async (userInfo: UserInfo): Promise<boolean> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // In a real app, this would send data to a server
    saveUserInfo(userInfo);
    return true;
  } catch (error) {
    console.error('Error submitting user info:', error);
    return false;
  }
};

/**
 * Request human assistance
 */
export const requestHumanAssistance = async (): Promise<Message> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const message: Message = {
    id: `bot-${Date.now()}`,
    role: 'bot',
    content: "I've notified our team, and a human agent will follow up with you shortly via email.",
    timestamp: new Date()
  };
  
  // Save to history
  const history = loadChatHistory();
  saveChatHistory([...history, message]);
  
  return message;
};
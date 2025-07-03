import { v4 as uuidv4 } from 'uuid';

// Types for configuration
export interface ChatbotConfig {
  id: string;
  name: string;
  responses: {
    welcomeMessage: string;
    fallbackMessage: string;
    leadCapturePrompt: string;
    thankYouMessage: string;
    humanHandoffMessage: string;
    autoResponses: AutoResponse[];
  };
  knowledgeBase: {
    sources: KnowledgeSource[];
    enabled: boolean;
  };
  leadGeneration: {
    enabled: boolean;
    captureAfterMessages: number;
    requiredFields: string[];
    leadCaptureTrigger: 'auto' | 'intent' | 'manual';
  };
  appearance: {
    primaryColor: string;
    fontFamily: string;
    chatBubbleIcon: string;
    chatBubbleText: string;
    avatarUrl: string;
    headerText: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  };
  apiSettings: {
    endpoint: string;
    model: string;
    temperature: number;
    systemPrompt: string;
  };
  lastUpdated: string;
}

export interface AutoResponse {
  id: string;
  triggerType: 'keyword' | 'intent' | 'entity';
  trigger: string;
  response: string;
  active: boolean;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: 'url' | 'document' | 'qa';
  content: string;
  lastUpdated: string;
  enabled: boolean;
}

// Default configuration
const defaultConfig: ChatbotConfig = {
  id: uuidv4(),
  name: 'ConnectAI Chatbot',
  responses: {
    welcomeMessage: 'Hi there! 👋 Welcome to ConnectAI. How can I help you today?',
    fallbackMessage: "I'm sorry, I couldn't understand that. Could you try rephrasing your question?",
    leadCapturePrompt: "I'd be happy to help! Could you provide your name and email so we can continue the conversation?",
    thankYouMessage: "Thank you for your information! A member of our team will get back to you soon.",
    humanHandoffMessage: "I'm connecting you with a human support agent. Please wait a moment.",
    autoResponses: [
      {
        id: uuidv4(),
        triggerType: 'keyword',
        trigger: 'pricing',
        response: "We offer three plans: Basic ($49/mo), Pro ($99/mo), and Enterprise (custom pricing). Each plan includes different features and conversation limits. Would you like to know more about a specific plan?",
        active: true
      },
      {
        id: uuidv4(),
        triggerType: 'intent',
        trigger: 'greeting',
        response: "Hello! Thanks for reaching out to ConnectAI. How can I assist you today?",
        active: true
      },
      {
        id: uuidv4(),
        triggerType: 'keyword',
        trigger: 'features',
        response: "ConnectAI offers natural language processing, knowledge base integration, lead generation, analytics, and seamless human handoff. Which feature would you like to learn more about?",
        active: true
      }
    ]
  },
  knowledgeBase: {
    sources: [
      {
        id: uuidv4(),
        name: 'Product Documentation',
        type: 'url',
        content: 'https://docs.connectai.com',
        lastUpdated: new Date().toISOString(),
        enabled: true
      },
      {
        id: uuidv4(),
        name: 'FAQ',
        type: 'qa',
        content: JSON.stringify([
          { question: 'What is ConnectAI?', answer: 'ConnectAI is an intelligent chatbot platform that helps businesses engage with website visitors, generate leads, and provide support 24/7.' },
          { question: 'How do I install ConnectAI?', answer: 'Installing ConnectAI is simple! Just add our JavaScript snippet to your website, and you\'re ready to go. See our documentation for detailed instructions.' },
          { question: 'What makes ConnectAI different?', answer: 'ConnectAI combines advanced NLP with a user-friendly interface, making it easy to create powerful chatbots without coding. Our solution also features seamless human handoff and detailed analytics.' }
        ]),
        lastUpdated: new Date().toISOString(),
        enabled: true
      }
    ],
    enabled: true
  },
  leadGeneration: {
    enabled: true,
    captureAfterMessages: 2,
    requiredFields: ['name', 'email'],
    leadCaptureTrigger: 'intent'
  },
  appearance: {
    primaryColor: '#4f46e5',
    fontFamily: 'Inter, sans-serif',
    chatBubbleIcon: 'message-circle',
    chatBubbleText: 'Chat with us',
    avatarUrl: '/assets/avatar.png',
    headerText: 'ConnectAI Assistant',
    position: 'bottom-right'
  },
  apiSettings: {
    endpoint: 'https://api.connectai.com/v1',
    model: 'gpt-4',
    temperature: 0.7,
    systemPrompt: "You are an AI assistant for a company called ConnectAI. Your job is to assist customers with their questions about our product and services. Be friendly, helpful, and professional."
  },
  lastUpdated: new Date().toISOString()
};

/**
 * Config Service for managing chatbot configuration
 * This is a client-side implementation for demonstration purposes
 */
class ConfigService {
  private config: ChatbotConfig;
  private readonly STORAGE_KEY = 'connectai_config';
  
  constructor() {
    // Load config from localStorage or use default
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.config = JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing config:', error);
        this.config = { ...defaultConfig };
      }
    } else {
      this.config = { ...defaultConfig };
    }
  }
  
  /**
   * Get the current configuration
   */
  public getConfig = (): ChatbotConfig => {
    return { ...this.config };
  };
  
  /**
   * Save the configuration
   */
  public saveConfig = (config: ChatbotConfig): boolean => {
    try {
      this.config = {
        ...config,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  };
  
  /**
   * Update part of the configuration
   */
  public updateConfig = <K extends keyof ChatbotConfig>(
    key: K,
    value: ChatbotConfig[K]
  ): boolean => {
    try {
      this.config = {
        ...this.config,
        [key]: value,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error updating config:', error);
      return false;
    }
  };
  
  /**
   * Reset to default configuration
   */
  public resetConfig = (): ChatbotConfig => {
    this.config = { ...defaultConfig };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    return { ...this.config };
  };
  
  /**
   * Add an auto response
   */
  public addAutoResponse = (autoResponse: Omit<AutoResponse, 'id'>): boolean => {
    try {
      const newAutoResponse: AutoResponse = {
        ...autoResponse,
        id: uuidv4()
      };
      
      this.config.responses.autoResponses.push(newAutoResponse);
      this.config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error adding auto response:', error);
      return false;
    }
  };
  
  /**
   * Remove an auto response
   */
  public removeAutoResponse = (id: string): boolean => {
    try {
      this.config.responses.autoResponses = this.config.responses.autoResponses.filter(
        response => response.id !== id
      );
      this.config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error removing auto response:', error);
      return false;
    }
  };
  
  /**
   * Add a knowledge source
   */
  public addKnowledgeSource = (source: Omit<KnowledgeSource, 'id' | 'lastUpdated'>): boolean => {
    try {
      const newSource: KnowledgeSource = {
        ...source,
        id: uuidv4(),
        lastUpdated: new Date().toISOString()
      };
      
      this.config.knowledgeBase.sources.push(newSource);
      this.config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error adding knowledge source:', error);
      return false;
    }
  };
  
  /**
   * Remove a knowledge source
   */
  public removeKnowledgeSource = (id: string): boolean => {
    try {
      this.config.knowledgeBase.sources = this.config.knowledgeBase.sources.filter(
        source => source.id !== id
      );
      this.config.lastUpdated = new Date().toISOString();
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error removing knowledge source:', error);
      return false;
    }
  };
  
  /**
   * Export configuration
   */
  public exportConfig = (): string => {
    return JSON.stringify(this.config, null, 2);
  };
  
  /**
   * Import configuration
   */
  public importConfig = (configString: string): boolean => {
    try {
      const parsedConfig = JSON.parse(configString);
      
      // Validate that this is a proper config object
      if (!parsedConfig.responses || !parsedConfig.appearance) {
        throw new Error('Invalid configuration format');
      }
      
      this.config = {
        ...parsedConfig,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
      return true;
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  };
}

// Export a singleton instance
export const configService = new ConfigService();
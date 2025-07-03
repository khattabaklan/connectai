export type MessageSender = 'user' | 'bot';

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  isOpen: boolean;
  context: ConversationContext;
}

export interface ConversationContext {
  detectedIntents: Intent[];
  extractedEntities: Entity[];
  userDetails: Record<string, string>;
  previousResponses: string[];
}

export interface Intent {
  name: string;
  confidence: number;
}

export interface Entity {
  type: string;
  value: string;
  start: number;
  end: number;
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  message?: string;
}

export enum ChatbotState {
  INITIAL_GREETING = 'initial_greeting',
  GATHERING_INFORMATION = 'gathering_information',
  PROVIDING_INFORMATION = 'providing_information',
  LEAD_QUALIFICATION = 'lead_qualification',
  SCHEDULING = 'scheduling',
  HANDOFF_TO_HUMAN = 'handoff_to_human',
  CLOSING = 'closing'
}

export type ChatWidgetAppearance = {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  fontFamily: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  bubbleIcon?: string; // URL to custom icon
  bubbleText?: string;
};

export type ChatWidgetConfig = {
  appearance: ChatWidgetAppearance;
  welcomeMessage: string;
  placeholder: string;
  suggestedMessages: string[];
  autoOpen: boolean;
  openDelay?: number; // in milliseconds
};
// Type definitions for analytics service

export interface DailyStats {
  date: string;
  conversations: number;
  leads: number;
  avgResponseTime: number;
  handoffs: number;
}

export interface IntentStat {
  intent: string;
  count: number;
  percentage: number;
}

export interface ChatAnalytics {
  totalConversations: number;
  leadsGenerated: number;
  humanHandoffs: number;
  avgResponseTime: number;
  dailyStats: DailyStats[];
  intentStats: IntentStat[];
  filteredDailyStats: DailyStats[];
}

export interface MessageDetail {
  id: string;
  timestamp: string;
  content: string;
  type: 'user' | 'bot' | 'system';
  intent?: string;
  responseTimeMs?: number;
}

export interface Conversation {
  id: string;
  startTime: string;
  endTime: string;
  messages: MessageDetail[];
  userDetails?: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    [key: string]: string | undefined;
  };
  conversationRating?: number;
  handedOffToHuman: boolean;
  leadGenerated: boolean;
  tags: string[];
}

// Mock implementation will be handled by apiService
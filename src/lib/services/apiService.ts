import { v4 as uuidv4 } from 'uuid';
import { nlpService, TrainingExample, NlpModel } from './nlpService';
import { ChatAnalytics, Conversation } from './analyticsService';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface TrainingData {
  examples: TrainingExample[];
  intents: string[];
  entityTypes: string[];
  lastUpdated: string;
}

// Mock conversation data
const mockConversations: Conversation[] = Array.from({ length: 30 }, (_, i) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
  
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + Math.floor(Math.random() * 30));
  
  const messageCount = Math.floor(Math.random() * 10) + 2;
  const messages = Array.from({ length: messageCount }, (_, j) => {
    const messageDate = new Date(startDate);
    messageDate.setMinutes(messageDate.getMinutes() + j * 2);
    
    return {
      id: `msg_${i}_${j}`,
      timestamp: messageDate.toISOString(),
      content: j % 2 === 0
        ? ['Hi there', 'How does pricing work?', 'Can you help me?', 'What features do you offer?'][Math.floor(Math.random() * 4)]
        : ['Hello! How can I help?', 'We have several pricing tiers...', 'Sure, what do you need help with?', 'ConnectAI offers...'][Math.floor(Math.random() * 4)],
      type: j % 2 === 0 ? 'user' : 'bot',
      intent: j % 2 === 0 ? ['greeting', 'pricing', 'support', 'product_info'][Math.floor(Math.random() * 4)] : undefined,
      responseTimeMs: j % 2 === 0 ? undefined : Math.floor(Math.random() * 2000)
    };
  });
  
  const leadGenerated = Math.random() > 0.7;
  const handedOffToHuman = Math.random() > 0.8;
  const hasRating = Math.random() > 0.6;
  
  return {
    id: `conv_${i}`,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
    messages,
    userDetails: leadGenerated ? {
      name: ['Alex', 'Jamie', 'Jordan', 'Taylor'][Math.floor(Math.random() * 4)],
      email: ['alex@example.com', 'jamie@company.co', 'jordan@business.org', 'taylor@startup.io'][Math.floor(Math.random() * 4)],
      company: Math.random() > 0.5 ? ['Acme Inc', 'Globex', 'Initech', 'Stark Industries'][Math.floor(Math.random() * 4)] : undefined,
      phone: Math.random() > 0.7 ? ['555-1234', '555-5678', '555-9012', '555-3456'][Math.floor(Math.random() * 4)] : undefined
    } : undefined,
    conversationRating: hasRating ? Math.floor(Math.random() * 5) + 1 : undefined,
    handedOffToHuman,
    leadGenerated,
    tags: [
      ...(leadGenerated ? ['lead'] : []),
      ...(handedOffToHuman ? ['handoff'] : []),
      ...(Math.random() > 0.7 ? ['returning_visitor'] : []),
      ['pricing', 'support', 'product_info', 'implementation'][Math.floor(Math.random() * 4)]
    ]
  };
});

// Mock analytics data
const mockAnalytics: ChatAnalytics = {
  totalConversations: mockConversations.length,
  leadsGenerated: mockConversations.filter(c => c.leadGenerated).length,
  humanHandoffs: mockConversations.filter(c => c.handedOffToHuman).length,
  avgResponseTime: 1.8,
  dailyStats: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    date.setHours(0, 0, 0, 0);
    
    return {
      date: date.toISOString(),
      conversations: Math.floor(Math.random() * 10) + 1,
      leads: Math.floor(Math.random() * 5),
      avgResponseTime: Math.random() * 2 + 0.5,
      handoffs: Math.floor(Math.random() * 3)
    };
  }),
  intentStats: [
    { intent: 'product_info', count: 45, percentage: 30 },
    { intent: 'pricing', count: 35, percentage: 23.33 },
    { intent: 'support', count: 30, percentage: 20 },
    { intent: 'implementation', count: 20, percentage: 13.33 },
    { intent: 'greeting', count: 15, percentage: 10 },
    { intent: 'lead_generation', count: 5, percentage: 3.34 },
  ],
  filteredDailyStats: []
};

/**
 * API Service for handling backend communication
 * This is a mock implementation for demonstration purposes
 */
class ApiService {
  // Process a user message using NLP
  public processMessage = async (message: string): Promise<ApiResponse<{response: string}>> => {
    try {
      // Add a small delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { nlpResult, response } = nlpService.processAndRespond(message);
      
      console.log('NLP Result:', nlpResult);
      
      return {
        success: true,
        data: { response }
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        success: false,
        error: 'Failed to process message'
      };
    }
  };

  // Get analytics data
  public getAnalytics = async (): Promise<ApiResponse<ChatAnalytics>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Apply a default filter of 7 days
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      
      const filteredStats = mockAnalytics.dailyStats.filter(stat => {
        const statDate = new Date(stat.date);
        return statDate >= sevenDaysAgo;
      }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return {
        success: true,
        data: {
          ...mockAnalytics,
          filteredDailyStats: filteredStats
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch analytics'
      };
    }
  };

  // Export analytics data
  public exportAnalytics = async (): Promise<ApiResponse<string>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Include all conversations in the export
      const exportData = {
        analytics: mockAnalytics,
        conversations: mockConversations,
        exportDate: new Date().toISOString()
      };
      
      return {
        success: true,
        data: JSON.stringify(exportData, null, 2)
      };
    } catch (error) {
      console.error('Error exporting analytics:', error);
      return {
        success: false,
        error: 'Failed to export analytics'
      };
    }
  };

  // Get conversations with pagination
  public getConversations = async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<{conversations: Conversation[]; total: number}>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const conversations = mockConversations.slice(start, end);
      
      return {
        success: true,
        data: {
          conversations,
          total: mockConversations.length
        }
      };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        error: 'Failed to fetch conversations'
      };
    }
  };

  // Get a single conversation by ID
  public getConversation = async (id: string): Promise<ApiResponse<Conversation>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const conversation = mockConversations.find(c => c.id === id);
      
      if (!conversation) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }
      
      return {
        success: true,
        data: conversation
      };
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return {
        success: false,
        error: 'Failed to fetch conversation'
      };
    }
  };

  // Add a new conversation
  public addConversation = async (conversation: Omit<Conversation, 'id'>): Promise<ApiResponse<Conversation>> => {
    try {
      const newConversation: Conversation = {
        ...conversation,
        id: uuidv4()
      };
      
      mockConversations.push(newConversation);
      
      return {
        success: true,
        data: newConversation
      };
    } catch (error) {
      console.error('Error adding conversation:', error);
      return {
        success: false,
        error: 'Failed to add conversation'
      };
    }
  };

  // Get training data from NLP service
  public getTrainingData = async (): Promise<ApiResponse<TrainingData>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const trainingData = nlpService.getTrainingData();
      
      return {
        success: true,
        data: trainingData
      };
    } catch (error) {
      console.error('Error fetching training data:', error);
      return {
        success: false,
        error: 'Failed to fetch training data'
      };
    }
  };

  // Add a training example
  public addTrainingExample = async (example: Omit<TrainingExample, 'id'>): Promise<ApiResponse<TrainingData>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = nlpService.addTrainingExample(example);
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error adding training example:', error);
      return {
        success: false,
        error: 'Failed to add training example'
      };
    }
  };

  // Update a training example
  public updateTrainingExample = async (id: string, example: Omit<TrainingExample, 'id'>): Promise<ApiResponse<TrainingData>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = nlpService.updateTrainingExample(id, example);
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error updating training example:', error);
      return {
        success: false,
        error: 'Failed to update training example'
      };
    }
  };

  // Delete a training example
  public deleteTrainingExample = async (id: string): Promise<ApiResponse<TrainingData>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = nlpService.deleteTrainingExample(id);
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error deleting training example:', error);
      return {
        success: false,
        error: 'Failed to delete training example'
      };
    }
  };

  // Import training data
  public importTrainingData = async (jsonData: string): Promise<ApiResponse<TrainingData>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = nlpService.importTrainingData(jsonData);
      
      if (!result.success) {
        return { success: false };
      }
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error importing training data:', error);
      return {
        success: false,
        error: 'Failed to import training data'
      };
    }
  };

  // Export training data
  public exportTrainingData = async (): Promise<ApiResponse<string>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const result = nlpService.exportTrainingData();
      
      return {
        success: result.success,
        data: result.data
      };
    } catch (error) {
      console.error('Error exporting training data:', error);
      return {
        success: false,
        error: 'Failed to export training data'
      };
    }
  };

  // Train NLP model
  public trainModel = async (): Promise<ApiResponse<NlpModel>> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = nlpService.trainModel();
      
      return {
        success: result.success,
        data: result.model
      };
    } catch (error) {
      console.error('Error training model:', error);
      return {
        success: false,
        error: 'Failed to train model'
      };
    }
  };
}

export const apiService = new ApiService();
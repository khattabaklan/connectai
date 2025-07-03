import { v4 as uuidv4 } from 'uuid';

// Define interfaces for NLP data structures
export interface Entity {
  type: string;
  value: string;
  start: number;
  end: number;
}

export interface Intent {
  name: string;
  confidence: number;
}

export interface NlpResult {
  text: string;
  intents: Intent[];
  entities: Entity[];
  sentiment: {
    score: number; // -1 (negative) to 1 (positive)
    label: 'negative' | 'neutral' | 'positive';
  };
}

export interface TrainingExample {
  id: string;
  text: string;
  intent: string;
  entities: Entity[];
}

export interface NlpModel {
  id: string;
  name: string;
  description: string;
  lastTrained: string;
  accuracy: number;
  examples: TrainingExample[];
  intents: string[];
  entityTypes: string[];
}

// Mock training data
const mockTrainingData = {
  examples: [
    {
      id: '1',
      text: 'I want to know more about your product features',
      intent: 'product_info',
      entities: [
        {
          type: 'attribute',
          value: 'features',
          start: 38,
          end: 46
        }
      ]
    },
    {
      id: '2',
      text: 'What are your pricing plans?',
      intent: 'pricing',
      entities: []
    },
    {
      id: '3',
      text: 'How do I implement ConnectAI on my website?',
      intent: 'implementation',
      entities: [
        {
          type: 'platform',
          value: 'website',
          start: 33,
          end: 40
        }
      ]
    },
    {
      id: '4',
      text: 'I need help setting up the chatbot',
      intent: 'support',
      entities: [
        {
          type: 'task',
          value: 'setting up',
          start: 12,
          end: 22
        },
        {
          type: 'product',
          value: 'chatbot',
          start: 27,
          end: 34
        }
      ]
    },
    {
      id: '5',
      text: 'Can you tell me about your AI capabilities?',
      intent: 'product_info',
      entities: [
        {
          type: 'attribute',
          value: 'AI capabilities',
          start: 25,
          end: 39
        }
      ]
    }
  ],
  intents: [
    'product_info', 
    'pricing', 
    'implementation', 
    'support', 
    'greeting',
    'goodbye',
    'lead_generation'
  ],
  entityTypes: [
    'attribute',
    'platform',
    'task',
    'product',
    'person',
    'company'
  ],
  lastUpdated: new Date().toISOString()
};

// Mock NLP model
const mockNlpModel: NlpModel = {
  id: '1',
  name: 'ConnectAI Core NLP',
  description: 'Core model for intent detection and entity extraction',
  lastTrained: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  accuracy: 0.87,
  examples: mockTrainingData.examples,
  intents: mockTrainingData.intents,
  entityTypes: mockTrainingData.entityTypes
};

// Mock responses for intents
const intentResponses: Record<string, string[]> = {
  product_info: [
    "ConnectAI offers advanced chatbot capabilities powered by natural language processing. Our solution can understand user intent, extract important information, and provide relevant answers based on your knowledge base.",
    "Our product includes features like intent recognition, entity extraction, knowledge base integration, and seamless human handoff when needed.",
    "ConnectAI helps businesses automate customer support, generate leads, and provide 24/7 assistance to website visitors."
  ],
  pricing: [
    "We offer three pricing tiers: Basic ($49/month), Pro ($99/month), and Enterprise (custom pricing). Each plan offers different features and conversation volumes.",
    "Our pricing is based on the number of monthly conversations and features needed. The Pro plan at $99/month is our most popular option.",
    "You can start with a 14-day free trial to test all Pro features before making a decision."
  ],
  implementation: [
    "Implementing ConnectAI on your website is easy! Just add our JavaScript snippet to your site, and you're ready to go. Our documentation provides step-by-step instructions.",
    "Setup takes just minutes. After signing up, you'll get a code snippet to add to your website. Then you can customize your chatbot through our admin dashboard.",
    "We offer a guided setup process to help you implement ConnectAI on your website, web app, or other platforms."
  ],
  support: [
    "I'd be happy to help you with setup or troubleshooting. Could you tell me more about what specific issue you're encountering?",
    "Our support team is available to help you with any implementation challenges. Would you like me to connect you with a support agent?",
    "For technical support, you can also check our documentation at docs.connectai.com or email support@connectai.com."
  ],
  greeting: [
    "Hello! Welcome to ConnectAI. How can I help you today?",
    "Hi there! I'm the ConnectAI assistant. What would you like to know about our services?",
    "Welcome! I'm here to answer questions about ConnectAI. What can I assist you with?"
  ],
  goodbye: [
    "Thank you for chatting with ConnectAI. Have a great day!",
    "It was great helping you today. Feel free to come back if you have more questions!",
    "Thanks for your interest in ConnectAI. Don't hesitate to reach out if you need anything else!"
  ],
  lead_generation: [
    "I'd be happy to connect you with our team. Could you provide your name and email so we can reach out?",
    "To help you better, would you mind sharing your contact information? Our team can follow up with more details.",
    "Would you like to schedule a demo with our team? We just need your name and email to set that up."
  ],
  default: [
    "I'm not sure I understood that correctly. Could you rephrase your question?",
    "I'm still learning! Could you ask that in a different way?",
    "I don't have information on that specific topic yet. Is there something else I can help you with?"
  ]
};

/**
 * NLP Service class for handling natural language processing
 * This is a mock implementation for demonstration purposes
 */
class NlpService {
  private model: NlpModel = mockNlpModel;
  private trainingData = mockTrainingData;
  
  /**
   * Process user message and return NLP analysis
   */
  public processMessage = (text: string): NlpResult => {
    // Simple intent matching based on keywords
    const lowerText = text.toLowerCase();
    
    // Default values
    let topIntent: Intent = { name: 'default', confidence: 0.3 };
    const intents: Intent[] = [];
    const entities: Entity[] = [];
    
    // Very basic intent detection
    this.model.intents.forEach(intent => {
      let confidence = 0;
      
      switch (intent) {
        case 'product_info':
          if (lowerText.includes('product') || 
              lowerText.includes('feature') ||
              lowerText.includes('capability') ||
              lowerText.includes('tell me about') ||
              lowerText.includes('what is') ||
              lowerText.includes('how does')) {
            confidence = 0.8;
          }
          break;
        
        case 'pricing':
          if (lowerText.includes('price') ||
              lowerText.includes('cost') ||
              lowerText.includes('subscription') ||
              lowerText.includes('plan') ||
              lowerText.includes('payment') ||
              lowerText.includes('how much')) {
            confidence = 0.9;
          }
          break;
        
        case 'implementation':
          if (lowerText.includes('implement') ||
              lowerText.includes('setup') ||
              lowerText.includes('install') ||
              lowerText.includes('integrate') ||
              lowerText.includes('add to') ||
              lowerText.includes('website')) {
            confidence = 0.85;
          }
          break;
        
        case 'support':
          if (lowerText.includes('help') ||
              lowerText.includes('support') ||
              lowerText.includes('issue') ||
              lowerText.includes('problem') ||
              lowerText.includes('trouble') ||
              lowerText.includes('doesn\'t work')) {
            confidence = 0.75;
          }
          break;
        
        case 'greeting':
          if (lowerText.includes('hi') ||
              lowerText.includes('hello') ||
              lowerText.includes('hey') ||
              lowerText === 'hey' ||
              lowerText === 'hi' ||
              lowerText === 'hello') {
            confidence = 0.95;
          }
          break;
        
        case 'goodbye':
          if (lowerText.includes('bye') ||
              lowerText.includes('goodbye') ||
              lowerText.includes('thank') ||
              lowerText.includes('thanks') ||
              lowerText === 'bye' ||
              lowerText === 'thanks') {
            confidence = 0.9;
          }
          break;
        
        case 'lead_generation':
          if (lowerText.includes('talk to') ||
              lowerText.includes('contact') ||
              lowerText.includes('sales') ||
              lowerText.includes('demo') ||
              lowerText.includes('trial') ||
              lowerText.includes('representative')) {
            confidence = 0.85;
          }
          break;
      }
      
      if (confidence > 0) {
        intents.push({ name: intent, confidence });
        
        // Update top intent if confidence is higher
        if (confidence > topIntent.confidence) {
          topIntent = { name: intent, confidence };
        }
      }
    });
    
    // If no intent was detected with reasonable confidence
    if (intents.length === 0) {
      intents.push(topIntent);
    }
    
    // Simple entity extraction based on the model's entityTypes
    this.model.entityTypes.forEach(entityType => {
      // In a real implementation, this would use named entity recognition
      // Here we're just doing very basic keyword matching
      const entityMatches: Record<string, RegExp> = {
        'attribute': /features|capabilities|pricing|performance/gi,
        'platform': /website|app|mobile|android|ios|web/gi,
        'task': /setup|configure|install|implement|integrate/gi,
        'product': /chatbot|assistant|ai|connectai/gi,
        'person': /agent|representative|human|person/gi,
        'company': /company|business|enterprise|organization/gi
      };
      
      const regex = entityMatches[entityType];
      if (regex) {
        let match;
        // eslint-disable-next-line no-cond-assign
        while (match = regex.exec(text)) {
          entities.push({
            type: entityType,
            value: match[0],
            start: match.index,
            end: match.index + match[0].length
          });
        }
      }
    });
    
    // Basic sentiment analysis
    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'like', 'helpful', 'thanks'];
    const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'dislike', 'problem', 'issue', 'not working'];
    
    let sentimentScore = 0;
    const words = lowerText.split(/\W+/);
    
    words.forEach(word => {
      if (positiveWords.includes(word)) sentimentScore += 0.2;
      if (negativeWords.includes(word)) sentimentScore -= 0.2;
    });
    
    // Clamp between -1 and 1
    sentimentScore = Math.max(-1, Math.min(1, sentimentScore));
    
    let sentimentLabel: 'negative' | 'neutral' | 'positive' = 'neutral';
    if (sentimentScore > 0.3) sentimentLabel = 'positive';
    if (sentimentScore < -0.3) sentimentLabel = 'negative';
    
    return {
      text,
      intents: intents.sort((a, b) => b.confidence - a.confidence),
      entities,
      sentiment: {
        score: sentimentScore,
        label: sentimentLabel
      }
    };
  };
  
  /**
   * Generate a response based on NLP analysis
   */
  public generateResponse = (result: NlpResult): string => {
    // Get the top intent
    const topIntent = result.intents[0]?.name || 'default';
    
    // Get possible responses for this intent
    const possibleResponses = intentResponses[topIntent] || intentResponses.default;
    
    // Select a random response
    const randomIndex = Math.floor(Math.random() * possibleResponses.length);
    return possibleResponses[randomIndex];
  };
  
  /**
   * Process a message and generate a response
   */
  public processAndRespond = (text: string): { 
    nlpResult: NlpResult; 
    response: string;
  } => {
    const nlpResult = this.processMessage(text);
    const response = this.generateResponse(nlpResult);
    
    return { nlpResult, response };
  };
  
  /**
   * Get the current NLP model
   */
  public getModel = (): NlpModel => {
    return { ...this.model };
  };
  
  /**
   * Get the training data
   */
  public getTrainingData = () => {
    return { ...this.trainingData };
  };
  
  /**
   * Add a new training example
   */
  public addTrainingExample = (example: Omit<TrainingExample, 'id'>): { 
    success: boolean; 
    data: typeof mockTrainingData;
  } => {
    const newExample = {
      ...example,
      id: uuidv4()
    };
    
    this.trainingData.examples.push(newExample);
    
    // Add any new intents
    if (!this.trainingData.intents.includes(example.intent)) {
      this.trainingData.intents.push(example.intent);
    }
    
    // Add any new entity types
    example.entities.forEach(entity => {
      if (!this.trainingData.entityTypes.includes(entity.type)) {
        this.trainingData.entityTypes.push(entity.type);
      }
    });
    
    return { success: true, data: { ...this.trainingData } };
  };
  
  /**
   * Update an existing training example
   */
  public updateTrainingExample = (id: string, example: Omit<TrainingExample, 'id'>): { 
    success: boolean; 
    data: typeof mockTrainingData;
  } => {
    const index = this.trainingData.examples.findIndex(e => e.id === id);
    
    if (index !== -1) {
      this.trainingData.examples[index] = {
        ...example,
        id
      };
      
      // Add any new intents
      if (!this.trainingData.intents.includes(example.intent)) {
        this.trainingData.intents.push(example.intent);
      }
      
      // Add any new entity types
      example.entities.forEach(entity => {
        if (!this.trainingData.entityTypes.includes(entity.type)) {
          this.trainingData.entityTypes.push(entity.type);
        }
      });
      
      return { success: true, data: { ...this.trainingData } };
    }
    
    return { success: false, data: { ...this.trainingData } };
  };
  
  /**
   * Delete a training example
   */
  public deleteTrainingExample = (id: string): { 
    success: boolean; 
    data: typeof mockTrainingData;
  } => {
    const initialLength = this.trainingData.examples.length;
    this.trainingData.examples = this.trainingData.examples.filter(e => e.id !== id);
    
    const success = this.trainingData.examples.length !== initialLength;
    return { success, data: { ...this.trainingData } };
  };
  
  /**
   * Import training data
   */
  public importTrainingData = (jsonData: string): { 
    success: boolean; 
    data?: typeof mockTrainingData;
  } => {
    try {
      const data = JSON.parse(jsonData);
      
      if (!data.examples || !Array.isArray(data.examples)) {
        return { success: false };
      }
      
      this.trainingData = {
        examples: data.examples,
        intents: data.intents || [],
        entityTypes: data.entityTypes || [],
        lastUpdated: new Date().toISOString()
      };
      
      return { success: true, data: { ...this.trainingData } };
    } catch (error) {
      console.error('Error importing training data:', error);
      return { success: false };
    }
  };
  
  /**
   * Export training data
   */
  public exportTrainingData = (): { 
    success: boolean; 
    data: string;
  } => {
    try {
      return { 
        success: true, 
        data: JSON.stringify(this.trainingData, null, 2)
      };
    } catch (error) {
      console.error('Error exporting training data:', error);
      return { success: false, data: '{}' };
    }
  };
  
  /**
   * Train the NLP model (mock implementation)
   */
  public trainModel = (): { 
    success: boolean; 
    model: NlpModel;
  } => {
    // In a real implementation, this would start a training job
    // Here we just update the model metadata
    this.model = {
      ...this.model,
      lastTrained: new Date().toISOString(),
      accuracy: Math.min(0.95, this.model.accuracy + Math.random() * 0.05),
      examples: [...this.trainingData.examples],
      intents: [...this.trainingData.intents],
      entityTypes: [...this.trainingData.entityTypes]
    };
    
    return { success: true, model: { ...this.model } };
  };
}

export const nlpService = new NlpService();
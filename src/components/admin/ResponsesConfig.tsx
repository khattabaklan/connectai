import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from 'sonner';

interface ResponseTemplate {
  id: string;
  trigger: string;
  response: string;
}

const ResponsesConfig: React.FC = () => {
  const [templates, setTemplates] = useState<ResponseTemplate[]>([
    { id: '1', trigger: 'greeting', response: 'Hello! Welcome to our website. How can I help you today?' },
    { id: '2', trigger: 'pricing', response: 'Our pricing plans start at $29/month. Would you like me to explain our different tiers?' },
    { id: '3', trigger: 'support', response: 'I\'m sorry to hear you\'re having trouble. Let me connect you with one of our support agents.' }
  ]);
  
  const [welcomeMessage, setWelcomeMessage] = useState<string>(
    'Hi there! 👋 I\'m your AI assistant. How can I help you today?'
  );
  
  const [fallbackMessage, setFallbackMessage] = useState<string>(
    'I\'m not sure I understand. Could you rephrase your question?'
  );

  const handleAddTemplate = () => {
    const newTemplate = {
      id: Date.now().toString(),
      trigger: '',
      response: ''
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleRemoveTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleUpdateTemplate = (id: string, field: 'trigger' | 'response', value: string) => {
    setTemplates(templates.map(template => 
      template.id === id ? { ...template, [field]: value } : template
    ));
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    toast.success('Automated responses saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="welcomeMessage">Welcome Message</Label>
          <Textarea 
            id="welcomeMessage"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            className="mt-1"
            placeholder="Enter the message shown when chat is first opened"
          />
        </div>
        
        <div>
          <Label htmlFor="fallbackMessage">Fallback Message</Label>
          <Textarea 
            id="fallbackMessage"
            value={fallbackMessage}
            onChange={(e) => setFallbackMessage(e.target.value)}
            className="mt-1"
            placeholder="Enter the message shown when the AI doesn't understand"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Response Templates</h3>
        <div className="space-y-4">
          {templates.map(template => (
            <Card key={template.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`trigger-${template.id}`}>Trigger (keywords or intent)</Label>
                      <Input 
                        id={`trigger-${template.id}`}
                        value={template.trigger}
                        onChange={(e) => handleUpdateTemplate(template.id, 'trigger', e.target.value)}
                        className="mt-1"
                        placeholder="e.g., greeting, pricing, support"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`response-${template.id}`}>Response</Label>
                      <Textarea 
                        id={`response-${template.id}`}
                        value={template.response}
                        onChange={(e) => handleUpdateTemplate(template.id, 'response', e.target.value)}
                        className="mt-1"
                        placeholder="Enter the automated response"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveTemplate(template.id)}
                    className="h-8 w-8 self-start mt-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex gap-4 mt-4">
          <Button variant="outline" onClick={handleAddTemplate}>
            <Plus className="mr-2 h-4 w-4" /> 
            Add Template
          </Button>
          
          <Button onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResponsesConfig;
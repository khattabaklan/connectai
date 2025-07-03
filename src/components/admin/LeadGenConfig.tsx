import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Trash2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'select';
  required: boolean;
  options?: string[];
}

const LeadGenConfig: React.FC = () => {
  const [enableLeadGen, setEnableLeadGen] = useState<boolean>(true);
  const [triggerBehavior, setTriggerBehavior] = useState<string>('time');
  const [triggerSeconds, setTriggerSeconds] = useState<number>(30);
  const [triggerPages, setTriggerPages] = useState<number>(2);
  const [triggerExit, setTriggerExit] = useState<boolean>(true);
  
  const [fields, setFields] = useState<FormField[]>([
    { id: '1', name: 'name', label: 'Name', type: 'text', required: true },
    { id: '2', name: 'email', label: 'Email Address', type: 'email', required: true },
    { id: '3', name: 'phone', label: 'Phone Number', type: 'phone', required: false },
    { id: '4', name: 'interest', label: 'Interest', type: 'select', required: false, options: ['Product Information', 'Pricing', 'Demo', 'Support'] }
  ]);

  const handleAddField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      name: '',
      label: '',
      type: 'text',
      required: false
    };
    
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleUpdateField = (id: string, field: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...field } : f));
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    toast.success('Lead generation settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">Enable Lead Generation</h3>
          <p className="text-muted-foreground text-sm">
            Collect visitor information through the chatbot
          </p>
        </div>
        <Switch 
          checked={enableLeadGen}
          onCheckedChange={setEnableLeadGen}
        />
      </div>

      <div className="border-t pt-6 space-y-4">
        <h3 className="text-lg font-medium">Trigger Settings</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="trigger-behavior">When to show lead form</Label>
            <Select value={triggerBehavior} onValueChange={setTriggerBehavior}>
              <SelectTrigger className="w-full" id="trigger-behavior">
                <SelectValue placeholder="Select trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="time">After time spent on site</SelectItem>
                <SelectItem value="pages">After viewing pages</SelectItem>
                <SelectItem value="exit">When about to exit</SelectItem>
                <SelectItem value="conversation">After conversation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {triggerBehavior === 'time' && (
            <div>
              <Label htmlFor="trigger-seconds">Seconds on site</Label>
              <Input 
                id="trigger-seconds"
                type="number"
                min="5"
                value={triggerSeconds}
                onChange={(e) => setTriggerSeconds(Number(e.target.value))}
              />
            </div>
          )}
          
          {triggerBehavior === 'pages' && (
            <div>
              <Label htmlFor="trigger-pages">Number of pages viewed</Label>
              <Input 
                id="trigger-pages"
                type="number"
                min="1"
                value={triggerPages}
                onChange={(e) => setTriggerPages(Number(e.target.value))}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="trigger-exit"
              checked={triggerExit}
              onCheckedChange={(checked) => setTriggerExit(checked as boolean)}
            />
            <Label htmlFor="trigger-exit">Also show on exit intent</Label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Form Fields</h3>
          <Button variant="outline" size="sm" onClick={handleAddField}>
            <Plus className="h-4 w-4 mr-2" /> Add Field
          </Button>
        </div>
        
        <div className="space-y-4">
          {fields.map(field => (
            <Card key={field.id}>
              <CardContent className="p-4">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`field-label-${field.id}`}>Field Label</Label>
                      <Input 
                        id={`field-label-${field.id}`}
                        value={field.label}
                        onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                        placeholder="e.g., Full Name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`field-type-${field.id}`}>Field Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value: 'text' | 'email' | 'phone' | 'select') => handleUpdateField(field.id, { type: value })}
                      >
                        <SelectTrigger id={`field-type-${field.id}`}>
                          <SelectValue placeholder="Select field type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-6">
                      <Checkbox 
                        id={`field-required-${field.id}`}
                        checked={field.required}
                        onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked as boolean })}
                      />
                      <Label htmlFor={`field-required-${field.id}`}>Required Field</Label>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveField(field.id)}
                    className="h-8 w-8 self-start mt-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {field.type === 'select' && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Dropdown Options (comma separated)</Label>
                    <Input 
                      value={field.options?.join(', ') || ''}
                      onChange={(e) => handleUpdateField(
                        field.id, 
                        { options: e.target.value.split(',').map(opt => opt.trim()) }
                      )}
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Button onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </div>
  );
};

export default LeadGenConfig;
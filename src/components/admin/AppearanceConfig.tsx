import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { Card, CardContent } from "@/components/ui/card";

const AppearanceConfig: React.FC = () => {
  const [chatTitle, setChatTitle] = useState<string>('Chat with us');
  const [primaryColor, setPrimaryColor] = useState<string>('#0070f3');
  const [accentColor, setAccentColor] = useState<string>('#00c2ff');
  const [position, setPosition] = useState<string>('right');
  const [autoOpen, setAutoOpen] = useState<boolean>(false);
  const [autoOpenDelay, setAutoOpenDelay] = useState<number>(30);
  const [showBranding, setShowBranding] = useState<boolean>(true);
  const [botName, setBotName] = useState<string>('ConnectAI Assistant');
  const [botAvatar, setBotAvatar] = useState<string>('/assets/bot-avatar.png');
  const [customCss, setCustomCss] = useState<string>(`.chat-widget {\n  /* Your custom CSS here */\n}`);

  const handleSaveChanges = () => {
    // In a real app, this would save to a database
    toast.success('Appearance settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="avatar">Avatar</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div>
            <Label htmlFor="chat-title">Chat Title</Label>
            <Input 
              id="chat-title"
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              placeholder="Chat with us"
            />
          </div>
          
          <div>
            <Label>Chat Position</Label>
            <RadioGroup value={position} onValueChange={setPosition} className="grid grid-cols-2 gap-4 mt-2">
              <Label 
                htmlFor="position-right" 
                className="flex items-center justify-center border rounded-lg p-4 cursor-pointer data-[state=checked]:border-primary"
                data-state={position === 'right' ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value="right" id="position-right" className="sr-only" />
                <div className="text-center">
                  <div className="w-32 h-16 bg-muted rounded-md mx-auto relative">
                    <div className="w-6 h-6 rounded-full bg-primary absolute bottom-2 right-2"></div>
                  </div>
                  <span className="text-sm mt-2 block">Bottom Right</span>
                </div>
              </Label>
              
              <Label 
                htmlFor="position-left" 
                className="flex items-center justify-center border rounded-lg p-4 cursor-pointer data-[state=checked]:border-primary"
                data-state={position === 'left' ? 'checked' : 'unchecked'}
              >
                <RadioGroupItem value="left" id="position-left" className="sr-only" />
                <div className="text-center">
                  <div className="w-32 h-16 bg-muted rounded-md mx-auto relative">
                    <div className="w-6 h-6 rounded-full bg-primary absolute bottom-2 left-2"></div>
                  </div>
                  <span className="text-sm mt-2 block">Bottom Left</span>
                </div>
              </Label>
            </RadioGroup>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Auto-open chat</h4>
                  <p className="text-muted-foreground text-sm">
                    Automatically open the chat widget after delay
                  </p>
                </div>
                <Switch 
                  checked={autoOpen}
                  onCheckedChange={setAutoOpen}
                />
              </div>
              
              {autoOpen && (
                <div className="mt-4">
                  <Label htmlFor="auto-open-delay">Delay (seconds)</Label>
                  <Input 
                    id="auto-open-delay"
                    type="number"
                    min="5"
                    value={autoOpenDelay}
                    onChange={(e) => setAutoOpenDelay(Number(e.target.value))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Show "Powered by ConnectAI"</h4>
                  <p className="text-muted-foreground text-sm">
                    Display ConnectAI branding in the chat widget
                  </p>
                </div>
                <Switch 
                  checked={showBranding}
                  onCheckedChange={setShowBranding}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="colors" className="space-y-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex space-x-2">
              <div className="flex-shrink-0">
                <Input 
                  id="color-picker-primary"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
              </div>
              <Input 
                id="primary-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="#0070f3"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex space-x-2">
              <div className="flex-shrink-0">
                <Input 
                  id="color-picker-accent"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
              </div>
              <Input 
                id="accent-color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="#00c2ff"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-4">Preview</h4>
            <div className="border rounded-md p-6">
              <div className="max-w-sm mx-auto border shadow-sm rounded-md overflow-hidden">
                <div className="p-3" style={{ backgroundColor: primaryColor }}>
                  <h3 className="text-white font-medium">{chatTitle}</h3>
                </div>
                <div className="p-4 bg-white space-y-4">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-[80%]">
                      <p>Hi there! How can I help you today?</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 justify-end">
                    <div 
                      className="rounded-lg p-3 text-sm max-w-[80%] text-white" 
                      style={{ backgroundColor: accentColor }}
                    >
                      <p>I'd like to learn more about your services.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="avatar" className="space-y-4">
          <div>
            <Label htmlFor="bot-name">Bot Name</Label>
            <Input 
              id="bot-name"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              placeholder="AI Assistant"
            />
          </div>
          
          <div>
            <Label htmlFor="bot-avatar">Bot Avatar URL</Label>
            <Input 
              id="bot-avatar"
              value={botAvatar}
              onChange={(e) => setBotAvatar(e.target.value)}
              placeholder="/assets/bot-avatar.png"
            />
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium mb-4">Avatar Preview</h4>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full border overflow-hidden">
                <img 
                  src={botAvatar} 
                  alt={botName} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=AI';
                  }} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h5 className="font-medium">{botName}</h5>
                <p className="text-muted-foreground text-sm">AI Assistant</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          <div>
            <Label htmlFor="custom-css">Custom CSS</Label>
            <Textarea 
              id="custom-css"
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              placeholder="Enter custom CSS"
              className="font-mono text-sm"
              rows={10}
            />
            <p className="text-muted-foreground text-sm mt-2">
              Custom CSS will be applied to the chat widget. Use with caution.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      
      <Button onClick={handleSaveChanges} className="mt-6">
        Save Changes
      </Button>
    </div>
  );
};

export default AppearanceConfig;
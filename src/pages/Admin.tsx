import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, LogOut, User, Code } from 'lucide-react';
import ResponsesConfig from '@/components/admin/ResponsesConfig';
import KnowledgeBaseConfig from '@/components/admin/KnowledgeBaseConfig';
import LeadGenConfig from '@/components/admin/LeadGenConfig';
import AppearanceConfig from '@/components/admin/AppearanceConfig';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import NlpTraining from '@/components/admin/NlpTraining';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('config');

  // Generate integration code for the website
  const generateIntegrationCode = () => {
    const code = `<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://connectai.yourdomain.com/widget.js';
    script.async = true;
    script.setAttribute('data-client-id', 'YOUR_CLIENT_ID');
    document.head.appendChild(script);
  })();
</script>`;
    
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Integration code copied to clipboard!');
    });
    
    return code;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ConnectAI Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and customize your chatbot</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">{user?.name}</span>
          </div>
          <Link to="/profile">
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-1 md:grid-cols-3 max-w-md">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="nlp">AI Training</TabsTrigger>
        </TabsList>
        
        {/* Configuration Tab */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar with stats */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Total Conversations</p>
                    <p className="text-3xl font-bold">128</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Leads Generated</p>
                    <p className="text-3xl font-bold">34</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Human Handoffs</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg. Response Time</p>
                    <p className="text-3xl font-bold">1.2s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Integration code */}
              <Card>
                <CardHeader>
                  <CardTitle>Website Integration</CardTitle>
                  <CardDescription>Add this code to your website to enable the chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    {`<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://connectai.yourdomain.com/widget.js';
    script.async = true;
    script.setAttribute('data-client-id', 'YOUR_CLIENT_ID');
    document.head.appendChild(script);
  })();
</script>`}
                  </pre>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" onClick={generateIntegrationCode}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </CardFooter>
              </Card>

              {/* Configuration tabs */}
              <Card>
                <CardHeader>
                  <CardTitle>Chatbot Configuration</CardTitle>
                  <CardDescription>Customize how your chatbot behaves and appears</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="responses">
                    <TabsList className="mb-4">
                      <TabsTrigger value="responses">Automated Responses</TabsTrigger>
                      <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                      <TabsTrigger value="leads">Lead Generation</TabsTrigger>
                      <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="responses">
                      <ResponsesConfig />
                    </TabsContent>
                    
                    <TabsContent value="knowledge">
                      <KnowledgeBaseConfig />
                    </TabsContent>
                    
                    <TabsContent value="leads">
                      <LeadGenConfig />
                    </TabsContent>
                    
                    <TabsContent value="appearance">
                      <AppearanceConfig />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
        
        {/* NLP Training Tab */}
        <TabsContent value="nlp">
          <NlpTraining />
        </TabsContent>
      </Tabs>
      
      {/* API Configuration Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure your backend API settings</CardDescription>
          </div>
          <Code className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">API Endpoint</label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="https://api.connectai.com/v1"
                    placeholder="API URL"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">API Key</label>
                <div className="relative">
                  <input 
                    type="password" 
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="sk-••••••••••••••••••••••••"
                    placeholder="API Key"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Model</label>
                <select className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="gpt-4">GPT-4 (Recommended)</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="claude-2">Claude 2</option>
                  <option value="llama-2-70b">Llama 2 (70B)</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Temperature</label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    defaultValue="0.7" 
                    className="w-full"
                  />
                  <span className="text-sm">0.7</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">System Prompt</label>
              <textarea 
                className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                defaultValue="You are an AI assistant for a company called ConnectAI. Your job is to assist customers with their questions about our product and services. Be friendly, helpful, and professional."
                placeholder="Enter a system prompt for your AI"
              ></textarea>
              <p className="text-xs text-muted-foreground mt-1">
                This system prompt guides your AI's behavior and knowledge base
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => toast.success('API settings saved successfully')}>
            Save API Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminDashboard;
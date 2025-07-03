import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, Trash2, Edit, Link, FilePlus, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { configService, KnowledgeSource } from '@/lib/services/configService';

// Knowledge source types
type SourceType = 'url' | 'document' | 'qa';

// Source type labels
const sourceTypeLabels: Record<SourceType, string> = {
  url: 'Website URL',
  document: 'Document',
  qa: 'Q&A Pairs'
};

// File type options
const allowedFileTypes = [
  { value: 'pdf', label: 'PDF Document (.pdf)' },
  { value: 'docx', label: 'Word Document (.docx)' },
  { value: 'txt', label: 'Text File (.txt)' },
  { value: 'md', label: 'Markdown (.md)' },
];

const KnowledgeUploader: React.FC = () => {
  const [sources, setSources] = useState<KnowledgeSource[]>(configService.getConfig().knowledgeBase.sources);
  const [knowledgeEnabled, setKnowledgeEnabled] = useState<boolean>(configService.getConfig().knowledgeBase.enabled);
  
  // New source state
  const [activeTab, setActiveTab] = useState<SourceType>('url');
  const [newSourceName, setNewSourceName] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [selectedFileType, setSelectedFileType] = useState<string>('pdf');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newQaPairs, setNewQaPairs] = useState<{question: string, answer: string}[]>([
    { question: '', answer: '' }
  ]);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editingSource, setEditingSource] = useState<KnowledgeSource | null>(null);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  
  // Update knowledge base settings
  const handleKnowledgeEnabledChange = (enabled: boolean) => {
    setKnowledgeEnabled(enabled);
    
    const config = configService.getConfig();
    configService.updateConfig('knowledgeBase', {
      ...config.knowledgeBase,
      enabled
    });
    
    toast.success(`Knowledge base ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  // Add a URL source
  const handleAddUrlSource = () => {
    if (!newSourceName.trim()) {
      toast.error('Please enter a name for this source');
      return;
    }
    
    if (!newUrl.trim() || !isValidUrl(newUrl)) {
      toast.error('Please enter a valid URL');
      return;
    }
    
    const success = configService.addKnowledgeSource({
      name: newSourceName,
      type: 'url',
      content: newUrl,
      enabled: true
    });
    
    if (success) {
      toast.success('URL source added successfully');
      setSources(configService.getConfig().knowledgeBase.sources);
      setNewSourceName('');
      setNewUrl('');
    } else {
      toast.error('Failed to add URL source');
    }
  };
  
  // Add a document source
  const handleAddDocumentSource = () => {
    if (!newSourceName.trim()) {
      toast.error('Please enter a name for this source');
      return;
    }
    
    // Simulate file upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate processing delay
    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      setUploadProgress(0);
      
      const success = configService.addKnowledgeSource({
        name: newSourceName,
        type: 'document',
        content: `mock_document_${Date.now()}.${selectedFileType}`,
        enabled: true
      });
      
      if (success) {
        toast.success('Document uploaded successfully');
        setSources(configService.getConfig().knowledgeBase.sources);
        setNewSourceName('');
      } else {
        toast.error('Failed to upload document');
      }
      
      // Show processing dialog
      setProcessingStatus('processing');
      setDialogOpen(true);
      
      // Simulate processing completion
      setTimeout(() => {
        setProcessingStatus(Math.random() > 0.9 ? 'error' : 'success');
      }, 3000);
    }, 3000);
  };
  
  // Add Q&A pairs
  const handleAddQaPairs = () => {
    if (!newSourceName.trim()) {
      toast.error('Please enter a name for this source');
      return;
    }
    
    // Filter out empty Q&A pairs
    const validPairs = newQaPairs.filter(pair => pair.question.trim() && pair.answer.trim());
    
    if (validPairs.length === 0) {
      toast.error('Please add at least one valid Q&A pair');
      return;
    }
    
    const success = configService.addKnowledgeSource({
      name: newSourceName,
      type: 'qa',
      content: JSON.stringify(validPairs),
      enabled: true
    });
    
    if (success) {
      toast.success('Q&A pairs added successfully');
      setSources(configService.getConfig().knowledgeBase.sources);
      setNewSourceName('');
      setNewQaPairs([{ question: '', answer: '' }]);
    } else {
      toast.error('Failed to add Q&A pairs');
    }
  };
  
  // Update Q&A pair
  const updateQaPair = (index: number, field: 'question' | 'answer', value: string) => {
    const updatedPairs = [...newQaPairs];
    updatedPairs[index][field] = value;
    setNewQaPairs(updatedPairs);
    
    // Add a new empty pair if this is the last one and it's not empty
    if (index === updatedPairs.length - 1 && value) {
      if (updatedPairs[index].question && updatedPairs[index].answer) {
        setNewQaPairs([...updatedPairs, { question: '', answer: '' }]);
      }
    }
  };
  
  // Remove a Q&A pair
  const removeQaPair = (index: number) => {
    if (newQaPairs.length === 1) {
      // Don't remove the last pair, just clear it
      setNewQaPairs([{ question: '', answer: '' }]);
      return;
    }
    
    const updatedPairs = [...newQaPairs];
    updatedPairs.splice(index, 1);
    setNewQaPairs(updatedPairs);
  };
  
  // Edit a source
  const handleEditSource = (source: KnowledgeSource) => {
    setEditingSource(source);
    
    // Set form fields based on source type
    setNewSourceName(source.name);
    
    if (source.type === 'url') {
      setNewUrl(source.content);
      setActiveTab('url');
    } else if (source.type === 'qa') {
      try {
        const pairs = JSON.parse(source.content);
        setNewQaPairs(pairs);
      } catch {
        setNewQaPairs([{ question: '', answer: '' }]);
      }
      setActiveTab('qa');
    } else {
      // Document type can't be edited, just the name
      setActiveTab('document');
    }
  };
  
  // Toggle source enabled status
  const toggleSourceEnabled = (id: string, enabled: boolean) => {
    const updatedSources = sources.map(source => 
      source.id === id ? { ...source, enabled } : source
    );
    
    const config = configService.getConfig();
    configService.updateConfig('knowledgeBase', {
      ...config.knowledgeBase,
      sources: updatedSources
    });
    
    setSources(updatedSources);
    toast.success(`Source ${enabled ? 'enabled' : 'disabled'}`);
  };
  
  // Delete a source
  const handleDeleteSource = (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge source?')) {
      const success = configService.removeKnowledgeSource(id);
      
      if (success) {
        toast.success('Knowledge source deleted');
        setSources(configService.getConfig().knowledgeBase.sources);
      } else {
        toast.error('Failed to delete knowledge source');
      }
    }
  };
  
  // Validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Refresh the knowledge base (simulated)
  const handleRefreshKnowledgeBase = () => {
    setProcessingStatus('processing');
    setDialogOpen(true);
    
    // Simulate processing completion
    setTimeout(() => {
      setProcessingStatus('success');
    }, 3000);
  };
  
  // Get source type icon
  const getSourceTypeIcon = (type: SourceType) => {
    switch (type) {
      case 'url':
        return <Link className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'qa':
        return <FilePlus className="h-4 w-4" />;
    }
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>
                Train your chatbot with your company's data and documents
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={knowledgeEnabled}
                onCheckedChange={handleKnowledgeEnabledChange}
                id="knowledge-enabled"
              />
              <Label htmlFor="knowledge-enabled">
                {knowledgeEnabled ? 'Enabled' : 'Disabled'}
              </Label>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Knowledge sources table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Knowledge Sources</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshKnowledgeBase}
              >
                Refresh Knowledge Base
              </Button>
            </div>
            
            {sources.length === 0 ? (
              <div className="text-center p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground">
                  No knowledge sources added yet. Add a URL, document, or Q&A pairs below.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sources.map(source => (
                      <TableRow key={source.id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getSourceTypeIcon(source.type)}
                            <span className="ml-2">{source.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sourceTypeLabels[source.type]}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(source.lastUpdated)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={source.enabled}
                              onCheckedChange={enabled => toggleSourceEnabled(source.id, enabled)}
                              size="sm"
                            />
                            <span className="ml-2 text-xs text-muted-foreground">
                              {source.enabled ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditSource(source)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDeleteSource(source.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Add new knowledge source */}
          <div>
            <h3 className="text-lg font-medium mb-4">Add Knowledge Source</h3>
            
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SourceType)}>
              <TabsList className="mb-4">
                <TabsTrigger value="url">Website URL</TabsTrigger>
                <TabsTrigger value="document">Upload Document</TabsTrigger>
                <TabsTrigger value="qa">Q&A Pairs</TabsTrigger>
              </TabsList>
              
              <div className="space-y-4">
                {/* Common field: source name */}
                <div>
                  <Label htmlFor="source-name">Source Name</Label>
                  <Input
                    id="source-name"
                    placeholder="e.g., Product Documentation, FAQ, Company Policy"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                  />
                </div>
                
                {/* URL source */}
                <TabsContent value="url" className="space-y-4">
                  <div>
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com/documentation"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter the URL of a webpage containing relevant information
                    </p>
                  </div>
                  
                  <Button onClick={handleAddUrlSource}>Add URL Source</Button>
                </TabsContent>
                
                {/* Document upload */}
                <TabsContent value="document" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-type">Document Type</Label>
                    <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                      <SelectTrigger id="file-type">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedFileTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-muted-foreground">
                        {allowedFileTypes.map(type => `.${type.value}`).join(', ')} (max 10MB)
                      </p>
                    </div>
                  </div>
                  
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                  
                  <Button onClick={handleAddDocumentSource} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </TabsContent>
                
                {/* Q&A pairs */}
                <TabsContent value="qa" className="space-y-4">
                  {newQaPairs.map((pair, index) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Q&A Pair #{index + 1}</h4>
                        {index > 0 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeQaPair(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor={`question-${index}`}>Question</Label>
                        <Input
                          id={`question-${index}`}
                          placeholder="e.g., How do I integrate ConnectAI with my website?"
                          value={pair.question}
                          onChange={(e) => updateQaPair(index, 'question', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`answer-${index}`}>Answer</Label>
                        <Textarea
                          id={`answer-${index}`}
                          placeholder="Provide a detailed answer..."
                          value={pair.answer}
                          onChange={(e) => updateQaPair(index, 'answer', e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={handleAddQaPairs}>Add Q&A Pairs</Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </CardContent>
        
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Adding knowledge sources helps your AI provide more accurate and relevant responses based on your business information.
          </p>
        </CardFooter>
      </Card>
      
      {/* Processing dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {processingStatus === 'processing' && 'Processing Knowledge Base'}
              {processingStatus === 'success' && 'Knowledge Base Updated'}
              {processingStatus === 'error' && 'Processing Failed'}
            </DialogTitle>
            <DialogDescription>
              {processingStatus === 'processing' 
                ? 'Please wait while we process your knowledge base...'
                : processingStatus === 'success'
                ? 'Your knowledge base has been successfully updated.'
                : 'There was an error processing your knowledge base.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {processingStatus === 'processing' && (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <div className="text-center">
                  <p>This may take a few minutes depending on the size of your content.</p>
                </div>
              </>
            )}
            
            {processingStatus === 'success' && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your chatbot can now use this knowledge to respond to user questions.
                </AlertDescription>
              </Alert>
            )}
            
            {processingStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  We encountered an issue processing your knowledge base. Please try again or contact support if the problem persists.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            {processingStatus !== 'processing' && (
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeUploader;
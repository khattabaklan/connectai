import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Save, RefreshCw, Upload, Download, X, Check } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { apiService } from '@/lib/services/apiService';

interface Entity {
  type: string;
  value: string;
  start: number;
  end: number;
}

interface TrainingExample {
  id: string;
  text: string;
  intent: string;
  entities: Entity[];
}

interface TrainingData {
  examples: TrainingExample[];
  intents: string[];
  entityTypes: string[];
  lastUpdated: string;
}

const NlpTraining: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [trainingData, setTrainingData] = useState<TrainingData | null>(null);
  const [activeExample, setActiveExample] = useState<TrainingExample | null>(null);
  const [newIntent, setNewIntent] = useState<string>('');
  const [newEntityType, setNewEntityType] = useState<string>('');
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [importJson, setImportJson] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterIntent, setFilterIntent] = useState<string>('all');
  
  // Fetch training data
  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getTrainingData();
      if (response.success && response.data) {
        setTrainingData(response.data);
      } else {
        toast.error('Failed to load training data');
      }
    } catch (error) {
      console.error('Error fetching training data:', error);
      toast.error('Failed to load training data');
    } finally {
      setLoading(false);
    }
  };
  
  // Load data on mount
  useEffect(() => {
    fetchTrainingData();
  }, []);
  
  // Handle creating a new training example
  const handleAddExample = () => {
    setActiveExample({
      id: '',
      text: '',
      intent: trainingData?.intents[0] || '',
      entities: []
    });
  };
  
  // Handle editing an existing example
  const handleEditExample = (example: TrainingExample) => {
    setActiveExample({...example});
  };
  
  // Handle saving an example
  const handleSaveExample = async () => {
    if (!activeExample || !trainingData) return;
    
    try {
      if (activeExample.id) {
        // Update existing example
        const response = await apiService.updateTrainingExample(activeExample.id, activeExample);
        if (response.success && response.data) {
          setTrainingData(response.data);
          toast.success('Training example updated successfully');
          setActiveExample(null);
        }
      } else {
        // Add new example
        const response = await apiService.addTrainingExample(activeExample);
        if (response.success && response.data) {
          setTrainingData(response.data);
          toast.success('Training example added successfully');
          setActiveExample(null);
        }
      }
    } catch (error) {
      console.error('Error saving training example:', error);
      toast.error('Failed to save training example');
    }
  };
  
  // Handle deleting an example
  const handleDeleteExample = async (id: string) => {
    if (!confirm('Are you sure you want to delete this example?')) return;
    
    try {
      const response = await apiService.deleteTrainingExample(id);
      if (response.success && response.data) {
        setTrainingData(response.data);
        toast.success('Training example deleted');
      }
    } catch (error) {
      console.error('Error deleting training example:', error);
      toast.error('Failed to delete training example');
    }
  };
  
  // Handle adding a new intent
  const handleAddIntent = async () => {
    if (!newIntent.trim() || !trainingData) return;
    
    // Check if intent already exists
    if (trainingData.intents.includes(newIntent)) {
      toast.error('This intent already exists');
      return;
    }
    
    try {
      // Create a simple example with the new intent
      const example = {
        text: `Example for ${newIntent}`,
        intent: newIntent,
        entities: []
      };
      
      const response = await apiService.addTrainingExample(example);
      if (response.success && response.data) {
        setTrainingData(response.data);
        setNewIntent('');
        toast.success(`Intent "${newIntent}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding intent:', error);
      toast.error('Failed to add intent');
    }
  };
  
  // Handle adding a new entity type
  const handleAddEntityType = async () => {
    if (!newEntityType.trim() || !trainingData) return;
    
    // Check if entity type already exists
    if (trainingData.entityTypes.includes(newEntityType)) {
      toast.error('This entity type already exists');
      return;
    }
    
    try {
      // Add a simple example with this entity type
      const text = `Example with ${newEntityType}`;
      const example = {
        text,
        intent: trainingData.intents[0] || 'default',
        entities: [{
          type: newEntityType,
          value: newEntityType,
          start: text.indexOf(newEntityType),
          end: text.indexOf(newEntityType) + newEntityType.length
        }]
      };
      
      const response = await apiService.addTrainingExample(example);
      if (response.success && response.data) {
        setTrainingData(response.data);
        setNewEntityType('');
        toast.success(`Entity type "${newEntityType}" added successfully`);
      }
    } catch (error) {
      console.error('Error adding entity type:', error);
      toast.error('Failed to add entity type');
    }
  };
  
  // Handle adding entity to current example
  const handleAddEntity = () => {
    if (!activeExample) return;
    
    // Get selected text
    const selection = window.getSelection();
    const textArea = document.getElementById('example-text') as HTMLTextAreaElement;
    
    if (!selection || !textArea || selection.toString().length === 0) {
      toast.error('Please select some text to mark as an entity');
      return;
    }
    
    // Calculate the start and end positions
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = activeExample.text.substring(start, end);
    
    if (start === end) {
      toast.error('Please select some text to mark as an entity');
      return;
    }
    
    // Open dialog to select entity type
    // For simplicity, we're just using the first entity type
    // In a real implementation, you would show a dialog to choose the type
    if (trainingData && trainingData.entityTypes.length > 0) {
      const newEntity: Entity = {
        type: trainingData.entityTypes[0],
        value: selectedText,
        start,
        end
      };
      
      setActiveExample({
        ...activeExample,
        entities: [...activeExample.entities, newEntity]
      });
      
      toast.success(`Entity "${selectedText}" marked as "${newEntity.type}"`);
    } else {
      toast.error('No entity types defined. Please add one first.');
    }
  };
  
  // Handle removing entity from current example
  const handleRemoveEntity = (index: number) => {
    if (!activeExample) return;
    
    const newEntities = [...activeExample.entities];
    newEntities.splice(index, 1);
    
    setActiveExample({
      ...activeExample,
      entities: newEntities
    });
  };
  
  // Handle exporting training data
  const handleExportData = async () => {
    try {
      const response = await apiService.exportTrainingData();
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `connectai-nlp-training-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Training data exported successfully');
      }
    } catch (error) {
      console.error('Error exporting training data:', error);
      toast.error('Failed to export training data');
    }
  };
  
  // Handle importing training data
  const handleImportData = async () => {
    if (!importJson.trim()) {
      toast.error('Please enter JSON data to import');
      return;
    }
    
    try {
      const response = await apiService.importTrainingData(importJson);
      if (response.success && response.data) {
        setImportDialogOpen(false);
        setImportJson('');
        await fetchTrainingData();
        toast.success('Training data imported successfully');
      } else {
        toast.error('Invalid JSON format or data structure');
      }
    } catch (error) {
      console.error('Error importing training data:', error);
      toast.error('Failed to import training data');
    }
  };
  
  // Filter examples based on search query and selected intent
  const filteredExamples = trainingData?.examples.filter(example => {
    const matchesSearch = searchQuery === '' || 
      example.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIntent = filterIntent === 'all' || example.intent === filterIntent;
    
    return matchesSearch && matchesIntent;
  }) || [];
  
  // Loading state
  if (loading && !trainingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status"></div>
          <p className="mt-4">Loading NLP training data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-2xl font-bold">NLP Training</h2>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="examples">
        <TabsList className="mb-4">
          <TabsTrigger value="examples">Training Examples</TabsTrigger>
          <TabsTrigger value="intents">Intents</TabsTrigger>
          <TabsTrigger value="entities">Entity Types</TabsTrigger>
        </TabsList>
        
        {/* Training Examples Tab */}
        <TabsContent value="examples">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Training Examples</CardTitle>
                    <CardDescription>
                      Create examples to train your AI on user intents and entities
                    </CardDescription>
                  </div>
                  
                  <Button onClick={handleAddExample}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Example
                  </Button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  <div className="flex-grow">
                    <Input
                      placeholder="Search examples..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select 
                    value={filterIntent} 
                    onValueChange={setFilterIntent}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by intent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All intents</SelectItem>
                      {trainingData?.intents.map(intent => (
                        <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Example Text</TableHead>
                        <TableHead>Intent</TableHead>
                        <TableHead>Entities</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExamples.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            {searchQuery || filterIntent !== 'all' ? 
                              'No matching examples found' : 
                              'No examples yet. Add your first training example!'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExamples.map(example => (
                          <TableRow key={example.id}>
                            <TableCell className="font-mono text-sm">
                              {example.text.length > 50 
                                ? `${example.text.substring(0, 50)}...` 
                                : example.text}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{example.intent}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {example.entities.map((entity, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {entity.type}: {entity.value}
                                  </Badge>
                                ))}
                                {example.entities.length === 0 && (
                                  <span className="text-muted-foreground text-xs">None</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditExample(example)}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteExample(example.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            {/* Edit Example Form */}
            {activeExample && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeExample.id ? 'Edit Training Example' : 'New Training Example'}
                  </CardTitle>
                  <CardDescription>
                    Define the example text, intent, and entities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="example-text">Example Text</Label>
                      <Textarea 
                        id="example-text"
                        value={activeExample.text}
                        onChange={(e) => setActiveExample({
                          ...activeExample,
                          text: e.target.value
                        })}
                        placeholder="Enter an example of user input"
                        className="h-24 font-mono"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Select text and click "Mark Entity" to annotate entities
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-grow">
                        <Label htmlFor="example-intent">Intent</Label>
                        <Select 
                          value={activeExample.intent}
                          onValueChange={(value) => setActiveExample({
                            ...activeExample,
                            intent: value
                          })}
                        >
                          <SelectTrigger id="example-intent">
                            <SelectValue placeholder="Select intent" />
                          </SelectTrigger>
                          <SelectContent>
                            {trainingData?.intents.map(intent => (
                              <SelectItem key={intent} value={intent}>{intent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="mark-entity" className="opacity-0">Mark Entity</Label>
                        <Button 
                          id="mark-entity"
                          variant="secondary"
                          onClick={handleAddEntity}
                          className="mt-0.5"
                        >
                          Mark Entity
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Entities</Label>
                      <div className="rounded-md border p-2 min-h-24">
                        {activeExample.entities.length === 0 ? (
                          <div className="flex items-center justify-center h-20 text-muted-foreground">
                            No entities defined. Select text and click "Mark Entity".
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {activeExample.entities.map((entity, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-muted p-2 rounded-md">
                                <div>
                                  <div className="flex items-center">
                                    <Badge variant="outline" className="mr-2">{entity.type}</Badge>
                                    <span className="font-mono text-sm">{entity.value}</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Position: {entity.start}-{entity.end}
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleRemoveEntity(idx)}
                                  className="h-8 w-8"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveExample(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveExample}
                    disabled={!activeExample.text || !activeExample.intent}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Example
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Intents Tab */}
        <TabsContent value="intents">
          <Card>
            <CardHeader>
              <CardTitle>Manage Intents</CardTitle>
              <CardDescription>
                Create and manage the intents your AI can recognize
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="New intent name..."
                      value={newIntent}
                      onChange={(e) => setNewIntent(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddIntent}
                    disabled={!newIntent.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Intent
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Current Intents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {trainingData?.intents.map(intent => (
                      <div 
                        key={intent} 
                        className="flex items-center justify-between bg-muted p-3 rounded-md"
                      >
                        <Badge variant="outline">{intent}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {filteredExamples.filter(ex => ex.intent === intent).length} examples
                        </div>
                      </div>
                    ))}
                    
                    {(!trainingData?.intents || trainingData.intents.length === 0) && (
                      <div className="col-span-full text-center py-4 text-muted-foreground">
                        No intents defined yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Entity Types Tab */}
        <TabsContent value="entities">
          <Card>
            <CardHeader>
              <CardTitle>Entity Types</CardTitle>
              <CardDescription>
                Define entity types that your AI can recognize in user messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-grow">
                    <Input
                      placeholder="New entity type..."
                      value={newEntityType}
                      onChange={(e) => setNewEntityType(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={handleAddEntityType}
                    disabled={!newEntityType.trim()}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Entity Type
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Current Entity Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {trainingData?.entityTypes.map(type => (
                      <div 
                        key={type} 
                        className="flex items-center justify-between bg-muted p-3 rounded-md"
                      >
                        <Badge>{type}</Badge>
                        <div className="text-xs text-muted-foreground">
                          {trainingData.examples.flatMap(ex => ex.entities)
                            .filter(entity => entity.type === type).length} occurrences
                        </div>
                      </div>
                    ))}
                    
                    {(!trainingData?.entityTypes || trainingData.entityTypes.length === 0) && (
                      <div className="col-span-full text-center py-4 text-muted-foreground">
                        No entity types defined yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Training Data</DialogTitle>
            <DialogDescription>
              Paste your exported training data JSON
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste JSON data here..."
            className="min-h-[200px] font-mono text-sm"
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImportData}
              disabled={!importJson.trim()}
            >
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NlpTraining;
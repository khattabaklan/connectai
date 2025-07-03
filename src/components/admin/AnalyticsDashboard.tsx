import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Download,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { apiService } from '@/lib/services/apiService';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { ChatAnalytics, Conversation, DailyStats, IntentStat } from '@/lib/services/analyticsService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  conversationsData: number[];
  leadsData: number[];
  responseTimeData: number[];
}

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [analytics, setAnalytics] = useState<ChatAnalytics | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [totalConversations, setTotalConversations] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [timeRange, setTimeRange] = useState<string>('7d');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('all');
  
  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    
    try {
      const response = await apiService.getAnalytics();
      if (response.success && response.data) {
        setAnalytics(response.data);
        
        // Filter daily stats based on selected time range
        const filteredStats = filterStatsByTimeRange(response.data.dailyStats, timeRange);
        response.data.filteredDailyStats = filteredStats;
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch conversations data
  const fetchConversations = async () => {
    try {
      const response = await apiService.getConversations(currentPage, pageSize);
      if (response.success && response.data) {
        setConversations(response.data.conversations);
        setTotalConversations(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    }
  };
  
  // Filter daily stats by time range
  const filterStatsByTimeRange = (stats: DailyStats[], range: string) => {
    const now = new Date();
    const filtered = stats.filter(stat => {
      const statDate = new Date(stat.date);
      if (range === '7d') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        return statDate >= sevenDaysAgo;
      } else if (range === '30d') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        return statDate >= thirtyDaysAgo;
      } else if (range === '90d') {
        const ninetyDaysAgo = new Date(now);
        ninetyDaysAgo.setDate(now.getDate() - 90);
        return statDate >= ninetyDaysAgo;
      }
      return true; // 'all' range
    });
    
    // Sort by date
    return filtered.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  
  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    if (analytics && analytics.dailyStats) {
      const filteredStats = filterStatsByTimeRange(analytics.dailyStats, value);
      setAnalytics(prev => ({ ...prev, filteredDailyStats: filteredStats } as ChatAnalytics));
    }
  };
  
  // View conversation details
  const viewConversationDetails = async (id: string) => {
    try {
      const response = await apiService.getConversation(id);
      if (response.success && response.data) {
        setSelectedConversation(response.data);
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching conversation details:', error);
      toast.error('Failed to load conversation details');
    }
  };
  
  // Export analytics data
  const exportAnalyticsData = async () => {
    try {
      const response = await apiService.exportAnalytics();
      if (response.success && response.data) {
        const blob = new Blob([response.data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `connectai-analytics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Analytics data exported successfully');
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      toast.error('Failed to export analytics data');
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Load data when component mounts or dependencies change
  useEffect(() => {
    fetchAnalytics();
  }, []);
  
  useEffect(() => {
    fetchConversations();
  }, [currentPage, pageSize]);
  
  // Prepare chart data
  const prepareChartData = (): ChartData | null => {
    if (!analytics || !analytics.filteredDailyStats) return null;
    
    const labels = analytics.filteredDailyStats.map((stat: DailyStats) => {
      const date = new Date(stat.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const conversationsData = analytics.filteredDailyStats.map((stat: DailyStats) => stat.conversations);
    const leadsData = analytics.filteredDailyStats.map((stat: DailyStats) => stat.leads);
    const responseTimeData = analytics.filteredDailyStats.map((stat: DailyStats) => stat.avgResponseTime);
    
    return {
      labels,
      conversationsData,
      leadsData,
      responseTimeData
    };
  };
  
  const chartData = prepareChartData();
  
  // Render loading state
  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status"></div>
          <p className="mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportAnalyticsData}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analytics?.totalConversations || 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Leads Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analytics?.leadsGenerated || 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Human Handoffs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analytics?.humanHandoffs || 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{analytics?.avgResponseTime?.toFixed(2) || '0.00'}s</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="intents">User Intents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {chartData && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Conversations Over Time</CardTitle>
                  <CardDescription>Daily conversation count</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Line 
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: 'Conversations',
                          data: chartData.conversationsData,
                          borderColor: 'rgb(79, 70, 229)',
                          backgroundColor: 'rgba(79, 70, 229, 0.1)',
                          tension: 0.4,
                          fill: true
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            precision: 0
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Leads Generated</CardTitle>
                    <CardDescription>Daily lead count</CardDescription>
                  </CardHeader>
                  <CardContent className="h-72">
                    <Bar 
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Leads',
                            data: chartData.leadsData,
                            backgroundColor: 'rgba(59, 130, 246, 0.8)'
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              precision: 0
                            }
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average response time (seconds)</CardDescription>
                  </CardHeader>
                  <CardContent className="h-72">
                    <Line 
                      data={{
                        labels: chartData.labels,
                        datasets: [
                          {
                            label: 'Response Time',
                            data: chartData.responseTimeData,
                            borderColor: 'rgb(34, 197, 94)',
                            tension: 0.4
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="conversations">
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Detailed list of user conversations with the chatbot
              </CardDescription>
              
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="lead">Leads</SelectItem>
                    <SelectItem value="handoff">Handoffs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {conversations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No conversations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      conversations.map((conversation) => (
                        <TableRow key={conversation.id}>
                          <TableCell>
                            {formatDate(conversation.startTime)}
                          </TableCell>
                          <TableCell>{conversation.messages.length}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {conversation.leadGenerated && (
                                <Badge variant="secondary">Lead</Badge>
                              )}
                              {conversation.handedOffToHuman && (
                                <Badge>Human Handoff</Badge>
                              )}
                              {conversation.conversationRating && (
                                <Badge variant={conversation.conversationRating >= 4 ? "success" : "destructive"}>
                                  {conversation.conversationRating >= 4 ? (
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                  )}
                                  {conversation.conversationRating}/5
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewConversationDetails(conversation.id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((currentPage - 1) * pageSize + 1, totalConversations)}-{Math.min(currentPage * pageSize, totalConversations)} of {totalConversations}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * pageSize >= totalConversations}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="intents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top User Intents</CardTitle>
                <CardDescription>Distribution of detected user intents</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {analytics && analytics.intentStats && (
                  <Pie
                    data={{
                      labels: analytics.intentStats.map((stat: IntentStat) => stat.intent),
                      datasets: [
                        {
                          data: analytics.intentStats.map((stat: IntentStat) => stat.count),
                          backgroundColor: [
                            'rgba(79, 70, 229, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(168, 85, 247, 0.8)',
                            'rgba(107, 114, 128, 0.8)'
                          ]
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: {
                            boxWidth: 12
                          }
                        }
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Intent Breakdown</CardTitle>
                <CardDescription>Detailed count of each user intent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Intent</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analytics && analytics.intentStats ? (
                        analytics.intentStats.map((stat: IntentStat) => (
                          <TableRow key={stat.intent}>
                            <TableCell>{stat.intent}</TableCell>
                            <TableCell>{stat.count}</TableCell>
                            <TableCell>{stat.percentage.toFixed(1)}%</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center">
                            No intent data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Conversation Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Conversation Details</DialogTitle>
            <DialogDescription>
              Started {selectedConversation && formatDate(selectedConversation.startTime)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedConversation && (
            <>
              {selectedConversation.userDetails && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">User Information</h3>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedConversation.userDetails.name && (
                        <div>
                          <span className="text-xs text-muted-foreground">Name:</span>
                          <p>{selectedConversation.userDetails.name}</p>
                        </div>
                      )}
                      {selectedConversation.userDetails.email && (
                        <div>
                          <span className="text-xs text-muted-foreground">Email:</span>
                          <p>{selectedConversation.userDetails.email}</p>
                        </div>
                      )}
                      {selectedConversation.userDetails.company && (
                        <div>
                          <span className="text-xs text-muted-foreground">Company:</span>
                          <p>{selectedConversation.userDetails.company}</p>
                        </div>
                      )}
                      {selectedConversation.userDetails.phone && (
                        <div>
                          <span className="text-xs text-muted-foreground">Phone:</span>
                          <p>{selectedConversation.userDetails.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium mb-2">Conversation</h3>
                <div className="border rounded-md overflow-hidden">
                  {selectedConversation.messages.map((message, index) => (
                    <div 
                      key={message.id}
                      className={`p-3 flex ${index % 2 === 0 ? 'bg-muted/50' : 'bg-background'}`}
                    >
                      <div className={`w-20 shrink-0 text-xs text-muted-foreground`}>
                        {message.type === 'user' ? 'User' : 'Bot'}
                      </div>
                      <div className="flex-grow">
                        <p>{message.content}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(message.timestamp)}
                          </span>
                          {message.intent && (
                            <Badge variant="outline" className="text-xs">
                              {message.intent}
                            </Badge>
                          )}
                          {message.responseTimeMs && (
                            <span className="text-xs text-muted-foreground">
                              {(message.responseTimeMs / 1000).toFixed(2)}s response time
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <div className="flex-1 text-sm text-muted-foreground">
                  Total messages: {selectedConversation.messages.length}
                </div>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalyticsDashboard;
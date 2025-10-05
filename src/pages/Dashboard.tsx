import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Globe, Sparkles, Search, Loader2, ArrowLeft, Copy, GitCompare } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [url2, setUrl2] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analysis2, setAnalysis2] = useState<any>(null);
  const { toast } = useToast();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#8b5cf6', '#06b6d4', '#f59e0b'];

  const generateMockData = (companyName: string, isSecondary = false) => ({
    companyName,
    traffic: isSecondary ? "1.8M" : "2.5M",
    mrr: isSecondary ? "$85K" : "$125K",
    techStack: isSecondary ? ["Vue", "Express", "MongoDB"] : ["React", "Node.js", "PostgreSQL"],
    businessModel: "SaaS Subscription",
    growthRate: isSecondary ? "+22%" : "+35%",
    domain: { age: isSecondary ? "3 years" : "5 years", authority: isSecondary ? "Medium" : "High" },
    prompt: `Build a B2B analytics platform focused on e-commerce businesses, offering real-time insights and automated reporting features.`,
    trafficData: [
      { month: 'Jan', visitors: isSecondary ? 1.2 : 1.8 },
      { month: 'Feb', visitors: isSecondary ? 1.4 : 2.0 },
      { month: 'Mar', visitors: isSecondary ? 1.5 : 2.2 },
      { month: 'Apr', visitors: isSecondary ? 1.6 : 2.3 },
      { month: 'May', visitors: isSecondary ? 1.7 : 2.4 },
      { month: 'Jun', visitors: isSecondary ? 1.8 : 2.5 },
    ],
    revenueData: [
      { month: 'Jan', revenue: isSecondary ? 65 : 95 },
      { month: 'Feb', revenue: isSecondary ? 70 : 105 },
      { month: 'Mar', revenue: isSecondary ? 75 : 110 },
      { month: 'Apr', revenue: isSecondary ? 78 : 115 },
      { month: 'May', revenue: isSecondary ? 82 : 120 },
      { month: 'Jun', revenue: isSecondary ? 85 : 125 },
    ],
    techDistribution: [
      { name: 'Frontend', value: 35 },
      { name: 'Backend', value: 30 },
      { name: 'Database', value: 20 },
      { name: 'DevOps', value: 15 },
    ],
  });

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a company website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Placeholder for AI analysis
    setTimeout(() => {
      setAnalysis(generateMockData("Example Corp"));
      if (compareMode && url2) {
        setAnalysis2(generateMockData("Competitor Inc", true));
      }
      setLoading(false);
      toast({
        title: "Analysis complete!",
        description: compareMode ? "Company comparison ready." : "Your company insights are ready.",
      });
    }, 2000);
  };

  const copyPrompt = () => {
    if (analysis?.prompt) {
      navigator.clipboard.writeText(analysis.prompt);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(232,83%,68%)] bg-clip-text text-transparent">
                CompanyScope
              </h1>
            </div>
          </div>
          <Button variant="ghost">Sign out</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Analyze a Company
            </CardTitle>
            <CardDescription>
              Enter any company website URL to get AI-powered insights and business intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || (compareMode && !url2)}
                variant="gradient"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode);
                  setAnalysis2(null);
                }}
              >
                <GitCompare className="w-4 h-4" />
                Compare with another company
              </Button>
            </div>

            {compareMode && (
              <div className="flex gap-2 animate-fade-in">
                <Input
                  placeholder="https://competitor.com"
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  className="flex-1"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {compareMode && analysis2 ? (
              // Comparison View
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company 1 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{analysis.companyName}</h3>
                    <Card className="hover:shadow-[var(--shadow-glow)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Traffic</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{analysis.traffic}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-[var(--shadow-glow)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Estimated MRR</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-accent">{analysis.mrr}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          <p className="text-xs text-accent">{analysis.growthRate} growth</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Company 2 */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{analysis2.companyName}</h3>
                    <Card className="hover:shadow-[var(--shadow-glow)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Traffic</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{analysis2.traffic}</div>
                      </CardContent>
                    </Card>
                    <Card className="hover:shadow-[var(--shadow-glow)]">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Estimated MRR</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-accent">{analysis2.mrr}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3 text-accent" />
                          <p className="text-xs text-accent">{analysis2.growthRate} growth</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Comparison Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" type="category" allowDuplicatedCategory={false} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line data={analysis.trafficData} type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" name={analysis.companyName} />
                        <Line data={analysis2.trafficData} type="monotone" dataKey="visitors" stroke="hsl(var(--accent))" name={analysis2.companyName} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analysis.revenueData.map((item: any, index: number) => ({
                        ...item,
                        revenue2: analysis2.revenueData[index].revenue
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" name={analysis.companyName} />
                        <Bar dataKey="revenue2" fill="hsl(var(--accent))" name={analysis2.companyName} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{analysis.companyName} - Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis.techStack.map((tech: string) => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{analysis2.companyName} - Tech Stack</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {analysis2.techStack.map((tech: string) => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              // Single Company View
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="hover:shadow-[var(--shadow-glow)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Monthly Traffic
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary">{analysis.traffic}</div>
                      <p className="text-xs text-muted-foreground mt-1">visitors/month</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-[var(--shadow-glow)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Estimated MRR
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent">{analysis.mrr}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-accent" />
                        <p className="text-xs text-accent">{analysis.growthRate} growth</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-[var(--shadow-glow)]">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Domain Authority
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{analysis.domain.authority}</div>
                      <p className="text-xs text-muted-foreground mt-1">{analysis.domain.age} old</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={analysis.trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth (K)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={analysis.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="hsl(var(--accent))" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Technology Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={analysis.techDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => entry.name}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {analysis.techDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Business Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Business Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Business Model</h4>
                      <Badge variant="secondary">{analysis.businessModel}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.techStack.map((tech: string) => (
                          <Badge key={tech} variant="outline">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lovable Prompt */}
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Your Lovable Prompt
                    </CardTitle>
                    <CardDescription>
                      A personalized startup idea inspired by this company
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed mb-4">{analysis.prompt}</p>
                    <div className="flex gap-2">
                      <Button variant="gradient" onClick={copyPrompt}>
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </Button>
                      <Button variant="outline" onClick={() => window.open('https://lovable.dev', '_blank')}>
                        Build this with Lovable
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="text-center py-16">
            <Globe className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ready to discover opportunities?</h3>
            <p className="text-muted-foreground">
              Enter a company URL above to get started with AI-powered analysis
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

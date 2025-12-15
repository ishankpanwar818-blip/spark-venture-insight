import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import echodftLogo from '@/assets/echodft-logo.png';
import { 
  BarChart3, TrendingUp, Globe, Sparkles, Search, Loader2, ArrowLeft, 
  Copy, GitCompare, Filter, DollarSign, Users, Target, Award, 
  TrendingDown, CheckCircle2, XCircle, Lightbulb, AlertTriangle
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AnimatedBackground from '@/components/3d/AnimatedBackground';
import AnalysisOrb from '@/components/3d/AnalysisOrb';

const Dashboard = () => {
  const navigate = useNavigate();
const [url, setUrl] = useState('');
const [url2, setUrl2] = useState('');
const [loading, setLoading] = useState(false);
const [compareMode, setCompareMode] = useState(false);
const [forceRefresh, setForceRefresh] = useState(false);
const [analysis, setAnalysis] = useState<any>(null);
const [savedCompanies, setSavedCompanies] = useState<any[]>([]);
const [filterIndustry, setFilterIndustry] = useState('all');
const [filterRevenue, setFilterRevenue] = useState('all');
const { toast } = useToast();

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444'];

  useEffect(() => {
    loadSavedCompanies();
  }, []);

  const loadSavedCompanies = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('companies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (filterIndustry !== 'all') {
        query = query.eq('industry', filterIndustry);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      setSavedCompanies(data || []);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const extractDomain = (input: string) => {
    try {
      return new URL(input).hostname.replace('www.', '');
    } catch {
      return input.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  const handleAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL required",
        description: "Please enter a company website URL to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Use saved analysis if available and not forcing refresh
    const domainToCheck = extractDomain(url);
    if (!forceRefresh && !compareMode) {
      const existing = savedCompanies.find((c) => c.domain === domainToCheck);
      if (existing) {
        setAnalysis({
          company: {
            name: existing.name,
            domain: existing.domain,
            description: existing.description,
            industry: existing.industry,
            businessModel: existing.business_model
          },
          traffic: existing.traffic_estimate,
          revenue: existing.revenue_estimate,
          seo: existing.seo_metrics,
          social: existing.social_presence,
          techStack: (existing.tech_stack || []).reduce((acc: any, tech: string) => {
            acc.all = acc.all || [];
            acc.all.push(tech);
            return acc;
          }, {}),
          aiInsights: existing.ai_insights,
          lovablePrompt: existing.lovable_prompt
        });
        toast({
          title: "Loaded saved analysis",
          description: "Showing your last results for consistency. Toggle Refresh to re-run.",
        });
        return;
      }
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('analyze-company', {
        body: { 
          url,
          compareUrl: compareMode && url2 ? url2 : null
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      const analysisData = data.analysis;
      setAnalysis(analysisData);

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const companyData = {
          user_id: user.id,
          url: url,
          domain: analysisData.company.domain,
          name: analysisData.company.name,
          description: analysisData.company.description,
          industry: analysisData.company.industry,
          business_model: analysisData.company.businessModel,
          tech_stack: Object.values(analysisData.techStack).flat() as string[],
          traffic_estimate: analysisData.traffic as any,
          revenue_estimate: analysisData.revenue as any,
          seo_metrics: analysisData.seo as any,
          social_presence: analysisData.social as any,
          growth_metrics: {
            trafficGrowth: analysisData.traffic.growthRate,
            revenueGrowth: analysisData.revenue.growthRate
          } as any,
          ai_insights: analysisData.aiInsights as any,
          lovable_prompt: analysisData.lovablePrompt
        };

        const { error: insertError } = await supabase
          .from('companies')
          .insert(companyData);

        if (insertError) {
          console.error('Error saving analysis:', insertError);
        } else {
          loadSavedCompanies();
        }
      }

      toast({
        title: "Analysis complete!",
        description: "AI-powered insights are ready.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze company. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = () => {
    if (analysis?.lovablePrompt) {
      navigator.clipboard.writeText(analysis.lovablePrompt);
      toast({
        title: "Copied!",
        description: "Lovable prompt copied to clipboard.",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return `$${num}`;
  };

  // Generate chart data from analysis
  const generateTrafficData = () => {
    if (!analysis) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const base = analysis.traffic.monthlyVisitors;
    const growth = analysis.traffic.growthRate / 100;
    
    return months.map((month, i) => ({
      month,
      visitors: Math.round(base * (1 - growth * (5 - i) / 5) / 1000000 * 10) / 10,
      pageViews: Math.round(base * (1 - growth * (5 - i) / 5) * 1.5 / 1000000 * 10) / 10
    }));
  };

  const generateRevenueData = () => {
    if (!analysis) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const mrr = analysis.revenue.estimatedMRR;
    const growth = analysis.revenue.growthRate / 100;
    
    return months.map((month, i) => ({
      month,
      mrr: Math.round(mrr * (1 - growth * (5 - i) / 5) / 1000),
      arr: Math.round(mrr * 12 * (1 - growth * (5 - i) / 5) / 1000)
    }));
  };

  const generateTechStackData = () => {
    if (!analysis) return [];
    return Object.entries(analysis.techStack).map(([category, tools]: [string, any]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      count: Array.isArray(tools) ? tools.length : 0
    }));
  };

  const generateCompetitionRadar = () => {
    if (!analysis) return [];
    return [
      { subject: 'Traffic', value: Math.min(analysis.traffic.monthlyVisitors / 10000, 100) },
      { subject: 'Revenue', value: Math.min(analysis.revenue.estimatedMRR / 1000, 100) },
      { subject: 'SEO', value: analysis.seo.domainAuthority },
      { subject: 'Innovation', value: analysis.aiInsights.innovationScore },
      { subject: 'Scalability', value: analysis.aiInsights.scalabilityScore },
    ];
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* 3D Animated Background */}
      <AnimatedBackground />
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <img 
                src={echodftLogo} 
                alt="EchoDFT" 
                className="w-10 h-10 drop-shadow-lg"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(232,83%,68%)] bg-clip-text text-transparent">
                  EchoDFT
                </h1>
                <p className="text-xs text-muted-foreground">Echo the Insight. Draft the Future.</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" onClick={() => navigate('/auth')}>Sign out</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search Section */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              AI-Powered Company Analysis
            </CardTitle>
            <CardDescription>
              Enter any company URL to get comprehensive business intelligence, tech stack analysis, and AI-generated insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={loading || (compareMode && !url2)}
                variant="gradient"
                size="lg"
              >
              {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>

            {/* 3D Analysis Orb - shows during loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <AnalysisOrb isLoading={true} className="w-48 h-48" />
                <p className="text-muted-foreground mt-4 text-center">
                  Gathering real data and analyzing with AI...
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  This may take 30-45 seconds for accurate results
                </p>
              </div>
            )}
            
            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCompareMode(!compareMode);
                }}
                disabled={loading}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare Companies
              </Button>
              <div className="flex items-center gap-2">
                <Switch id="refresh-toggle" checked={forceRefresh} onCheckedChange={setForceRefresh} />
                <label htmlFor="refresh-toggle" className="text-sm text-muted-foreground">Refresh data</label>
              </div>
            </div>

            {compareMode && (
              <div className="flex gap-2 animate-fade-in">
                <Input
                  placeholder="https://competitor.com"
                  value={url2}
                  onChange={(e) => setUrl2(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters */}
        {savedCompanies.length > 0 && !analysis && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Saved Analyses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Select value={filterIndustry} onValueChange={(val) => {
                  setFilterIndustry(val);
                  setTimeout(() => loadSavedCompanies(), 100);
                }}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="Fintech">Fintech</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCompanies.map((company) => (
                  <Card key={company.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    setUrl(company.url);
                    // Reconstruct analysis from saved data
                    setAnalysis({
                      company: {
                        name: company.name,
                        domain: company.domain,
                        description: company.description,
                        industry: company.industry,
                        businessModel: company.business_model
                      },
                      traffic: company.traffic_estimate,
                      revenue: company.revenue_estimate,
                      seo: company.seo_metrics,
                      social: company.social_presence,
                      techStack: company.tech_stack.reduce((acc: any, tech: string) => {
                        acc.all = acc.all || [];
                        acc.all.push(tech);
                        return acc;
                      }, {}),
                      aiInsights: company.ai_insights,
                      lovablePrompt: company.lovable_prompt
                    });
                  }}>
                    <CardHeader>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="text-xs">{company.domain}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Traffic:</span>
                          <span className="font-semibold">{formatNumber(company.traffic_estimate?.monthlyVisitors || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">MRR:</span>
                          <span className="font-semibold text-accent">{formatCurrency(company.revenue_estimate?.estimatedMRR || 0)}</span>
                        </div>
                        <Badge variant="outline">{company.industry}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {/* Company Header */}
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{analysis.company.name}</CardTitle>
                    <CardDescription className="text-base">{analysis.company.description}</CardDescription>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="default">{analysis.company.industry}</Badge>
                      <Badge variant="outline">{analysis.company.businessModel}</Badge>
                      <Badge variant="outline">{analysis.company.foundedYear}</Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setAnalysis(null)}>
                    New Analysis
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Monthly Traffic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{formatNumber(analysis.traffic.monthlyVisitors)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <p className="text-xs text-accent">{analysis.traffic.growthRate}% growth</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.traffic.organicTraffic}% organic • {analysis.traffic.paidTraffic}% paid
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Estimated MRR
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">{formatCurrency(analysis.revenue.estimatedMRR)}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-accent" />
                    <p className="text-xs text-accent">{analysis.revenue.growthRate}% growth</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ARR: {formatCurrency(analysis.revenue.estimatedARR)}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Domain Authority
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analysis.seo.domainAuthority}/100</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.seo.domainAge} years old
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(analysis.seo.backlinks)} backlinks
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analysis.competition.marketPosition}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analysis.competition.marketShare} market share
                  </p>
                  <p className="text-xs text-muted-foreground">
                    TAM: {analysis.competition.marketSize}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Traffic & Engagement Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={generateTrafficData()}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="visitors" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorVisitors)" name="Visitors (M)" />
                      <Area type="monotone" dataKey="pageViews" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorPageViews)" name="Page Views (M)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Revenue Growth Trajectory
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={generateRevenueData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="mrr" fill="hsl(var(--accent))" name="MRR ($K)" />
                      <Bar dataKey="arr" fill="hsl(var(--primary))" name="ARR ($K)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technology Stack Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={generateTechStackData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.category}: ${entry.count}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {generateTechStackData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={generateCompetitionRadar()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Score" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Info Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Complete Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analysis.techStack).map(([category, tools]: [string, any]) => (
                      <div key={category}>
                        <h4 className="font-semibold text-sm mb-2 capitalize">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(tools) && tools.map((tech: string) => (
                            <Badge key={tech} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Presence */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Presence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analysis.social).map(([platform, data]: [string, any]) => (
                      <div key={platform} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div>
                          <span className="font-semibold capitalize">{platform}</span>
                          <p className="text-xs text-muted-foreground">
                            {data.followers ? formatNumber(data.followers) : formatNumber(data.subscribers || 0)} {data.followers ? 'followers' : 'subscribers'}
                          </p>
                        </div>
                        <Badge variant={
                          data.engagement === 'high' ? 'default' : 
                          data.engagement === 'medium' ? 'outline' : 'secondary'
                        }>
                          {data.engagement}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI-Powered SWOT Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {analysis.aiInsights.strengths.map((item: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Weaknesses
                    </h4>
                    <ul className="space-y-2">
                      {analysis.aiInsights.weaknesses.map((item: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-500" />
                      Opportunities
                    </h4>
                    <ul className="space-y-2">
                      {analysis.aiInsights.opportunities.map((item: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Threats
                    </h4>
                    <ul className="space-y-2">
                      {analysis.aiInsights.threats.map((item: string, i: number) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-3">Recommended Actions</h4>
                  <ul className="space-y-2">
                    {analysis.aiInsights.recommendedActions.map((action: string, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">→</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Competition */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Landscape</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Competitive Advantage</h4>
                    <p className="text-sm text-muted-foreground">{analysis.competition.competitiveAdvantage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Main Competitors</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competition.mainCompetitors.map((competitor: string) => (
                        <Badge key={competitor} variant="outline">{competitor}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lovable Prompt */}
            <Card className="border-2 border-primary/20 shadow-[var(--shadow-glow)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Build Your Version with Lovable
                </CardTitle>
                <CardDescription>
                  AI-generated prompt to create a similar or improved business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded-lg mb-4">
                  <p className="text-sm whitespace-pre-wrap">{analysis.lovablePrompt}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyPrompt} variant="outline" className="flex-1">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Prompt
                  </Button>
                  <Button 
                    variant="gradient"
                    className="flex-1"
                    onClick={() => {
                      copyPrompt();
                      window.open('https://lovable.dev', '_blank');
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Build with Lovable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
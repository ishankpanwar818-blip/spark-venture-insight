import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, TrendingUp, Globe, Sparkles, Search, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

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
    // Will be implemented with Lovable Cloud + AI
    setTimeout(() => {
      setAnalysis({
        companyName: "Example Corp",
        traffic: "2.5M",
        mrr: "$125K",
        techStack: ["React", "Node.js", "PostgreSQL"],
        businessModel: "SaaS Subscription",
        growthRate: "+35%",
        domain: { age: "5 years", authority: "High" },
        prompt: "Build a B2B analytics platform focused on e-commerce businesses, offering real-time insights and automated reporting features."
      });
      setLoading(false);
      toast({
        title: "Analysis complete!",
        description: "Your company insights are ready.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-[hsl(232,83%,68%)] bg-clip-text text-transparent">
              CompanyScope
            </h1>
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
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleAnalyze} 
                disabled={loading}
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
          </CardContent>
        </Card>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
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
                <p className="text-foreground leading-relaxed">{analysis.prompt}</p>
                <Button variant="gradient" className="mt-4">
                  Build this with Lovable
                </Button>
              </CardContent>
            </Card>
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

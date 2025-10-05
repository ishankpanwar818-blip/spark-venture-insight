import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Search, Zap, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-0" />
        
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Business Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Scalable{' '}
              <span className="bg-gradient-to-r from-primary via-[hsl(232,83%,68%)] to-accent bg-clip-text text-transparent">
                Business Ideas
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Analyze any company's website and get AI-powered insights on their business model, 
              tech stack, revenue, and growth potential
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="gradient"
                onClick={() => navigate('/dashboard')}
                className="text-lg px-8 py-6"
              >
                <Search className="w-5 h-5" />
                Start Analyzing
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Validate Ideas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive insights into any company with just their URL
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
            <CardHeader>
              <Globe className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Deep Web Analysis</CardTitle>
              <CardDescription>
                Automatically scrape traffic data, SEO metrics, tech stack, and social presence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-accent mb-4" />
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Get intelligent estimates on business model, MRR, growth potential, and market positioning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-[var(--shadow-glow)] transition-all">
            <CardHeader>
              <Zap className="w-10 h-10 text-primary mb-4" />
              <CardTitle>Lovable Prompts</CardTitle>
              <CardDescription>
                Receive personalized startup ideas based on successful companies in your niche
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-12 pb-12 text-center">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Next Big Idea?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join entrepreneurs using CompanyScope to discover and validate 
              scalable business opportunities
            </p>
            <Button 
              size="lg" 
              variant="gradient"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;

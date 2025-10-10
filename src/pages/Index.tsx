import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Search, Zap, Globe, MousePointer2 } from 'lucide-react';
import echodftLogo from '@/assets/echodft-logo.png';
import { useState, useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section with 3D Bat Background */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        
        {/* Giant 3D Bat Logo Background - Much Larger */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-15 transform-3d floating"
          style={{
            transform: `rotateY(${mousePosition.x / 20}deg) rotateX(${-mousePosition.y / 20}deg) scale(5)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <img 
            src={echodftLogo} 
            alt="" 
            className="w-full max-w-[1400px] drop-shadow-[0_0_200px_rgba(66,153,225,0.7)]"
            style={{
              filter: 'brightness(0.3) contrast(2.5)',
            }}
          />
        </div>

        {/* Holographic Overlay */}
        <div className="absolute inset-0 holographic opacity-10 mix-blend-overlay" />
        
        {/* Glass Navigation */}
        <nav className="relative z-50 glass-strong border-b border-border/50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <img 
              src={echodftLogo} 
              alt="EchoDFT" 
              className="w-12 h-12 drop-shadow-[0_0_20px_rgba(66,153,225,0.8)]"
            />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="glass-card hover:bg-primary/20 border-0"
            >
              Sign in
            </Button>
          </div>
        </nav>
        
        <div className="relative z-10 container mx-auto px-4 py-32 md:py-40">
          <div className="max-w-5xl mx-auto text-center">
            {/* Floating Graphical Ring with Bat */}
            <div className="mb-12 floating relative">
              <div className="relative inline-block">
                {/* Outer Glow Ring */}
                <div className="absolute inset-0 blur-3xl bg-primary/40 rounded-full animate-pulse" />
                
                {/* Multiple Rotating Rings */}
                <div className="relative w-32 h-32 md:w-56 md:h-56 mx-auto">
                  {/* Main Holographic Ring */}
                  <div 
                    className="absolute inset-0 rounded-full border-[6px] border-transparent holographic opacity-80"
                    style={{
                      animation: 'spin 20s linear infinite, holographic-shift 8s ease infinite',
                      boxShadow: '0 0 60px hsl(217 91% 60%), inset 0 0 40px hsl(217 91% 60% / 0.3)',
                    }}
                  />
                  
                  {/* Secondary Ring */}
                  <div 
                    className="absolute inset-2 rounded-full border-[4px] border-primary/60"
                    style={{
                      animation: 'spin 15s linear infinite reverse',
                      boxShadow: '0 0 40px hsl(280 83% 68%), inset 0 0 30px hsl(280 83% 68% / 0.2)',
                    }}
                  />
                  
                  {/* Inner Glow Ring */}
                  <div 
                    className="absolute inset-4 rounded-full border-[3px] border-accent/80"
                    style={{
                      animation: 'spin 10s linear infinite',
                      boxShadow: '0 0 30px hsl(200 80% 55%), inset 0 0 20px hsl(200 80% 55% / 0.4)',
                    }}
                  />
                  
                  {/* Center Bat Logo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={echodftLogo} 
                      alt="EchoDFT Bat" 
                      className="w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_0_40px_rgba(66,153,225,1)]"
                      style={{
                        filter: 'brightness(1.2) contrast(1.5) drop-shadow(0 0 20px rgba(139, 92, 246, 0.9))',
                      }}
                    />
                  </div>
                  
                  {/* Particle Effects */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Holographic Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight transform-3d">
              <span className="inline-block holographic bg-clip-text text-transparent drop-shadow-2xl">
                Echo the Insight.
              </span>
              <br />
              <span className="inline-block holographic bg-clip-text text-transparent drop-shadow-2xl" style={{ animationDelay: '4s' }}>
                Draft the Future.
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto font-light backdrop-blur-sm">
              AI-powered company analysis that reveals the blueprint behind successful businesses
            </p>
            
            {/* Glass CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="glass-strong text-lg px-12 py-8 text-foreground hover:shadow-[var(--shadow-3d)] hover:scale-105 transition-all duration-300 border-2 border-primary/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-30 transition-opacity" />
                <Search className="w-6 h-6 mr-2 relative z-10" />
                <span className="relative z-10 font-semibold">Start Analyzing</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="glass-card text-lg px-12 py-8 border-2 border-border/50 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] hover:scale-105 transition-all duration-300"
              >
                <MousePointer2 className="w-6 h-6 mr-2" />
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Glass Cards */}
      <section className="relative container mx-auto px-4 py-32">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
        
        <div className="relative z-10 text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 holographic bg-clip-text text-transparent">
            Everything You Need to Validate Ideas
          </h2>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-3xl mx-auto font-light">
            Get comprehensive insights into any company with just their URL
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card className="glass-strong hover:shadow-[var(--shadow-3d)] hover:scale-105 transition-all duration-500 border-2 border-border/30 hover:border-primary/50 group">
            <CardHeader className="space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                <Globe className="relative w-16 h-16 text-primary drop-shadow-[0_0_20px_rgba(66,153,225,0.8)]" />
              </div>
              <CardTitle className="text-2xl">Deep Web Analysis</CardTitle>
              <CardDescription className="text-base text-foreground/70">
                Automatically scrape traffic data, SEO metrics, tech stack, and social presence
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-strong hover:shadow-[var(--shadow-3d)] hover:scale-105 transition-all duration-500 border-2 border-border/30 hover:border-primary/50 group">
            <CardHeader className="space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 bg-accent/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                <TrendingUp className="relative w-16 h-16 text-accent drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
              </div>
              <CardTitle className="text-2xl">AI-Powered Insights</CardTitle>
              <CardDescription className="text-base text-foreground/70">
                Get intelligent estimates on business model, MRR, growth potential, and market positioning
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass-strong hover:shadow-[var(--shadow-3d)] hover:scale-105 transition-all duration-500 border-2 border-border/30 hover:border-primary/50 group">
            <CardHeader className="space-y-6">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                <Zap className="relative w-16 h-16 text-primary drop-shadow-[0_0_20px_rgba(66,153,225,0.8)]" />
              </div>
              <CardTitle className="text-2xl">Lovable Prompts</CardTitle>
              <CardDescription className="text-base text-foreground/70">
                Receive personalized startup ideas based on successful companies in your niche
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section with Holographic Effect */}
      <section className="relative container mx-auto px-4 py-32 mb-20">
        {/* Floating Bat Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 floating">
          <img 
            src={echodftLogo} 
            alt="" 
            className="w-[800px] blur-sm"
            style={{ filter: 'brightness(0.5)' }}
          />
        </div>

        <Card className="relative max-w-5xl mx-auto glass-strong border-2 border-primary/30 overflow-hidden group">
          <div className="absolute inset-0 holographic opacity-20 group-hover:opacity-30 transition-opacity" />
          
          <CardContent className="relative z-10 pt-20 pb-20 text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl" />
              <Sparkles className="relative w-20 h-20 text-primary mx-auto drop-shadow-[0_0_30px_rgba(66,153,225,0.9)] animate-pulse" />
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 holographic bg-clip-text text-transparent">
              Ready to Find Your Next Big Idea?
            </h2>
            
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto font-light">
              Join entrepreneurs using EchoDFT to echo insights and draft the future 
              of scalable business opportunities
            </p>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="glass-strong text-xl px-16 py-10 hover:shadow-[var(--shadow-3d)] hover:scale-110 transition-all duration-500 border-2 border-primary/50 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 holographic opacity-0 group-hover/btn:opacity-40 transition-opacity" />
              <Sparkles className="w-6 h-6 mr-3 relative z-10" />
              <span className="relative z-10 font-bold">Get Started Free</span>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;

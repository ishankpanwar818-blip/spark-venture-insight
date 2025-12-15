import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Search, Zap, Globe, MousePointer2, Instagram, ExternalLink, BadgeCheck } from 'lucide-react';
import echodftLogo from '@/assets/echodft-logo.png';
import ringLogo from '@/assets/ring-logo.png';
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
    <div className="min-h-screen bg-black overflow-hidden">
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
              src={ringLogo} 
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
            {/* Golden Spiked Ring with Blue Glow */}
            <div className="mb-12 floating relative">
              <div className="relative inline-block">
                {/* Blue Outer Glow */}
                <div className="absolute inset-0 blur-[100px] bg-gradient-to-r from-blue-500/60 via-cyan-400/60 to-blue-600/60 rounded-full animate-pulse" />
                
                {/* Golden Ring with Spikes System */}
                <div className="relative w-40 h-40 md:w-64 md:h-64 mx-auto">
                  {/* Main Spiked Ring */}
                  <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 20s linear infinite' }} viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                        <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#DAA520', stopOpacity: 1 }} />
                      </linearGradient>
                      <filter id="goldGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Ring Circle */}
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="70" 
                      fill="none" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="12"
                      filter="url(#goldGlow)"
                      style={{ 
                        filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 50px rgba(255, 165, 0, 0.7))'
                      }}
                    />
                    
                    {/* Radiating Spikes - 16 spikes around the ring */}
                    {Array.from({ length: 16 }).map((_, i) => {
                      const angle = (i * 360) / 16;
                      const radians = (angle * Math.PI) / 180;
                      const innerX = 100 + Math.cos(radians) * 76;
                      const innerY = 100 + Math.sin(radians) * 76;
                      const outerX = 100 + Math.cos(radians) * 95;
                      const outerY = 100 + Math.sin(radians) * 95;
                      
                      return (
                        <line
                          key={i}
                          x1={innerX}
                          y1={innerY}
                          x2={outerX}
                          y2={outerY}
                          stroke="url(#goldGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          style={{ 
                            filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 1))',
                            opacity: 0.9
                          }}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Secondary Inner Ring */}
                  <svg className="absolute inset-0 w-full h-full" style={{ animation: 'spin 15s linear infinite reverse' }} viewBox="0 0 200 200">
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="60" 
                      fill="none" 
                      stroke="#FFD700" 
                      strokeWidth="4"
                      opacity="0.6"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))'
                      }}
                    />
                  </svg>
                  
                  {/* Clean Center with Blue Glow */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500/20 via-cyan-400/10 to-blue-600/20 blur-2xl" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Holographic Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-normal transform-3d">
              <span className="inline-block holographic bg-clip-text text-transparent drop-shadow-2xl">
                Echo the Insight.
              </span>
              <br />
              <span className="inline-block holographic bg-clip-text text-transparent drop-shadow-2xl" style={{ animationDelay: '4s' }}>
                Draft the Future.
              </span>
            </h1>
            
            <p className="text-xl md:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto font-light backdrop-blur-sm">
              AI-powered software company analysis that reveals the blueprint behind successful businesses
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
            Get comprehensive insights into any software company with just their URL
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

      {/* Professional Footer */}
      <footer className="relative border-t border-border/30 bg-black/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo & Verification */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={ringLogo} 
                  alt="EchoDFT" 
                  className="w-10 h-10 drop-shadow-[0_0_15px_rgba(66,153,225,0.6)]"
                />
                <span className="text-xl font-semibold text-foreground">EchoDFT</span>
              </div>
              
              {/* Verified Badge */}
              <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-primary/30">
                <BadgeCheck className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(66,153,225,0.8)]" />
                <span className="text-sm text-foreground/80">Verified & Owned by</span>
                <a 
                  href="https://thebatorg.netlify.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  BAT Org.
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/echodft.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-card p-3 rounded-full border border-border/30 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(66,153,225,0.4)] transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-foreground/70 group-hover:text-primary transition-colors" />
              </a>
              
              <a 
                href="https://thebatorg.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="glass-card flex items-center gap-2 px-4 py-3 rounded-full border border-border/30 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(66,153,225,0.4)] transition-all duration-300 group"
              >
                <ExternalLink className="w-4 h-4 text-foreground/70 group-hover:text-primary transition-colors" />
                <span className="text-sm text-foreground/70 group-hover:text-primary transition-colors">BAT Org.</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-border/20 text-center">
            <p className="text-sm text-foreground/50">
              © {new Date().getFullYear()} EchoDFT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
